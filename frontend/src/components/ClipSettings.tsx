const ratios = ["9:16", "1:1", "16:9"];
const exports = ["YouTube Shorts", "Instagram Reels", "TikTok"];

export const ClipSettings = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <h2 className="text-xl font-semibold">Clip Settings</h2>
      <div className="mt-4 space-y-4 text-sm">
        <div>
          <p className="font-semibold">Aspect ratio</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ratios.map((ratio) => (
              <button
                key={ratio}
                className="rounded-full border border-white/20 px-3 py-1 text-xs hover:border-brand-500"
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Overlays</p>
          <div className="mt-2 grid gap-2">
            {["Auto captions", "Emojis", "Stickers", "Text overlays", "Background music"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-xs text-slate-300">
                <input type="checkbox" className="accent-brand-500" defaultChecked={item === "Auto captions"} />
                {item}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Export preset</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {exports.map((preset) => (
              <button key={preset} className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
