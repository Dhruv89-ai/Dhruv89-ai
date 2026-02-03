const uploadOptions = [
  { label: "Upload MP4/MKV/MOV/AVI", description: "Chunked uploads with resumable support." },
  { label: "Import YouTube / Instagram", description: "Paste a link to ingest from social platforms." },
  { label: "Import Google Drive", description: "Use signed URLs for secure access." },
];

export const UploadPanel = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <h2 className="text-xl font-semibold">Ingest & source</h2>
      <p className="mt-2 text-sm text-slate-300">
        Upload large videos, connect a drive, or import social links. Automatic scene detection starts after ingest.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {uploadOptions.map((option) => (
          <div key={option.label} className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <h3 className="text-sm font-semibold">{option.label}</h3>
            <p className="mt-2 text-xs text-slate-400">{option.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed border-white/20 bg-slate-950/50 p-6 text-sm text-slate-300">
        <span>Drop file or paste a link</span>
        <button className="self-start rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold">Start upload</button>
      </div>
    </div>
  );
};
