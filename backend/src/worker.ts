import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "./lib/prisma";

const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT || 6379),
};

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://ai-service:8000";

const worker = new Worker(
  "processing",
  async (job) => {
    switch (job.name) {
      case "ingest":
        return callAi("/jobs/ingest", { video_id: job.data.videoId, source_url: job.data.sourceUrl });
      case "detect-highlights":
        return callAi("/jobs/highlights", { video_id: job.data.videoId });
      case "translate":
        return callAi("/jobs/translate", { video_id: job.data.videoId, languages: job.data.languages });
      case "render":
        return callAi("/jobs/render", { clip_id: job.data.clipId, preset: job.data.preset });
      default:
        return { status: "ignored" };
    }
  },
  { connection }
);

worker.on("completed", async (job) => {
  if (job.name === "render") {
    await prisma.clip.update({
      where: { id: job.data.clipId },
      data: { status: "READY", outputUrl: job.returnvalue?.outputUrl ?? null },
    });
  }
});

const callAi = async (path: string, payload: Record<string, unknown>) => {
  const response = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`AI service error: ${response.status}`);
  }
  return response.json();
};
