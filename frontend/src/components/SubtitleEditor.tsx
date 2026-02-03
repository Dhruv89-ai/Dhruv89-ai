const subtitles = [
  { time: "00:00", text: "Welcome to ClipForge." },
  { time: "00:02", text: "Let's create viral clips." },
  { time: "00:05", text: "Auto captions and translations ready." },
];

export const SubtitleEditor = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Subtitle Studio</h2>
          <p className="text-sm text-slate-300">Edit word-level captions, apply styles, and translate instantly.</p>
        </div>
        <button className="rounded-full border border-white/20 px-3 py-1 text-xs">Translate</button>
      </div>
      <div className="mt-4 space-y-3">
        {subtitles.map((line) => (
          <div key={line.time} className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs">
            <div className="text-slate-400">{line.time}</div>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm"
              defaultValue={line.text}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
