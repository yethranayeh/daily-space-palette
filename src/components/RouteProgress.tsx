import { useEffect } from "react";
import { useLocation } from "react-router";
import { useProgress } from "@bprogress/react";

// ? The Next adapter watched its router; React Router does not tell the bar
//   anything, so route changes drive it here
export function RouteProgress() {
  const { pathname } = useLocation();
  const { start, stop } = useProgress();

  useEffect(() => {
    start();
    const timeoutId = window.setTimeout(() => stop(), 350);

    return () => {
      window.clearTimeout(timeoutId);
      stop();
    };
  }, [pathname, start, stop]);

  return null;
}
