import { Component } from "react";

/* ═══════════════════════════════════════════════════════════════
   ErrorBoundary — Catches render errors in child components
   Shows a friendly error screen instead of blank page
   ═══════════════════════════════════════════════════════════════ */

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PETPrep Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-lg font-extrabold text-text mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-text-muted mb-4 leading-relaxed">
              {this.props.section
                ? `The ${this.props.section} section encountered an error.`
                : "An unexpected error occurred."}{" "}
              Your progress has been auto-saved.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-dark transition-colors shadow-md"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 rounded-xl border-2 border-border bg-card text-text font-bold text-sm cursor-pointer hover:border-primary transition-colors"
              >
                Reload Page
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-text-light cursor-pointer font-medium hover:text-text-muted">
                  Technical details
                </summary>
                <pre className="mt-2 text-[0.7em] text-danger bg-danger/5 border border-danger/20 rounded-lg p-3 overflow-x-auto font-mono">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
