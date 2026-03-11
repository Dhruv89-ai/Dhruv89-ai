import { Header } from "../components/Header";
import { UploadPanel } from "../components/UploadPanel";
import { TimelineEditor } from "../components/TimelineEditor";
import { ClipSettings } from "../components/ClipSettings";
import { SubtitleEditor } from "../components/SubtitleEditor";
import { JobQueue } from "../components/JobQueue";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-16 pt-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <UploadPanel />
          <JobQueue />
        </section>
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <TimelineEditor />
          <ClipSettings />
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <SubtitleEditor />
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
            <h3 className="text-lg font-semibold">AI Automation</h3>
            <p className="mt-2 text-sm text-slate-300">
              Run Whisper transcription, highlight detection, and auto-translation into 10+ languages
              using the queued AI pipeline.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>• Audio peak + emotion-based highlight ranking</li>
              <li>• Word-by-word captions with animated styles</li>
              <li>• Face tracking with smart crop for vertical output</li>
              <li>• Silence removal and summary-based clip suggestions</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
