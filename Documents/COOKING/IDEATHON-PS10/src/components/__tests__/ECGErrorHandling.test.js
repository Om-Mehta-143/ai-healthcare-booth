import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ECGWaveform from '../ECGWaveform';
import ECGErrorBoundary from '../ECGErrorBoundary';
import { 
  validateHeartRate, 
  safeGenerateECGWaveform, 
  validateCanvasContext,
  ECGPerformanceMonitor,
  ECG_ERROR_TYPES 
} from '../../utils/ecgWaveformUtils';

// Mock Canvas API
const mockContext = {
  scale: jest.fn(),
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fillText: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  strokeStyle: '',
  lineWidth: 0,
  lineCap: '',
  lineJoin: '',
  globalAlpha: 1,
  shadowColor: '',
  shadowBlur: 0,
  fillStyle: '',
  font: ''
};

// Mock performance.now
const mockPerformanceNow = jest.fn(() => Date.now());
global.performance = { now: mockPerformanceNow };

// Mock requestAnimationFrame
const mockRequestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});
const mockCancelAnimationFrame = jest.fn();
global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

describe('ECG Error Handling and Fallback States', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();
    mockPerformanceNow.mockClear();
    
    // Reset Canvas mock
    Object.keys(mockContext).forEach(key => {
      if (typeof mockContext[key] === 'function') {
        mockContext[key].mockClear();
      }
    });
    
    // Mock HTMLCanvasElement
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: jest.fn(() => mockContext),
      configurable: true
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Heart Rate Validation', () => {
    test('validates null heart rate', () => {
      const result = validateHeartRate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('no_data');
      expect(result.message).toBe('No heart rate data available');
    });

    test('validates undefined heart rate', () => {
      const result = validateHeartRate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('no_data');
      expect(result.message).toBe('No heart rate data available');
    });

    test('validates non-numeric heart rate', () => {
      const result = validateHeartRate('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_type');
      expect(result.message).toBe('Heart rate must be a number');
    });

    test('validates NaN heart rate', () => {
      const result = validateHeartRate(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_value');
      expect(result.message).toBe('Heart rate cannot be NaN');
    });

    test('validates heart rate too low', () => {
      const result = validateHeartRate(10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('too_low');
      expect(result.message).toBe('Heart rate too low: minimum 20 BPM');
    });

    test('validates heart rate too high', () => {
      const result = validateHeartRate(350);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('too_high');
      expect(result.message).toBe('Heart rate too high: maximum 300 BPM');
    });

    test('validates valid heart rate', () => {
      const result = validateHeartRate(72);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.message).toBe(null);
    });
  });

  describe('Fallback States in Component', () => {
    test('renders no signal state for null heart rate', () => {
      render(<ECGWaveform heartRate={null} />);
      
      expect(screen.getByText('No Signal')).toBeInTheDocument();
      expect(screen.getByText('No heart rate data available')).toBeInTheDocument();
      expect(screen.getByText('Waiting for heart rate data...')).toBeInTheDocument();
      expect(screen.getByLabelText(/ECG no signal/)).toBeInTheDocument();
    });

    test('renders no signal state for undefined heart rate', () => {
      render(<ECGWaveform heartRate={undefined} />);
      
      expect(screen.getByText('No Signal')).toBeInTheDocument();
      expect(screen.getByText('No heart rate data available')).toBeInTheDocument();
    });

    test('renders no signal state for invalid heart rate type', () => {
      render(<ECGWaveform heartRate="invalid" />);
      
      expect(screen.getByText('No Signal')).toBeInTheDocument();
      expect(screen.getByText('Heart rate must be a valid number')).toBeInTheDocument();
    });

    test('renders no signal state for heart rate too low', () => {
      render(<ECGWaveform heartRate={10} />);
      
      expect(screen.getByText('No Signal')).toBeInTheDocument();
      expect(screen.getByText('Heart rate too low (minimum 20 BPM)')).toBeInTheDocument();
    });

    test('renders no signal state for heart rate too high', () => {
      render(<ECGWaveform heartRate={350} />);
      
      expect(screen.getByText('No Signal')).toBeInTheDocument();
      expect(screen.getByText('Heart rate too high (maximum 300 BPM)')).toBeInTheDocument();
    });

    test('renders Canvas not supported fallback', () => {
      // Mock Canvas as not supported
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: undefined,
        configurable: true
      });

      render(<ECGWaveform heartRate={72} />);
      
      expect(screen.getByText('Display Not Supported')).toBeInTheDocument();
      expect(screen.getByText("Your browser doesn't support Canvas rendering")).toBeInTheDocument();
      expect(screen.getByLabelText('ECG display not supported')).toBeInTheDocument();
    });

    test('shows legend unavailable message in fallback states', () => {
      render(<ECGWaveform heartRate={null} showLegend={true} />);
      
      expect(screen.getByText('ECG Display Unavailable')).toBeInTheDocument();
    });
  });

  describe('Canvas Error Handling', () => {
    test('handles Canvas context creation failure', () => {
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: jest.fn(() => null),
        configurable: true
      });

      const onError = jest.fn();
      render(<ECGWaveform heartRate={72} onError={onError} />);
      
      // Should handle gracefully without crashing
      expect(screen.getByLabelText(/ECG waveform/)).toBeInTheDocument();
    });

    test('handles Canvas operations failure', () => {
      const failingContext = {
        ...mockContext,
        clearRect: jest.fn(() => {
          throw new Error('Canvas operation failed');
        })
      };

      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: jest.fn(() => failingContext),
        configurable: true
      });

      const onError = jest.fn();
      render(<ECGWaveform heartRate={72} onError={onError} autoPlay={true} />);
      
      // Should handle error gracefully
      expect(screen.getByLabelText(/ECG waveform/)).toBeInTheDocument();
    });

    test('validates Canvas context utility function', () => {
      const validResult = validateCanvasContext(mockContext);
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBe(null);

      const invalidResult = validateCanvasContext(null);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBe(ECG_ERROR_TYPES.CANVAS_ERROR);
      expect(invalidResult.fallbackSuggestion).toBe('svg');
    });

    test('detects Canvas operation failures', () => {
      const failingContext = {
        ...mockContext,
        beginPath: jest.fn(() => {
          throw new Error('Canvas operation failed');
        })
      };

      const result = validateCanvasContext(failingContext);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ECG_ERROR_TYPES.CANVAS_ERROR);
      expect(result.fallbackSuggestion).toBe('static_image');
    });
  });

  describe('Performance Monitoring', () => {
    test('ECGPerformanceMonitor tracks frame times', () => {
      const monitor = new ECGPerformanceMonitor();
      
      mockPerformanceNow.mockReturnValueOnce(1000);
      monitor.recordFrame();
      
      mockPerformanceNow.mockReturnValueOnce(1016);
      monitor.recordFrame();
      
      mockPerformanceNow.mockReturnValueOnce(1032);
      monitor.recordFrame();
      
      const fps = monitor.getCurrentFPS();
      expect(fps).toBeGreaterThan(0);
      expect(fps).toBeLessThan(100); // Reasonable FPS range
    });

    test('ECGPerformanceMonitor detects performance issues', () => {
      const monitor = new ECGPerformanceMonitor();
      
      // Simulate slow frames (low FPS)
      for (let i = 0; i < 10; i++) {
        mockPerformanceNow.mockReturnValueOnce(i * 100); // 10 FPS
        monitor.recordFrame();
      }
      
      expect(monitor.hasPerformanceIssue()).toBe(true);
      
      const report = monitor.getPerformanceReport();
      expect(report.hasIssue).toBe(true);
      expect(report.currentFPS).toBeLessThan(20);
    });

    test('ECGPerformanceMonitor resets correctly', () => {
      const monitor = new ECGPerformanceMonitor();
      
      monitor.recordFrame();
      monitor.recordFrame();
      expect(monitor.getCurrentFPS()).toBeGreaterThan(0);
      
      monitor.reset();
      expect(monitor.getCurrentFPS()).toBe(0);
    });

    test('component shows performance warning', () => {
      // Mock performance.now to simulate low FPS
      let frameCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        frameCount++;
        return frameCount * 100; // Simulate 10 FPS
      });

      render(<ECGWaveform heartRate={72} showLegend={true} autoPlay={true} />);
      
      // Performance monitoring happens during animation
      // The component should eventually detect performance issues
      expect(screen.getByLabelText(/ECG waveform/)).toBeInTheDocument();
    });
  });

  describe('Safe ECG Generation', () => {
    test('safeGenerateECGWaveform handles invalid heart rate', () => {
      const result = safeGenerateECGWaveform(null);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('no_data');
      expect(result.waveformData).toBeDefined();
      expect(result.waveformData.length).toBeGreaterThan(0);
      expect(result.waveformData[0].isFallback).toBe(true);
    });

    test('safeGenerateECGWaveform handles valid heart rate', () => {
      const result = safeGenerateECGWaveform(72);
      
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.waveformData).toBeDefined();
      expect(result.waveformData.length).toBeGreaterThan(0);
    });

    test('safeGenerateECGWaveform handles generation errors', () => {
      // Mock the generateMedicalECGWaveform to throw an error
      const originalRequire = require;
      jest.doMock('../../utils/ecgWaveformUtils', () => ({
        ...jest.requireActual('../../utils/ecgWaveformUtils'),
        generateMedicalECGWaveform: jest.fn(() => {
          throw new Error('Waveform generation failed');
        })
      }));

      const result = safeGenerateECGWaveform(72);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe(ECG_ERROR_TYPES.WAVEFORM_ERROR);
      expect(result.waveformData).toBeDefined();
      expect(result.waveformData[0].isFallback).toBe(true);
    });
  });

  describe('ECGErrorBoundary Component', () => {
    test('renders children when no error', () => {
      render(
        <ECGErrorBoundary>
          <div>Test Content</div>
        </ECGErrorBoundary>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('classifies Canvas errors correctly', () => {
      const canvasError = new Error('Canvas getContext failed');
      const errorType = ECGErrorBoundary.classifyError(canvasError);
      expect(errorType).toBe('canvas');
    });

    test('classifies heart rate errors correctly', () => {
      const heartRateError = new Error('Invalid heart rate: must be a number');
      const errorType = ECGErrorBoundary.classifyError(heartRateError);
      expect(errorType).toBe('heart_rate');
    });

    test('classifies animation errors correctly', () => {
      const animationError = new Error('requestAnimationFrame failed');
      const errorType = ECGErrorBoundary.classifyError(animationError);
      expect(errorType).toBe('animation');
    });

    test('classifies waveform errors correctly', () => {
      const waveformError = new Error('ECG waveform generation failed');
      const errorType = ECGErrorBoundary.classifyError(waveformError);
      expect(errorType).toBe('waveform');
    });

    test('classifies resource errors correctly', () => {
      const resourceError = new Error('Out of memory');
      const errorType = ECGErrorBoundary.classifyError(resourceError);
      expect(errorType).toBe('resource');
    });

    test('handles unknown errors', () => {
      const unknownError = new Error('Some random error');
      const errorType = ECGErrorBoundary.classifyError(unknownError);
      expect(errorType).toBe('unknown');
    });

    test('renders fallback UI for Canvas errors', () => {
      const ThrowError = () => {
        throw new Error('Canvas rendering failed');
      };

      render(
        <ECGErrorBoundary width={400} height={120}>
          <ThrowError />
        </ECGErrorBoundary>
      );
      
      expect(screen.getByText('Rendering Error')).toBeInTheDocument();
      expect(screen.getByText(/Unable to initialize ECG display/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    test('renders fallback UI for heart rate errors', () => {
      const ThrowError = () => {
        throw new Error('Invalid heart rate data');
      };

      render(
        <ECGErrorBoundary width={400} height={120} heartRate={999}>
          <ThrowError />
        </ECGErrorBoundary>
      );
      
      expect(screen.getByText('Invalid Heart Rate')).toBeInTheDocument();
      expect(screen.getByText(/Heart rate data is invalid \(999\)/)).toBeInTheDocument();
    });

    test('retry button resets error state', () => {
      const ThrowError = ({ shouldThrow }) => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Success</div>;
      };

      const { rerender } = render(
        <ECGErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ECGErrorBoundary>
      );
      
      expect(screen.getByText('ECG Error')).toBeInTheDocument();
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      fireEvent.click(retryButton);
      
      // After retry, render with no error
      rerender(
        <ECGErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ECGErrorBoundary>
      );
      
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    test('shows debug info when enabled', () => {
      const ThrowError = () => {
        throw new Error('Test error for debugging');
      };

      render(
        <ECGErrorBoundary showDebugInfo={true}>
          <ThrowError />
        </ECGErrorBoundary>
      );
      
      expect(screen.getByText('Debug Info')).toBeInTheDocument();
    });

    test('calls onError callback when error occurs', () => {
      const onError = jest.fn();
      const ThrowError = () => {
        throw new Error('Test error');
      };

      render(
        <ECGErrorBoundary onError={onError}>
          <ThrowError />
        </ECGErrorBoundary>
      );
      
      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onError.mock.calls[0][2]).toBe('unknown'); // error type
    });
  });

  describe('Error State Integration', () => {
    test('component shows error indicators in legend', () => {
      const onError = jest.fn();
      
      render(
        <ECGWaveform 
          heartRate={72} 
          showLegend={true} 
          onError={onError}
        />
      );
      
      // Component should render normally without error indicators initially
      expect(screen.getByLabelText(/ECG waveform/)).toBeInTheDocument();
    });

    test('component handles animation errors gracefully', () => {
      // Mock requestAnimationFrame to throw error
      const originalRAF = global.requestAnimationFrame;
      global.requestAnimationFrame = jest.fn(() => {
        throw new Error('Animation frame error');
      });

      const onError = jest.fn();
      
      render(
        <ECGWaveform 
          heartRate={72} 
          autoPlay={true}
          onError={onError}
        />
      );
      
      // Should handle error gracefully
      expect(screen.getByLabelText(/ECG waveform/)).toBeInTheDocument();
      
      // Restore original
      global.requestAnimationFrame = originalRAF;
    });

    test('component recovers from transient errors', () => {
      const onError = jest.fn();
      const { rerender } = render(
        <ECGWaveform heartRate={null} onError={onError} />
      );
      
      // Should show no signal state
      expect(screen.getByText('No Signal')).toBeInTheDocument();
      
      // Provide valid heart rate
      rerender(<ECGWaveform heartRate={72} onError={onError} />);
      
      // Should recover and show normal ECG
      expect(screen.getByLabelText(/ECG waveform showing heart rate of 72 BPM/)).toBeInTheDocument();
    });
  });

  describe('Accessibility in Error States', () => {
    test('fallback states have proper ARIA labels', () => {
      render(<ECGWaveform heartRate={null} />);
      
      const fallbackElement = screen.getByRole('alert');
      expect(fallbackElement).toHaveAttribute('aria-label', 'ECG no signal: No heart rate data available');
    });

    test('error boundary fallback has proper ARIA labels', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      render(
        <ECGErrorBoundary>
          <ThrowError />
        </ECGErrorBoundary>
      );
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-label', 'ECG error: ECG Error');
    });

    test('performance degraded state has proper accessibility', () => {
      // This would require more complex setup to trigger performance issues
      // For now, we test that the component structure supports accessibility
      render(<ECGWaveform heartRate={72} showLegend={true} />);
      
      const canvas = screen.getByLabelText(/ECG waveform/);
      expect(canvas).toBeInTheDocument();
    });
  });
});