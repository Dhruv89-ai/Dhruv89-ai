export const Header = () => {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-200">ClipForge AI</p>
          <h1 className="text-2xl font-semibold">Turn long videos into viral clips</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm">Docs</button>
          <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold hover:bg-brand-600">
            Upgrade
          </button>
        </div>
      </div>
    </header>
  );
};
