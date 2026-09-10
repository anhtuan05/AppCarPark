import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Unhandled render error:', error, errorInfo);
    }
  }

  componentDidUpdate(previousProps) {
    const previousResetKey = previousProps.resetKey;
    const { resetKey } = this.props;

    if (this.state.error && previousResetKey !== resetKey) {
      this.setState({ error: null });
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error) {
      return this.props.fallbackRender({ error, resetErrorBoundary: this.reset });
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
