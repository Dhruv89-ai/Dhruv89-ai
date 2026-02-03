const jobs = [
  { label: "Ingesting video", progress: 100 },
  { label: "Transcribing audio", progress: 72 },
  { label: "Detecting highlights", progress: 40 },
  { label: "Rendering clips", progress: 15 },
];

export const JobQueue = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <h2 className="text-xl font-semibold">Processing Queue</h2>
      <p className="mt-2 text-sm text-slate-300">Real-time progress from the distributed render workers.</p>
      <div className="mt-4 space-y-3">
        {jobs.map((job) => (
          <div key={job.label} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>{job.label}</span>
              <span className="text-slate-400">{job.progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
