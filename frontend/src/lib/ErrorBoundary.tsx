import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: unknown) => ReactNode;
}

interface ErrorBoundaryState {
  error: unknown | null;
}

/**
 * Simple error boundary to prevent a rendering error from tearing down the whole app.
 * Usage: wrap high-level layout or routes.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, info: any) {
    // Basic logging hook (could be replaced by an observability service)
    // eslint-disable-next-line no-console
    console.error("UI error captured:", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;
    if (error) {
      if (fallback) return fallback(error);
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center bg-gradient-to-br from-rose-50 to-orange-50">
          <h1 className="text-xl font-semibold text-rose-700">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-600 max-w-sm">
            An unexpected error occurred while rendering the UI.
          </p>
          <button
            onClick={this.reset}
            className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium shadow"
          >
            Try again
          </button>
          <pre className="mt-2 text-[10px] text-gray-500 max-w-md overflow-auto whitespace-pre-wrap">
            {String((error as any)?.message || error)}
          </pre>
        </div>
      );
    }
    return children;
  }
}
