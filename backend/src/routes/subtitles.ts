import { Router } from "express";
import Joi from "joi";
import { authMiddleware } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const router = Router();

const subtitleSchema = Joi.object({
  videoId: Joi.string().required(),
  language: Joi.string().required(),
  content: Joi.array().required(),
});

router.post("/", authMiddleware, async (req, res) => {
  const { error, value } = subtitleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const subtitle = await prisma.subtitle.upsert({
    where: { id: `${value.videoId}-${value.language}` },
    update: { content: value.content },
    create: {
      id: `${value.videoId}-${value.language}`,
      videoId: value.videoId,
      language: value.language,
      content: value.content,
    },
  });

  return res.json({ subtitle });
});

router.get(":videoId", authMiddleware, async (req, res) => {
  const subtitles = await prisma.subtitle.findMany({
    where: { videoId: req.params.videoId },
  });
  return res.json({ subtitles });
});
