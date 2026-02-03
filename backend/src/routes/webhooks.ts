import { Router } from "express";
import { Server } from "socket.io";
import { prisma } from "../lib/prisma";

export const router = (io: Server) => {
  const routes = Router();

  routes.post("/jobs/:jobId", async (req, res) => {
    const { status, progress, payload } = req.body;
    const job = await prisma.job.update({
      where: { id: req.params.jobId },
      data: {
        status,
        progress: progress ?? undefined,
        payload: payload ?? undefined,
      },
    });

    io.emit("job:update", job);
    return res.json({ ok: true });
  });

  return routes;
};
