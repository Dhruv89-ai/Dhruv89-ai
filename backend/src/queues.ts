import { Queue, QueueEvents } from "bullmq";
import { Server } from "socket.io";

const connection = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT || 6379),
};

export const processingQueue = new Queue("processing", { connection });

export const configureQueueEvents = (io: Server) => {
  const queueEvents = new QueueEvents("processing", { connection });

  queueEvents.on("progress", ({ jobId, data }) => {
    io.emit("job:progress", { jobId, progress: data });
  });

  queueEvents.on("completed", ({ jobId, returnvalue }) => {
    io.emit("job:complete", { jobId, result: returnvalue });
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    io.emit("job:failed", { jobId, error: failedReason });
  });
};
