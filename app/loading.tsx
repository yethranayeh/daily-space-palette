export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
      <div className="font-mono text-5xl tracking-widest uppercase text-accent animate-pulse">
        ...
      </div>
      <p className="text-ink-muted mt-4 font-mono text-xs tracking-widest uppercase">Loading</p>
    </div>
  );
}
