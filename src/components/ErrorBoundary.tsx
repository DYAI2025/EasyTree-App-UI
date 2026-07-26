import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Arboscus application UI:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-[#141713] border border-[#B8413D]/50 rounded-2xl m-4 text-center space-y-4">
          <div className="w-12 h-12 bg-[#B8413D]/20 text-[#B8413D] rounded-2xl flex items-center justify-center mx-auto border border-[#B8413D]/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1E8DC]">
              {this.props.fallbackTitle || 'Darstellungsfehler abgefangen'}
            </h3>
            <p className="text-xs text-[#C2B3A0] mt-1 leading-relaxed">
              Ein unerwarteter Zustand ist aufgetreten. Die Anwendung wurde vor einem Absturz geschützt.
            </p>
            {this.state.error?.message && (
              <code className="text-[10px] text-[#D6A875] bg-[#0B0C0B] p-2 rounded-lg block mt-2 text-left overflow-x-auto font-mono border border-[#34332D]">
                {this.state.error.message}
              </code>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-[#55735B] hover:bg-[#46614b] text-[#F1E8DC] font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Ansicht neu laden</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
