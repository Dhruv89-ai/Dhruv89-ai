import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import { router as authRouter } from "./routes/auth";
import { router as videoRouter } from "./routes/videos";
import { router as subtitleRouter } from "./routes/subtitles";
import { router as exportRouter } from "./routes/exports";
import { router as webhookRouter } from "./routes/webhooks";
import { configureQueueEvents } from "./queues";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/videos", videoRouter(io));
app.use("/api/subtitles", subtitleRouter);
app.use("/api/exports", exportRouter);
app.use("/api/webhooks", webhookRouter(io));

configureQueueEvents(io);

const port = Number(process.env.PORT || 4000);
httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${port}`);
});
