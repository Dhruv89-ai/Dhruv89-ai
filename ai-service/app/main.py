import os
import uuid
from typing import List, Optional

import requests
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel

API_WEBHOOK = os.getenv("API_WEBHOOK", "http://backend:4000/api/webhooks/jobs")

app = FastAPI(title="ClipForge AI Service")


class JobRequest(BaseModel):
  video_id: str
  source_url: Optional[str] = None
  languages: Optional[List[str]] = None


class RenderRequest(BaseModel):
  clip_id: str
  preset: Optional[str] = None


@app.post("/jobs/ingest")
async def ingest(job: JobRequest, tasks: BackgroundTasks):
  job_id = str(uuid.uuid4())
  tasks.add_task(_notify, job_id, "RUNNING", 5, {"step": "ingest"})
  tasks.add_task(_notify, job_id, "SUCCEEDED", 100, {"step": "ingest"})
  return {"jobId": job_id}


@app.post("/jobs/transcribe")
async def transcribe(job: JobRequest, tasks: BackgroundTasks):
  job_id = str(uuid.uuid4())
  tasks.add_task(_notify, job_id, "RUNNING", 10, {"step": "transcribe"})
  tasks.add_task(
    _notify,
    job_id,
    "SUCCEEDED",
    100,
    {
      "step": "transcribe",
      "transcript": [
        {"start": 0.0, "end": 1.5, "text": "Welcome to ClipForge."}
      ],
    },
  )
  return {"jobId": job_id}


@app.post("/jobs/highlights")
async def highlights(job: JobRequest, tasks: BackgroundTasks):
  job_id = str(uuid.uuid4())
  tasks.add_task(_notify, job_id, "RUNNING", 30, {"step": "highlights"})
  tasks.add_task(
    _notify,
    job_id,
    "SUCCEEDED",
    100,
    {
      "step": "highlights",
      "segments": [
        {"start": 12, "end": 38, "score": 0.92, "reason": "audio peak"}
      ],
    },
  )
  return {"jobId": job_id}


@app.post("/jobs/translate")
async def translate(job: JobRequest, tasks: BackgroundTasks):
  job_id = str(uuid.uuid4())
  tasks.add_task(_notify, job_id, "RUNNING", 50, {"step": "translate", "languages": job.languages})
  tasks.add_task(
    _notify,
    job_id,
    "SUCCEEDED",
    100,
    {
      "step": "translate",
      "languages": job.languages,
      "samples": {"en": "Hello", "es": "Hola"},
    },
  )
  return {"jobId": job_id}


@app.post("/jobs/render")
async def render(job: RenderRequest, tasks: BackgroundTasks):
  job_id = str(uuid.uuid4())
  tasks.add_task(_notify, job_id, "RUNNING", 60, {"step": "render"})
  tasks.add_task(
    _notify,
    job_id,
    "SUCCEEDED",
    100,
    {
      "step": "render",
      "outputUrl": f"s3://bucket/exports/{job.clip_id}.mp4",
    },
  )
  return {"jobId": job_id}


def _notify(job_id: str, status: str, progress: int, payload: dict):
  try:
    requests.post(
      f"{API_WEBHOOK}/{job_id}",
      json={"status": status, "progress": progress, "payload": payload},
      timeout=10,
    )
  except requests.RequestException:
    pass
