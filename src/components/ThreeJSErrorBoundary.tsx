import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ThreeJSErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ThreeJS Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-64 rounded-lg flex items-center justify-center bg-secondary/20 border border-border">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              3D Visualization Unavailable
            </h3>
            <p className="text-sm text-muted-foreground">
              Your ride status is being tracked, but the 3D view is temporarily unavailable.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeJSErrorBoundary;