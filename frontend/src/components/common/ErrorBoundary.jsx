import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto mt-20 text-center p-6 bg-white rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-4">
            Try reloading the page. If this keeps happening, the layout data may be corrupted.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;