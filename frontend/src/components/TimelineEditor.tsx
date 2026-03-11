const segments = [
  { label: "Intro", start: "00:00", end: "00:18" },
  { label: "Peak moment", start: "00:18", end: "00:45" },
  { label: "Callout", start: "00:45", end: "01:05" },
];

export const TimelineEditor = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Timeline Editor</h2>
          <p className="text-sm text-slate-300">Drag handles to trim, split, and reorder highlight segments.</p>
        </div>
        <button className="rounded-full border border-white/20 px-3 py-1 text-xs">Add cut</button>
      </div>
      <div className="mt-5 space-y-3">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{segment.label}</span>
              <span className="text-slate-400">{segment.start} - {segment.end}</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
