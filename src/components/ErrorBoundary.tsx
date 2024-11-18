import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error }) => ReactNode);
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return typeof this.props.fallback === "function"
        ? this.props.fallback({ error: this.state.error! })
        : (this.props.fallback ?? (
            <div className="tw-p-4 tw-text-red-500">
              <h2 className="tw-text-lg tw-font-semibold">
                Something went wrong
              </h2>
              <p className="tw-mt-2 tw-text-sm">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
          ));
    }

    return this.props.children;
  }
}
