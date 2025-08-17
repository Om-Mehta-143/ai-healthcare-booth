import React from 'react';

/**
 * ECGErrorBoundary Component
 * 
 * Error boundary specifically designed for ECG waveform rendering failures.
 * Provides fallback UI when Canvas rendering or ECG generation fails.
 */
class ECGErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error: error,
      errorType: ECGErrorBoundary.classifyError(error)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ECG Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorType: ECGErrorBoundary.classifyError(error)
    });

    // Report error to monitoring service if available
    if (this.props.onError && typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo, ECGErrorBoundary.classifyError(error));
    }
  }

  static classifyError(error) {
    if (!error) return 'unknown';
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorStack = error.stack?.toLowerCase() || '';
    
    // Canvas-related errors
    if (errorMessage.includes('canvas') || 
        errorMessage.includes('getcontext') ||
        errorMessage.includes('2d') ||
        errorStack.includes('canvas')) {
      return 'canvas';
    }
    
    // Heart rate validation errors
    if (errorMessage.includes('heart rate') ||
        errorMessage.includes('bpm') ||
        errorMessage.includes('invalid') && errorMessage.includes('rate')) {
      return 'heart_rate';
    }
    
    // Animation/performance errors
    if (errorMessage.includes('animation') ||
        errorMessage.includes('requestanimationframe') ||
        errorMessage.includes('performance')) {
      return 'animation';
    }
    
    // ECG generation errors
    if (errorMessage.includes('ecg') ||
        errorMessage.includes('waveform') ||
        errorMessage.includes('wave')) {
      return 'waveform';
    }
    
    // Memory/resource errors
    if (errorMessage.includes('memory') ||
        errorMessage.includes('out of') ||
        errorMessage.includes('resource')) {
      return 'resource';
    }
    
    return 'unknown';
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: null
    });
  };

  renderFallbackUI() {
    const { errorType } = this.state;
    const { width = 400, height = 120, heartRate = null } = this.props;
    
    const fallbackStyle = {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: '#0a0a0a',
      border: '1px solid #374151',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9CA3AF',
      fontSize: '14px',
      textAlign: 'center',
      padding: '16px',
      boxSizing: 'border-box'
    };

    const iconStyle = {
      fontSize: '24px',
      marginBottom: '8px',
      color: '#EF4444'
    };

    const messageStyle = {
      marginBottom: '12px',
      lineHeight: '1.4'
    };

    const retryButtonStyle = {
      backgroundColor: '#374151',
      color: '#F9FAFB',
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    };

    let icon, title, message;

    switch (errorType) {
      case 'canvas':
        icon = '🖥️';
        title = 'Rendering Error';
        message = 'Unable to initialize ECG display. Your browser may not support Canvas rendering.';
        break;
      case 'heart_rate':
        icon = '💓';
        title = 'Invalid Heart Rate';
        message = `Heart rate data is invalid${heartRate ? ` (${heartRate})` : ''}. Please check the data source.`;
        break;
      case 'animation':
        icon = '⏸️';
        title = 'Animation Error';
        message = 'ECG animation failed. The display will show a static view.';
        break;
      case 'waveform':
        icon = '📈';
        title = 'Waveform Error';
        message = 'Unable to generate ECG waveform. Using fallback display.';
        break;
      case 'resource':
        icon = '⚠️';
        title = 'Resource Error';
        message = 'Insufficient resources for ECG rendering. Try refreshing the page.';
        break;
      default:
        icon = '❌';
        title = 'ECG Error';
        message = 'An unexpected error occurred with the ECG display.';
        break;
    }

    return (
      <div style={fallbackStyle} role="alert" aria-label={`ECG error: ${title}`}>
        <div style={iconStyle}>{icon}</div>
        <div style={messageStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
          <div>{message}</div>
        </div>
        <button 
          style={retryButtonStyle}
          onClick={this.handleRetry}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4B5563'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#374151'}
        >
          Retry
        </button>
        {this.props.showDebugInfo && this.state.error && (
          <details style={{ marginTop: '12px', fontSize: '11px', color: '#6B7280' }}>
            <summary style={{ cursor: 'pointer' }}>Debug Info</summary>
            <pre style={{ marginTop: '8px', textAlign: 'left', overflow: 'auto', maxHeight: '100px' }}>
              {this.state.error.toString()}
            </pre>
          </details>
        )}
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

export default ECGErrorBoundary;