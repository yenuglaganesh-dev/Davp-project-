import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          color: '#242424',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        }}>
          <div style={{
            maxWidth: '560px',
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px solid var(--border-subtle, #E0EEE3)',
            borderRadius: '16px',
            padding: '36px 28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-primary, #242424)' }}>
              Application Render Issue Recovered
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary, #777777)', marginBottom: '24px', lineHeight: 1.6 }}>
              A component error occurred while rendering the page. The system caught the exception to prevent a blank screen.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                background: 'var(--bg-secondary, #F0FAF2)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#b91c1c',
                overflowX: 'auto',
                marginBottom: '24px',
                border: '1px solid var(--border-subtle, #E0EEE3)'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-subtle, #E0EEE3)',
                  background: 'var(--bg-secondary, #F0FAF2)',
                  color: 'var(--color-text-primary, #242424)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#7BCB91', color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

