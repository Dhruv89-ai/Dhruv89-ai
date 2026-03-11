# ClipForge AI

ClipForge AI is a production-ready SaaS starter that converts long-form videos into viral short clips with AI-powered highlights, subtitles, and multi-language support.

## Stack
- Frontend: React + TypeScript + Tailwind
- Backend: Node.js (Express) + Prisma + PostgreSQL + BullMQ (Redis)
- AI Service: Python (FastAPI) + FFmpeg/Whisper integrations
- Storage: S3-compatible object storage with signed URLs

## Quickstart
```bash
cp .env.example .env

docker compose up --build
```

## Services
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- AI Service: http://localhost:8000

## Worker
Run the BullMQ worker in a separate container or process:
```bash
cd backend
npm run build
node dist/worker.js
```

## Notes
- Update `JWT_SECRET` and cloud credentials before production use.
- Plug in Whisper/OpenAI, translation providers, and FFmpeg binaries in the AI service.
