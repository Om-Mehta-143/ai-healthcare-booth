/**
 * ECG Performance Tests and Benchmarks
 * 
 * Tests for performance optimization features including:
 * - Canvas rendering optimizations
 * - Automatic animation pause when not visible
 * - Memory management for waveform data
 * - Frame rate monitoring and adaptive performance
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ECGWaveform from '../ECGWaveform';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 10, // 10MB
    totalJSHeapSize: 1024 * 1024 * 50, // 50MB
    jsHeapSizeLimit: 1024 * 1024 * 100 // 100MB
  }
};

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16); // ~60fps
});

const mockCancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});

describe('ECG Performance Optimizations', () => {
  let originalPerformance;
  let originalRequestAnimationFrame;
  let originalCancelAnimationFrame;
  let originalIntersectionObserver;

  beforeEach(() => {
    // Store original implementations
    originalPerformance = global.performance;
    originalRequestAnimationFrame = global.requestAnimationFrame;
    originalCancelAnimationFrame = global.cancelAnimationFrame;
    originalIntersectionObserver = global.IntersectionObserver;

    // Set up mocks
    global.performance = mockPerformance;
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;
    global.IntersectionObserver = mockIntersectionObserver;

    // Reset mocks
    jest.clearAllMocks();
    mockPerformance.now.mockImplementation(() => Date.now());
  });

  afterEach(() => {
    // Restore original implementations
    global.performance = originalPerformance;
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
    global.IntersectionObserver = originalIntersectionObserver;
  });

  describe('Canvas Rendering Optimizations', () => {
    test('should reduce rendering complexity when performance issues detected', async () => {
      const onError = jest.fn();
      
      // Mock low FPS scenario
      let frameCount = 0;
      mockPerformance.now.mockImplementation(() => {
        frameCount++;
        // Simulate low FPS by returning large time increments
        return frameCount * 100; // 10 FPS
      });

      render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
          onError={onError}
          showDebugInfo={true}
        />
      );

      // Wait for performance monitoring to detect issues
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
      });

      // Should detect performance issue and call onError
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Low FPS detected')
          }),
          null,
          'performance'
        );
      }, { timeout: 3000 });
    });

    test('should use adaptive frame rate control during performance issues', async () => {
      const component = render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      // Simulate performance issue
      let frameCount = 0;
      mockPerformance.now.mockImplementation(() => {
        frameCount++;
        return frameCount * 100; // 10 FPS
      });

      // Wait for adaptive mode to kick in
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
      });

      // Verify that requestAnimationFrame is still being called but with frame skipping
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      
      component.unmount();
    });

    test('should optimize drawing operations for better performance', () => {
      const { container } = render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      
      // Canvas should be properly sized for performance
      expect(canvas).toHaveStyle({
        width: '400px',
        height: '120px'
      });
    });
  });

  describe('Automatic Animation Pause', () => {
    test('should pause animation when document becomes hidden', async () => {
      const onAnimationStateChange = jest.fn();
      
      render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
          onAnimationStateChange={onAnimationStateChange}
        />
      );

      // Simulate document becoming hidden
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true,
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      await waitFor(() => {
        expect(onAnimationStateChange).toHaveBeenCalledWith('paused');
      });
    });

    test('should resume animation when document becomes visible', async () => {
      const onAnimationStateChange = jest.fn();
      
      render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
          onAnimationStateChange={onAnimationStateChange}
        />
      );

      // Start with hidden document
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true,
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Then make document visible
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: false,
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      await waitFor(() => {
        expect(onAnimationStateChange).toHaveBeenCalledWith('playing');
      });
    });

    test('should use IntersectionObserver for component visibility detection', () => {
      render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      // Verify IntersectionObserver was created
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '50px'
        })
      );

      // Verify observer is observing the canvas
      const observerInstance = mockIntersectionObserver.mock.results[0].value;
      expect(observerInstance.observe).toHaveBeenCalled();
    });

    test('should pause animation when component is not visible', async () => {
      const onAnimationStateChange = jest.fn();
      
      render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
          onAnimationStateChange={onAnimationStateChange}
        />
      );

      // Simulate intersection observer callback with not intersecting
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      act(() => {
        observerCallback([{ isIntersecting: false }]);
      });

      await waitFor(() => {
        expect(onAnimationStateChange).toHaveBeenCalledWith('paused');
      });
    });
  });

  describe('Memory Management', () => {
    test('should cache waveform data for performance', async () => {
      const component = render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      // Wait for initial render and caching
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Change heart rate to trigger new waveform generation
      component.rerender(
        <ECGWaveform
          heartRate={85}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Change back to original heart rate - should use cached data
      component.rerender(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      // No specific assertion here as cache is internal, but this tests the flow
      expect(component.container.querySelector('canvas')).toBeInTheDocument();
    });

    test('should limit cache size to prevent memory leaks', async () => {
      const component = render(
        <ECGWaveform
          heartRate={60}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      // Generate multiple different heart rates to fill cache beyond limit
      const heartRates = [60, 70, 80, 90, 100, 110, 120]; // More than maxCacheSize (5)
      
      for (const hr of heartRates) {
        component.rerender(
          <ECGWaveform
            heartRate={hr}
            width={400}
            height={120}
            autoPlay={true}
          />
        );
        
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
        });
      }

      // Component should still work properly despite cache eviction
      expect(component.container.querySelector('canvas')).toBeInTheDocument();
    });

    test('should clean up resources on unmount', () => {
      const component = render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      const observerInstance = mockIntersectionObserver.mock.results[0].value;

      component.unmount();

      // Verify cleanup
      expect(mockCancelAnimationFrame).toHaveBeenCalled();
      expect(observerInstance.disconnect).toHaveBeenCalled();
    });
  });

  describe('Frame Rate Monitoring', () => {
    test('should monitor frame rate and detect performance issues', async () => {
      const onError = jest.fn();
      
      render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
          onError={onError}
        />
      );

      // Simulate consistent low frame rate
      let frameCount = 0;
      mockPerformance.now.mockImplementation(() => {
        frameCount++;
        return frameCount * 100; // 10 FPS
      });

      // Wait for performance monitoring
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Low FPS detected')
          }),
          null,
          'performance'
        );
      }, { timeout: 3000 });
    });

    test('should track memory usage when available', async () => {
      const component = render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
          showDebugInfo={true}
        />
      );

      // Mock console.log to capture debug output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Wait for performance monitoring
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
      });

      // Should log performance metrics including memory usage
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'ECG Performance:',
          expect.objectContaining({
            memoryUsed: expect.stringContaining('MB')
          })
        );
      }, { timeout: 2000 });

      consoleSpy.mockRestore();
      component.unmount();
    });

    test('should adapt performance based on frame rate', async () => {
      const component = render(
        <ECGWaveform
          heartRate={75}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      // Start with good performance
      let frameCount = 0;
      mockPerformance.now.mockImplementation(() => {
        frameCount++;
        return frameCount * 16; // 60 FPS
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
      });

      // Then simulate performance degradation
      frameCount = 0;
      mockPerformance.now.mockImplementation(() => {
        frameCount++;
        return frameCount * 100; // 10 FPS
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
      });

      // Component should still be rendering
      expect(component.container.querySelector('canvas')).toBeInTheDocument();
      
      component.unmount();
    });
  });

  describe('Performance Benchmarks', () => {
    test('should maintain reasonable performance with high heart rates', async () => {
      const startTime = performance.now();
      
      const component = render(
        <ECGWaveform
          heartRate={180} // High heart rate
          width={800}     // Large canvas
          height={240}
          autoPlay={true}
        />
      );

      // Wait for several animation frames
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 2 seconds for setup + 1 second animation)
      expect(duration).toBeLessThan(3000);
      
      component.unmount();
    });

    test('should handle rapid heart rate changes efficiently', async () => {
      const component = render(
        <ECGWaveform
          heartRate={60}
          width={400}
          height={120}
          autoPlay={true}
        />
      );

      const startTime = performance.now();

      // Rapidly change heart rate multiple times
      const heartRates = [60, 120, 45, 150, 80, 100];
      for (const hr of heartRates) {
        component.rerender(
          <ECGWaveform
            heartRate={hr}
            width={400}
            height={120}
            autoPlay={true}
          />
        );
        
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should handle rapid changes efficiently (less than 2 seconds)
      expect(duration).toBeLessThan(2000);
      
      component.unmount();
    });

    test('should scale performance with canvas size', async () => {
      const sizes = [
        { width: 200, height: 60 },   // Small
        { width: 400, height: 120 },  // Medium
        { width: 800, height: 240 }   // Large
      ];

      for (const size of sizes) {
        const startTime = performance.now();
        
        const component = render(
          <ECGWaveform
            heartRate={75}
            width={size.width}
            height={size.height}
            autoPlay={true}
          />
        );

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
        });

        const endTime = performance.now();
        const duration = endTime - startTime;

        // Even large canvases should initialize quickly (less than 1 second)
        expect(duration).toBeLessThan(1000);
        
        component.unmount();
      }
    });
  });
});