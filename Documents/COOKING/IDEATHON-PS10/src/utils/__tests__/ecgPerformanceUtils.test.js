/**
 * ECG Performance Utilities Tests
 * 
 * Tests for the performance monitoring and optimization utilities
 */

import { 
  ECGPerformanceMonitor, 
  CanvasOptimizer, 
  ECGMemoryManager 
} from '../ecgWaveformUtils';

describe('ECG Performance Utilities', () => {
  describe('ECGPerformanceMonitor', () => {
    let monitor;

    beforeEach(() => {
      monitor = new ECGPerformanceMonitor();
    });

    test('initializes with default values', () => {
      expect(monitor.frameTimes).toEqual([]);
      expect(monitor.performanceThreshold).toBe(20);
      expect(monitor.targetFPS).toBe(60);
      expect(monitor.adaptiveMode).toBe(false);
    });

    test('records frame times', () => {
      monitor.recordFrame();
      monitor.recordFrame();
      
      expect(monitor.frameTimes.length).toBe(2);
      expect(monitor.frameTimes[0]).toBeGreaterThan(0);
      expect(monitor.frameTimes[1]).toBeGreaterThan(monitor.frameTimes[0]);
    });

    test('calculates FPS correctly', () => {
      // Simulate frames at 60 FPS (16.67ms intervals)
      const startTime = performance.now();
      monitor.frameTimes = [
        startTime,
        startTime + 16.67,
        startTime + 33.33,
        startTime + 50,
        startTime + 66.67
      ];
      
      const fps = monitor.getCurrentFPS();
      expect(fps).toBeGreaterThan(50); // Should be around 60 FPS
      expect(fps).toBeLessThan(70);
    });

    test('detects performance issues', () => {
      // Simulate low FPS (100ms intervals = 10 FPS)
      const startTime = performance.now();
      monitor.frameTimes = [
        startTime,
        startTime + 100,
        startTime + 200,
        startTime + 300,
        startTime + 400
      ];
      
      expect(monitor.hasPerformanceIssue()).toBe(true);
    });

    test('enables adaptive mode when performance is poor', () => {
      // Simulate low FPS
      const startTime = performance.now();
      monitor.frameTimes = [
        startTime,
        startTime + 100,
        startTime + 200,
        startTime + 300,
        startTime + 400
      ];
      
      const result = monitor.updateAdaptiveMode();
      expect(result.changed).toBe(true);
      expect(result.enabled).toBe(true);
      expect(monitor.adaptiveMode).toBe(true);
    });

    test('provides comprehensive performance report', () => {
      monitor.recordFrame();
      monitor.recordFrame();
      
      const report = monitor.getPerformanceReport();
      
      expect(report).toHaveProperty('currentFPS');
      expect(report).toHaveProperty('averageFPS');
      expect(report).toHaveProperty('hasIssue');
      expect(report).toHaveProperty('adaptiveMode');
      expect(report).toHaveProperty('sampleCount');
      expect(report).toHaveProperty('threshold');
      expect(report).toHaveProperty('targetFPS');
    });

    test('resets performance data', () => {
      monitor.recordFrame();
      monitor.recordFrame();
      monitor.adaptiveMode = true;
      
      monitor.reset();
      
      expect(monitor.frameTimes).toEqual([]);
      expect(monitor.performanceHistory).toEqual([]);
      expect(monitor.adaptiveMode).toBe(false);
    });

    test('benchmarks operations', () => {
      const benchmark = monitor.startBenchmark('test-operation');
      
      expect(benchmark.name).toBe('test-operation');
      expect(benchmark.startTime).toBeGreaterThan(0);
      
      // Simulate some work
      const result = monitor.endBenchmark(benchmark);
      
      expect(result.name).toBe('test-operation');
      expect(result.duration).toBeGreaterThan(0);
      expect(result.endTime).toBeGreaterThan(result.startTime);
    });
  });

  describe('CanvasOptimizer', () => {
    let canvas;
    let ctx;

    beforeEach(() => {
      // Create a mock canvas and context
      canvas = {
        width: 0,
        height: 0,
        style: {},
        getContext: jest.fn()
      };
      
      ctx = {
        scale: jest.fn(),
        clearRect: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        setTransform: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn()
      };
      
      canvas.getContext.mockReturnValue(ctx);
    });

    test('optimizes canvas for high DPI displays', () => {
      const originalDevicePixelRatio = window.devicePixelRatio;
      window.devicePixelRatio = 2;
      
      const ratio = CanvasOptimizer.optimizeForHighDPI(canvas, ctx, 400, 120);
      
      expect(canvas.width).toBe(800); // 400 * 2
      expect(canvas.height).toBe(240); // 120 * 2
      expect(canvas.style.width).toBe('400px');
      expect(canvas.style.height).toBe('120px');
      expect(ctx.scale).toHaveBeenCalledWith(2, 2);
      expect(ratio).toBe(2);
      
      window.devicePixelRatio = originalDevicePixelRatio;
    });

    test('sets up performance optimizations', () => {
      const optimizedCtx = CanvasOptimizer.setupPerformanceOptimizations(ctx, false);
      
      expect(optimizedCtx.lineCap).toBe('round');
      expect(optimizedCtx.lineJoin).toBe('round');
      expect(optimizedCtx.globalCompositeOperation).toBe('source-over');
    });

    test('clears canvas efficiently', () => {
      CanvasOptimizer.clearCanvas(ctx, 400, 120, false);
      
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 400, 120);
      expect(ctx.restore).toHaveBeenCalled();
    });

    test('clears canvas in performance mode', () => {
      CanvasOptimizer.clearCanvas(ctx, 400, 120, true);
      
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 400, 120);
      expect(ctx.save).not.toHaveBeenCalled();
    });

    test('optimizes path drawing', () => {
      const points = [
        { x: 0, y: 50 },
        { x: 10, y: 60 },
        { x: 20, y: 40 },
        { x: 30, y: 70 }
      ];
      
      CanvasOptimizer.optimizePathDrawing(ctx, points, false);
      
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(0, 50);
      expect(ctx.lineTo).toHaveBeenCalledTimes(3);
      expect(ctx.stroke).toHaveBeenCalled();
    });

    test('optimizes path drawing in performance mode', () => {
      // Create many points to test performance optimization
      const points = Array.from({ length: 1000 }, (_, i) => ({
        x: i,
        y: 50 + Math.sin(i * 0.1) * 20
      }));
      
      CanvasOptimizer.optimizePathDrawing(ctx, points, true);
      
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(0, 50);
      // Should skip points for performance (max 200 points)
      expect(ctx.lineTo).toHaveBeenCalledTimes(200);
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  describe('ECGMemoryManager', () => {
    let memoryManager;

    beforeEach(() => {
      memoryManager = new ECGMemoryManager({ maxCacheSize: 3 });
    });

    test('initializes with correct settings', () => {
      expect(memoryManager.maxCacheSize).toBe(3);
      expect(memoryManager.cache.size).toBe(0);
    });

    test('caches and retrieves waveform data', () => {
      const testData = [{ x: 0, y: 50 }, { x: 10, y: 60 }];
      const generator = jest.fn(() => testData);
      
      const result1 = memoryManager.getWaveformData('test-key', generator);
      expect(generator).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(testData);
      
      // Second call should use cache
      const result2 = memoryManager.getWaveformData('test-key', generator);
      expect(generator).toHaveBeenCalledTimes(1); // Not called again
      expect(result2).toEqual(testData);
    });

    test('evicts least recently used entries when cache is full', () => {
      const generator = (data) => () => data;
      
      // Fill cache to capacity
      memoryManager.getWaveformData('key1', generator([1]));
      memoryManager.getWaveformData('key2', generator([2]));
      memoryManager.getWaveformData('key3', generator([3]));
      
      expect(memoryManager.cache.size).toBe(3);
      
      // Access key1 to make it recently used
      memoryManager.getWaveformData('key1', generator([1]));
      
      // Add new entry, should evict key2 (least recently used)
      memoryManager.getWaveformData('key4', generator([4]));
      
      expect(memoryManager.cache.size).toBe(3);
      expect(memoryManager.cache.has('key1')).toBe(true);
      expect(memoryManager.cache.has('key2')).toBe(false); // Evicted
      expect(memoryManager.cache.has('key3')).toBe(true);
      expect(memoryManager.cache.has('key4')).toBe(true);
    });

    test('provides cache statistics', () => {
      const generator = (data) => () => data;
      
      memoryManager.getWaveformData('key1', generator([1, 2, 3]));
      memoryManager.getWaveformData('key2', generator([4, 5]));
      
      const stats = memoryManager.getCacheStats();
      
      expect(stats.entryCount).toBe(2);
      expect(stats.maxSize).toBe(3);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.entries).toHaveLength(2);
      expect(stats.entries[0]).toHaveProperty('key');
      expect(stats.entries[0]).toHaveProperty('accessCount');
    });

    test('clears all cached data', () => {
      const generator = () => [1, 2, 3];
      
      memoryManager.getWaveformData('key1', generator);
      memoryManager.getWaveformData('key2', generator);
      
      expect(memoryManager.cache.size).toBe(2);
      
      memoryManager.clear();
      
      expect(memoryManager.cache.size).toBe(0);
    });

    test('estimates data size correctly', () => {
      const smallData = [{ x: 1, y: 2 }];
      const largeData = Array.from({ length: 100 }, (_, i) => ({ x: i, y: i * 2 }));
      
      const smallSize = memoryManager.estimateDataSize(smallData);
      const largeSize = memoryManager.estimateDataSize(largeData);
      
      expect(smallSize).toBe(100); // 1 point * 100 bytes
      expect(largeSize).toBe(10000); // 100 points * 100 bytes
      expect(largeSize).toBeGreaterThan(smallSize);
    });

    test('performs periodic cleanup of old entries', () => {
      const generator = () => [1, 2, 3];
      
      // Mock Date.now to control time
      const originalNow = Date.now;
      let currentTime = 1000;
      Date.now = jest.fn(() => currentTime);
      
      memoryManager.getWaveformData('key1', generator);
      
      // Advance time beyond maxDataAge (30 seconds)
      currentTime += 35000;
      
      // Force cleanup
      memoryManager.forceCleanup();
      
      expect(memoryManager.cache.size).toBe(0);
      
      Date.now = originalNow;
    });
  });
});