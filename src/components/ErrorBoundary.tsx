import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const initialState: State = { hasError: false, error: null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = initialState;

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[TrainHyp ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-8">
          <div className="bg-white rounded-[24px] p-10 shadow-[0_4px_40px_-4px_rgba(19,27,46,0.08)] border border-[#c2c6d6]/20 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-[#ffeed9] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-[#a04e00]" />
            </div>
            <h2 className="text-2xl font-bold text-[#131b2e] tracking-tight mb-3">
              Something went wrong
            </h2>
            <p className="text-[13px] text-[#424754] leading-relaxed mb-4">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <pre className="text-[11px] bg-[#f2f3ff] text-[#424754] rounded-xl p-4 text-left overflow-auto mb-6 max-h-40 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => this.setState(initialState)}
              className="inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004395] text-white font-bold text-[13px] px-6 py-3 rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,88,190,0.2)]"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
