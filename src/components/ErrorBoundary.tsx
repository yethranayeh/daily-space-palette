import type { ErrorInfo, ReactNode } from "react";

import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("::APP_ERROR -", error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
        <div className="font-mono text-5xl tracking-widest uppercase text-accent">500</div>
        <h1 className="text-[28px] font-semibold text-ink mb-3">Something went wrong</h1>
        <p className="text-ink-subtle mb-8 max-w-100 leading-[1.6]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => this.setState({ error: null })}
          className="font-mono text-xs tracking-wide uppercase text-accent no-underline px-6 py-3 border border-line rounded-ui-sm cursor-pointer hover:bg-surface-raised transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}
