import { Router } from "express";
import { Server } from "socket.io";
import multer from "multer";
import Joi from "joi";
import { authMiddleware } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { processingQueue } from "../queues";
import { v4 as uuid } from "uuid";

const upload = multer({
  dest: "tmp/uploads",
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["video/mp4", "video/x-matroska", "video/quicktime", "video/x-msvideo"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    return cb(null, true);
  },
});

const createVideoSchema = Joi.object({
  title: Joi.string().required(),
  sourceUrl: Joi.string().uri().required(),
  language: Joi.string().optional(),
});

const clipSchema = Joi.object({
  title: Joi.string().required(),
  startSec: Joi.number().integer().min(0).required(),
  endSec: Joi.number().integer().min(1).required(),
  aspectRatio: Joi.string().valid("9:16", "1:1", "16:9").required(),
  exportPreset: Joi.string().required(),
});

export const router = (io: Server) => {
  const routes = Router();

  routes.post("/upload", authMiddleware, upload.single("video"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Missing file" });
    }

    const video = await prisma.video.create({
      data: {
        userId: (req as any).user.userId,
        title: req.file.originalname,
        sourceUrl: `s3://bucket/${req.file.filename}`,
        status: "UPLOADED",
      },
    });

    const jobId = uuid();
    await prisma.job.create({
      data: {
        id: jobId,
        videoId: video.id,
        type: "INGEST",
        payload: { localPath: req.file.path },
      },
    });
    await processingQueue.add(
      "ingest",
      { videoId: video.id, localPath: req.file.path },
      { jobId }
    );

    io.emit("video:uploaded", { videoId: video.id });
    return res.status(201).json({ video, jobId });
  });

  routes.post("/import", authMiddleware, async (req, res) => {
    const { error, value } = createVideoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const video = await prisma.video.create({
      data: {
        userId: (req as any).user.userId,
        title: value.title,
        sourceUrl: value.sourceUrl,
        language: value.language,
        status: "UPLOADED",
      },
    });

    const jobId = uuid();
    await prisma.job.create({
      data: {
        id: jobId,
        videoId: video.id,
        type: "INGEST",
        payload: { sourceUrl: value.sourceUrl },
      },
    });
    await processingQueue.add("ingest", { videoId: video.id, sourceUrl: value.sourceUrl }, { jobId });

    return res.status(201).json({ video, jobId });
  });

  routes.get("/signed-url", authMiddleware, (_req, res) => {
    const key = `uploads/${uuid()}.mp4`;
    return res.json({
      uploadUrl: `https://storage.example.com/${key}?signature=stub`,
      key,
    });
  });

  routes.get("/", authMiddleware, async (req, res) => {
    const videos = await prisma.video.findMany({
      where: { userId: (req as any).user.userId },
      orderBy: { createdAt: "desc" },
      include: { clips: true },
    });
    return res.json({ videos });
  });

  routes.post("/:videoId/clips", authMiddleware, async (req, res) => {
    const { error, value } = clipSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const clip = await prisma.clip.create({
      data: {
        videoId: req.params.videoId,
        title: value.title,
        startSec: value.startSec,
        endSec: value.endSec,
        aspectRatio: value.aspectRatio,
        exportPreset: value.exportPreset,
      },
    });

    const jobId = uuid();
    await prisma.job.create({
      data: {
        id: jobId,
        videoId: clip.videoId,
        type: "RENDER",
        payload: { clipId: clip.id, exportPreset: value.exportPreset },
      },
    });
    await processingQueue.add("render", { clipId: clip.id }, { jobId });

    return res.status(201).json({ clip, jobId });
  });

  routes.post("/:videoId/highlights", authMiddleware, async (req, res) => {
    const jobId = uuid();
    await prisma.job.create({
      data: {
        id: jobId,
        videoId: req.params.videoId,
        type: "DETECT_HIGHLIGHTS",
        payload: {},
      },
    });
    await processingQueue.add("detect-highlights", { videoId: req.params.videoId }, { jobId });
    return res.status(202).json({ jobId });
  });

  routes.post("/:videoId/translate", authMiddleware, async (req, res) => {
    const { languages } = req.body;
    const jobId = uuid();
    await prisma.job.create({
      data: {
        id: jobId,
        videoId: req.params.videoId,
        type: "TRANSLATE",
        payload: { languages },
      },
    });
    await processingQueue.add("translate", { videoId: req.params.videoId, languages }, { jobId });
    return res.status(202).json({ jobId });
  });

  return routes;
};
