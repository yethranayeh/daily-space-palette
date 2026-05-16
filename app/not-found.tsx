import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
      <div className="font-mono text-5xl tracking-widest uppercase text-accent">404</div>
      <h1 className="text-[28px] font-semibold text-ink mb-3">Page not found</h1>
      <p className="text-ink-subtle mb-8 max-w-[400px] leading-[1.6]">
        The page you&apos;re looking for does not exist
      </p>
      <Link
        href="/"
        className="font-mono text-xs tracking-wide uppercase text-accent no-underline px-6 py-3 border border-line rounded-ui-sm"
      >
        Back to home
      </Link>
    </div>
  );
}
