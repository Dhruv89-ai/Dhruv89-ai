import { Router } from "express";
import Joi from "joi";
import { authMiddleware } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { processingQueue } from "../queues";
import { v4 as uuid } from "uuid";

export const router = Router();

const exportSchema = Joi.object({
  clipId: Joi.string().required(),
  preset: Joi.string().required(),
});

router.post("/render", authMiddleware, async (req, res) => {
  const { error, value } = exportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const clip = await prisma.clip.findUnique({ where: { id: value.clipId } });
  if (!clip) {
    return res.status(404).json({ error: "Clip not found" });
  }

  const jobId = uuid();
  await prisma.job.create({
    data: {
      id: jobId,
      videoId: clip.videoId,
      type: "RENDER",
      payload: { clipId: value.clipId, preset: value.preset },
    },
  });
  await processingQueue.add("render", { clipId: value.clipId, preset: value.preset }, { jobId });

  return res.status(202).json({ jobId });
});
