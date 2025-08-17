/**
 * ECG Waveform Generation Utilities
 * 
 * This module provides utilities for generating medically accurate ECG waveforms
 * based on heart rate data, including P-QRS-T wave morphology and heart rate classification.
 */

/**
 * Heart rate classification constants
 */
export const HEART_RATE_CLASSIFICATIONS = {
  BRADYCARDIA: 'bradycardia',
  NORMAL: 'normal',
  TACHYCARDIA: 'tachycardia'
};

/**
 * ECG wave type constants
 */
export const ECG_WAVE_TYPES = {
  P: 'P',
  QRS: 'QRS',
  T: 'T',
  BASELINE: 'baseline'
};

/**
 * Standard ECG timing constants (in milliseconds)
 */
export const ECG_TIMING = {
  P_WAVE_DURATION: 100,      // 0.08-0.12s typical
  PR_INTERVAL: 160,          // 0.12-0.20s typical
  QRS_DURATION: 80,          // 0.06-0.10s typical
  ST_SEGMENT: 100,           // 0.08-0.12s typical
  T_WAVE_DURATION: 160       // 0.16s typical
};

/**
 * Standard ECG amplitude constants (in mV)
 */
export const ECG_AMPLITUDES = {
  P_WAVE: 0.25,
  QRS_COMPLEX: 1.5,
  T_WAVE: 0.3,
  BASELINE: 0
};

/**
 * Classifies heart rate into medical categories
 * @param {number} heartRate - Heart rate in BPM
 * @returns {string} Classification: 'bradycardia', 'normal', or 'tachycardia'
 */
export function classifyHeartRate(heartRate) {
  if (typeof heartRate !== 'number' || heartRate < 20 || heartRate > 300) {
    throw new Error('Invalid heart rate: must be a number between 20 and 300 BPM');
  }
  
  if (heartRate < 60) {
    return HEART_RATE_CLASSIFICATIONS.BRADYCARDIA;
  } else if (heartRate <= 100) {
    return HEART_RATE_CLASSIFICATIONS.NORMAL;
  } else {
    return HEART_RATE_CLASSIFICATIONS.TACHYCARDIA;
  }
}

/**
 * Calculates ECG wave parameters based on heart rate
 * @param {number} heartRate - Heart rate in BPM
 * @returns {Object} Wave parameters including cycle length, durations, and amplitudes
 */
export function calculateECGParameters(heartRate) {
  if (typeof heartRate !== 'number' || heartRate < 20 || heartRate > 300) {
    throw new Error('Invalid heart rate: must be a number between 20 and 300 BPM');
  }

  const rrInterval = (60 / heartRate) * 1000; // RR interval in milliseconds
  const classification = classifyHeartRate(heartRate);
  
  // Adjust wave parameters based on heart rate classification
  let amplitudeMultiplier = 1.0;
  let durationMultiplier = 1.0;
  
  switch (classification) {
    case HEART_RATE_CLASSIFICATIONS.BRADYCARDIA:
      amplitudeMultiplier = 1.2; // Slightly higher amplitude for bradycardia
      durationMultiplier = 1.1;  // Slightly longer durations
      break;
    case HEART_RATE_CLASSIFICATIONS.TACHYCARDIA:
      amplitudeMultiplier = 0.8; // Slightly lower amplitude for tachycardia
      durationMultiplier = 0.9;  // Slightly shorter durations
      break;
    default:
      // Normal heart rate - use standard values
      break;
  }

  return {
    cycleLength: rrInterval,
    classification,
    pWave: {
      duration: ECG_TIMING.P_WAVE_DURATION * durationMultiplier,
      amplitude: ECG_AMPLITUDES.P_WAVE * amplitudeMultiplier,
      type: ECG_WAVE_TYPES.P
    },
    prInterval: ECG_TIMING.PR_INTERVAL * durationMultiplier,
    qrsComplex: {
      duration: ECG_TIMING.QRS_DURATION * durationMultiplier,
      amplitude: ECG_AMPLITUDES.QRS_COMPLEX * amplitudeMultiplier,
      type: ECG_WAVE_TYPES.QRS
    },
    stSegment: ECG_TIMING.ST_SEGMENT * durationMultiplier,
    tWave: {
      duration: ECG_TIMING.T_WAVE_DURATION * durationMultiplier,
      amplitude: ECG_AMPLITUDES.T_WAVE * amplitudeMultiplier,
      type: ECG_WAVE_TYPES.T
    }
  };
}
/**
 * Generates P wave morphology using a medically accurate biphasic curve
 * @param {number} t - Time parameter (0 to 1 across wave duration)
 * @param {number} amplitude - Peak amplitude of the P wave
 * @param {string} classification - Heart rate classification for morphology adjustment
 * @returns {number} Y coordinate for the P wave at time t
 */
export function generatePWave(t, amplitude = ECG_AMPLITUDES.P_WAVE, classification = HEART_RATE_CLASSIFICATIONS.NORMAL) {
  if (t < 0 || t > 1) {
    return 0;
  }
  
  // P wave morphology adjustments based on heart rate classification
  let morphologyFactor = 1.0;
  let asymmetryFactor = 0.5; // Peak position (0.5 = symmetric)
  
  switch (classification) {
    case HEART_RATE_CLASSIFICATIONS.BRADYCARDIA:
      // Bradycardia: broader, more rounded P waves with higher amplitude
      morphologyFactor = 1.2;
      asymmetryFactor = 0.45; // Slightly earlier peak
      amplitude = amplitude * 1.1; // Increase amplitude for bradycardia
      break;
    case HEART_RATE_CLASSIFICATIONS.TACHYCARDIA:
      // Tachycardia: narrower, more peaked P waves
      morphologyFactor = 0.8;
      asymmetryFactor = 0.55; // Slightly later peak
      amplitude = amplitude * 0.9; // Decrease amplitude for tachycardia
      break;
    default:
      // Normal: standard morphology
      break;
  }
  
  // Generate medically accurate P wave using modified Gaussian
  // P wave is typically smooth and rounded with slight asymmetry
  const center = asymmetryFactor;
  const width = 0.25 * morphologyFactor;
  const exponent = -Math.pow((t - center) / width, 2);
  
  // Add subtle biphasic component for medical accuracy
  const biphasicComponent = 0.05 * amplitude * Math.sin(2 * Math.PI * t);
  const mainComponent = amplitude * Math.exp(exponent);
  
  return mainComponent + biphasicComponent;
}

/**
 * Generates QRS complex morphology with medically accurate sharp deflections
 * @param {number} t - Time parameter (0 to 1 across QRS duration)
 * @param {number} amplitude - Peak amplitude of the QRS complex
 * @param {string} classification - Heart rate classification for morphology adjustment
 * @returns {number} Y coordinate for the QRS complex at time t
 */
export function generateQRSComplex(t, amplitude = ECG_AMPLITUDES.QRS_COMPLEX, classification = HEART_RATE_CLASSIFICATIONS.NORMAL) {
  if (t < 0 || t > 1) {
    return 0;
  }
  
  // QRS morphology adjustments based on heart rate classification
  let qAmplitudeRatio = 0.1;  // Q wave amplitude ratio
  let sAmplitudeRatio = 0.2;  // S wave amplitude ratio
  let sharpnessFactor = 1.0;  // Controls the sharpness of transitions
  
  switch (classification) {
    case HEART_RATE_CLASSIFICATIONS.BRADYCARDIA:
      // Bradycardia: slightly wider QRS, more pronounced Q and S waves
      qAmplitudeRatio = 0.12;
      sAmplitudeRatio = 0.25;
      sharpnessFactor = 0.9; // Slightly less sharp
      break;
    case HEART_RATE_CLASSIFICATIONS.TACHYCARDIA:
      // Tachycardia: narrower QRS, less pronounced Q and S waves
      qAmplitudeRatio = 0.08;
      sAmplitudeRatio = 0.15;
      sharpnessFactor = 1.2; // Sharper transitions
      break;
    default:
      // Normal: standard morphology
      break;
  }
  
  // QRS complex: Q wave, R wave, S wave with medical timing
  // Q wave (negative deflection): t = 0 to 0.15 (shorter for medical accuracy)
  if (t <= 0.15) {
    const qAmplitude = -qAmplitudeRatio * amplitude;
    const qT = t / 0.15;
    // Use exponential decay for more realistic Q wave
    return qAmplitude * Math.sin(Math.PI * qT) * Math.exp(-2 * qT);
  }
  
  // R wave (positive deflection): t = 0.15 to 0.65 (medical standard)
  if (t <= 0.65) {
    const rT = (t - 0.15) / 0.5;
    
    // Sharp upstroke: t = 0.15 to 0.35
    if (rT <= 0.4) {
      const upstrokeT = rT / 0.4;
      // Exponential upstroke for sharp rise
      return amplitude * Math.pow(upstrokeT, 1 / sharpnessFactor);
    } else {
      // Sharp downstroke: t = 0.35 to 0.65
      const downstrokeT = (rT - 0.4) / 0.6;
      // Exponential downstroke for sharp fall
      return amplitude * Math.pow(1 - downstrokeT, sharpnessFactor);
    }
  }
  
  // S wave (negative deflection): t = 0.65 to 1.0
  const sAmplitude = -sAmplitudeRatio * amplitude;
  const sT = (t - 0.65) / 0.35;
  
  // S wave with realistic morphology
  if (sT <= 0.6) {
    // Sharp downward deflection
    return sAmplitude * Math.sin(Math.PI * sT / 0.6) * sharpnessFactor;
  } else {
    // Return to baseline
    const returnT = (sT - 0.6) / 0.4;
    return sAmplitude * (1 - returnT) * Math.exp(-3 * returnT);
  }
}

/**
 * Generates T wave morphology using a medically accurate asymmetric curve
 * @param {number} t - Time parameter (0 to 1 across wave duration)
 * @param {number} amplitude - Peak amplitude of the T wave
 * @param {string} classification - Heart rate classification for morphology adjustment
 * @returns {number} Y coordinate for the T wave at time t
 */
export function generateTWave(t, amplitude = ECG_AMPLITUDES.T_WAVE, classification = HEART_RATE_CLASSIFICATIONS.NORMAL) {
  if (t < 0 || t > 1) {
    return 0;
  }
  
  // T wave morphology adjustments based on heart rate classification
  let asymmetryFactor = 0.6; // Peak position (normal: 60% of duration)
  let sharpnessFactor = 1.0;
  let inversionRisk = 0.0; // Risk of T wave inversion
  
  switch (classification) {
    case HEART_RATE_CLASSIFICATIONS.BRADYCARDIA:
      // Bradycardia: more symmetric, broader T waves
      asymmetryFactor = 0.55;
      sharpnessFactor = 0.9;
      inversionRisk = 0.02; // Slight risk of inversion
      break;
    case HEART_RATE_CLASSIFICATIONS.TACHYCARDIA:
      // Tachycardia: more asymmetric, narrower T waves, higher inversion risk
      asymmetryFactor = 0.65;
      sharpnessFactor = 1.1;
      inversionRisk = 0.05; // Higher risk of inversion
      break;
    default:
      // Normal: standard morphology
      break;
  }
  
  // Generate medically accurate T wave with asymmetric morphology
  let tWaveValue;
  
  if (t <= asymmetryFactor) {
    // Upstroke - gradual rise (medical characteristic)
    const upstrokeT = t / asymmetryFactor;
    // Use power function for realistic upstroke curve
    tWaveValue = amplitude * Math.pow(Math.sin((Math.PI / 2) * upstrokeT), 1 / sharpnessFactor);
  } else {
    // Downstroke - faster fall (medical characteristic)
    const downstrokeT = (t - asymmetryFactor) / (1 - asymmetryFactor);
    // Use exponential decay for realistic downstroke
    tWaveValue = amplitude * Math.cos((Math.PI / 2) * downstrokeT) * Math.exp(-0.5 * downstrokeT * sharpnessFactor);
  }
  
  // Add subtle notching for medical realism (but keep amplitude within bounds)
  const notchingFactor = 0.01 * amplitude * Math.sin(4 * Math.PI * t);
  
  // Ensure the final value doesn't exceed the specified amplitude
  const finalValue = tWaveValue + notchingFactor;
  return Math.min(Math.abs(finalValue), amplitude) * Math.sign(finalValue);
}

/**
 * Generates a complete ECG cycle (P-QRS-T) based on heart rate
 * @param {number} heartRate - Heart rate in BPM
 * @param {number} samplingRate - Number of samples per second (default: 500)
 * @returns {Array} Array of ECG data points with x (time) and y (amplitude) coordinates
 */
export function generateECGCycle(heartRate, samplingRate = 500) {
  const parameters = calculateECGParameters(heartRate);
  const cycleDuration = parameters.cycleLength; // in milliseconds
  const sampleInterval = 1000 / samplingRate; // milliseconds per sample
  const totalSamples = Math.floor(cycleDuration / sampleInterval);
  
  const ecgData = [];
  let currentTime = 0;
  
  // Define timing boundaries for each wave component
  const pStart = 0;
  const pEnd = parameters.pWave.duration;
  const qrsStart = pEnd + parameters.prInterval;
  const qrsEnd = qrsStart + parameters.qrsComplex.duration;
  const tStart = qrsEnd + parameters.stSegment;
  const tEnd = tStart + parameters.tWave.duration;
  
  for (let i = 0; i < totalSamples; i++) {
    let amplitude = ECG_AMPLITUDES.BASELINE;
    let waveType = ECG_WAVE_TYPES.BASELINE;
    
    // Determine which wave component we're in and calculate amplitude
    if (currentTime >= pStart && currentTime <= pEnd) {
      // P wave with classification-based morphology
      const t = (currentTime - pStart) / parameters.pWave.duration;
      amplitude = generatePWave(t, parameters.pWave.amplitude, parameters.classification);
      waveType = ECG_WAVE_TYPES.P;
    } else if (currentTime >= qrsStart && currentTime <= qrsEnd) {
      // QRS complex with classification-based morphology
      const t = (currentTime - qrsStart) / parameters.qrsComplex.duration;
      amplitude = generateQRSComplex(t, parameters.qrsComplex.amplitude, parameters.classification);
      waveType = ECG_WAVE_TYPES.QRS;
    } else if (currentTime >= tStart && currentTime <= tEnd) {
      // T wave with classification-based morphology
      const t = (currentTime - tStart) / parameters.tWave.duration;
      amplitude = generateTWave(t, parameters.tWave.amplitude, parameters.classification);
      waveType = ECG_WAVE_TYPES.T;
    }
    
    ecgData.push({
      x: currentTime,
      y: amplitude,
      waveType: waveType,
      timestamp: Date.now() + currentTime
    });
    
    currentTime += sampleInterval;
  }
  
  return ecgData;
}

/**
 * Validates heart rate input and provides error information
 * @param {number} heartRate - Heart rate to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validateHeartRate(heartRate) {
  if (heartRate === null || heartRate === undefined) {
    return {
      isValid: false,
      error: 'no_data',
      message: 'No heart rate data available'
    };
  }
  
  if (typeof heartRate !== 'number') {
    return {
      isValid: false,
      error: 'invalid_type',
      message: 'Heart rate must be a number'
    };
  }
  
  if (isNaN(heartRate)) {
    return {
      isValid: false,
      error: 'invalid_value',
      message: 'Heart rate cannot be NaN'
    };
  }
  
  if (heartRate < 20) {
    return {
      isValid: false,
      error: 'too_low',
      message: 'Heart rate too low: minimum 20 BPM'
    };
  }
  
  if (heartRate > 300) {
    return {
      isValid: false,
      error: 'too_high',
      message: 'Heart rate too high: maximum 300 BPM'
    };
  }
  
  return {
    isValid: true,
    error: null,
    message: null
  };
}

/**
 * Error handling utilities for ECG waveform generation
 */
export const ECG_ERROR_TYPES = {
  NO_DATA: 'no_data',
  INVALID_TYPE: 'invalid_type',
  INVALID_VALUE: 'invalid_value',
  TOO_LOW: 'too_low',
  TOO_HIGH: 'too_high',
  CANVAS_ERROR: 'canvas_error',
  ANIMATION_ERROR: 'animation_error',
  PERFORMANCE_ERROR: 'performance_error',
  WAVEFORM_ERROR: 'waveform_error'
};

/**
 * Creates a safe fallback ECG waveform for error states
 * @param {number} duration - Duration in seconds
 * @param {number} samplingRate - Samples per second
 * @returns {Array} Flat line ECG data for fallback display
 */
export function createFallbackECGWaveform(duration = 4, samplingRate = 500) {
  const totalSamples = duration * samplingRate;
  const sampleInterval = 1000 / samplingRate;
  const fallbackData = [];
  
  for (let i = 0; i < totalSamples; i++) {
    fallbackData.push({
      x: i * sampleInterval,
      y: ECG_AMPLITUDES.BASELINE,
      waveType: ECG_WAVE_TYPES.BASELINE,
      timestamp: Date.now() + (i * sampleInterval),
      isFallback: true
    });
  }
  
  return fallbackData;
}

/**
 * Safely generates ECG waveform with error handling
 * @param {number} heartRate - Heart rate in BPM
 * @param {number} duration - Duration in seconds
 * @param {number} samplingRate - Samples per second
 * @returns {Object} Result with waveform data and error information
 */
export function safeGenerateECGWaveform(heartRate, duration = 4, samplingRate = 500) {
  try {
    // Validate heart rate first
    const validation = validateHeartRate(heartRate);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        message: validation.message,
        waveformData: createFallbackECGWaveform(duration, samplingRate)
      };
    }
    
    // Generate normal waveform
    const waveformData = generateMedicalECGWaveform(heartRate, duration, samplingRate);
    
    return {
      success: true,
      error: null,
      message: null,
      waveformData: waveformData
    };
  } catch (error) {
    console.error('ECG waveform generation failed:', error);
    
    return {
      success: false,
      error: ECG_ERROR_TYPES.WAVEFORM_ERROR,
      message: `Waveform generation failed: ${error.message}`,
      waveformData: createFallbackECGWaveform(duration, samplingRate)
    };
  }
}

/**
 * Validates Canvas context and provides fallback options
 * @param {CanvasRenderingContext2D} ctx - Canvas context to validate
 * @returns {Object} Validation result with fallback suggestions
 */
export function validateCanvasContext(ctx) {
  if (!ctx) {
    return {
      isValid: false,
      error: ECG_ERROR_TYPES.CANVAS_ERROR,
      message: 'Canvas context is null or undefined',
      fallbackSuggestion: 'svg'
    };
  }
  
  // Test basic canvas operations
  try {
    ctx.save();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1, 1);
    ctx.stroke();
  } catch (canvasError) {
    return {
      isValid: false,
      error: ECG_ERROR_TYPES.CANVAS_ERROR,
      message: `Canvas operations failed: ${canvasError.message}`,
      fallbackSuggestion: 'static_image'
    };
  }
  
  return {
    isValid: true,
    error: null,
    message: null,
    fallbackSuggestion: null
  };
}

/**
 * Enhanced performance monitoring utilities with adaptive controls
 */
export class ECGPerformanceMonitor {
  constructor(options = {}) {
    this.frameTimes = [];
    this.memoryUsageHistory = [];
    this.maxSamples = options.maxSamples || 60;
    this.maxMemoryHistory = options.maxMemoryHistory || 10;
    this.performanceThreshold = options.performanceThreshold || 20; // FPS threshold
    this.targetFPS = options.targetFPS || 60;
    this.adaptiveMode = false;
    this.frameSkipCounter = 0;
    this.lastPerformanceCheck = 0;
    this.performanceCheckInterval = options.checkInterval || 1000; // Check every second
    this.performanceHistory = [];
    this.maxPerformanceHistory = 20;
  }
  
  recordFrame() {
    const now = performance.now();
    this.frameTimes.push(now);
    
    // Keep only recent samples
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
    
    // Record memory usage if available
    if (performance.memory && now - this.lastPerformanceCheck > this.performanceCheckInterval) {
      this.recordMemoryUsage();
      this.lastPerformanceCheck = now;
    }
  }
  
  recordMemoryUsage() {
    if (!performance.memory) return;
    
    const memoryInfo = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      timestamp: performance.now(),
      usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
      totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100
    };
    
    this.memoryUsageHistory.push(memoryInfo);
    
    if (this.memoryUsageHistory.length > this.maxMemoryHistory) {
      this.memoryUsageHistory.shift();
    }
  }
  
  getCurrentFPS() {
    if (this.frameTimes.length < 2) {
      return 0;
    }
    
    const timeSpan = this.frameTimes[this.frameTimes.length - 1] - this.frameTimes[0];
    const fps = (this.frameTimes.length - 1) / (timeSpan / 1000);
    
    // Record FPS in performance history
    this.performanceHistory.push({
      fps: fps,
      timestamp: performance.now(),
      adaptiveMode: this.adaptiveMode
    });
    
    if (this.performanceHistory.length > this.maxPerformanceHistory) {
      this.performanceHistory.shift();
    }
    
    return fps;
  }
  
  getAverageFPS(samples = 10) {
    if (this.performanceHistory.length === 0) return 0;
    
    const recentSamples = this.performanceHistory.slice(-samples);
    const totalFPS = recentSamples.reduce((sum, sample) => sum + sample.fps, 0);
    return totalFPS / recentSamples.length;
  }
  
  hasPerformanceIssue() {
    const currentFPS = this.getCurrentFPS();
    const averageFPS = this.getAverageFPS(5);
    
    // Consider performance issue if current FPS is low OR average FPS is consistently low
    return currentFPS < this.performanceThreshold || averageFPS < this.performanceThreshold * 1.2;
  }
  
  hasMemoryIssue() {
    if (this.memoryUsageHistory.length < 2) return false;
    
    const recent = this.memoryUsageHistory.slice(-3);
    const memoryGrowth = recent[recent.length - 1].used - recent[0].used;
    const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
    
    // Check for rapid memory growth (more than 10MB per second)
    const growthRate = memoryGrowth / (timeSpan / 1000);
    return growthRate > 10 * 1024 * 1024;
  }
  
  shouldEnableAdaptiveMode() {
    return this.hasPerformanceIssue() || this.hasMemoryIssue();
  }
  
  shouldSkipFrame() {
    if (!this.adaptiveMode) return false;
    
    this.frameSkipCounter++;
    
    // Skip every other frame in adaptive mode
    return this.frameSkipCounter % 2 === 0;
  }
  
  getPerformanceReport() {
    const currentFPS = this.getCurrentFPS();
    const averageFPS = this.getAverageFPS();
    const latestMemory = this.memoryUsageHistory[this.memoryUsageHistory.length - 1];
    
    return {
      currentFPS: Math.round(currentFPS * 100) / 100,
      averageFPS: Math.round(averageFPS * 100) / 100,
      hasIssue: this.hasPerformanceIssue(),
      hasMemoryIssue: this.hasMemoryIssue(),
      adaptiveMode: this.adaptiveMode,
      sampleCount: this.frameTimes.length,
      threshold: this.performanceThreshold,
      targetFPS: this.targetFPS,
      memoryUsage: latestMemory ? {
        usedMB: latestMemory.usedMB,
        totalMB: latestMemory.totalMB,
        usagePercent: Math.round((latestMemory.used / latestMemory.total) * 100)
      } : null,
      performanceHistory: this.performanceHistory.slice(-5) // Last 5 samples
    };
  }
  
  updateAdaptiveMode() {
    const shouldEnable = this.shouldEnableAdaptiveMode();
    
    if (shouldEnable !== this.adaptiveMode) {
      this.adaptiveMode = shouldEnable;
      this.frameSkipCounter = 0; // Reset counter when mode changes
      
      return {
        changed: true,
        enabled: this.adaptiveMode,
        reason: shouldEnable ? 
          (this.hasPerformanceIssue() ? 'low_fps' : 'memory_issue') : 
          'performance_improved'
      };
    }
    
    return { changed: false, enabled: this.adaptiveMode };
  }
  
  reset() {
    this.frameTimes = [];
    this.memoryUsageHistory = [];
    this.performanceHistory = [];
    this.adaptiveMode = false;
    this.frameSkipCounter = 0;
    this.lastPerformanceCheck = 0;
  }
  
  // Benchmark utilities
  startBenchmark(name) {
    return {
      name: name,
      startTime: performance.now(),
      startMemory: performance.memory ? performance.memory.usedJSHeapSize : null
    };
  }
  
  endBenchmark(benchmark) {
    const endTime = performance.now();
    const endMemory = performance.memory ? performance.memory.usedJSHeapSize : null;
    
    return {
      name: benchmark.name,
      duration: endTime - benchmark.startTime,
      memoryDelta: endMemory && benchmark.startMemory ? 
        endMemory - benchmark.startMemory : null,
      startTime: benchmark.startTime,
      endTime: endTime
    };
  }
}

/**
 * Canvas optimization utilities
 */
export const CanvasOptimizer = {
  /**
   * Optimizes canvas for high DPI displays
   */
  optimizeForHighDPI(canvas, ctx, width, height) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Set actual size in memory (scaled up for high DPI)
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    
    // Scale the canvas back down using CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // Scale the drawing context so everything draws at the correct size
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    return devicePixelRatio;
  },
  
  /**
   * Sets up canvas for optimal performance
   */
  setupPerformanceOptimizations(ctx, performanceMode = false) {
    // Disable image smoothing for better performance if needed
    if (performanceMode) {
      ctx.imageSmoothingEnabled = false;
    }
    
    // Set line cap and join for better performance
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Use hardware acceleration hints
    ctx.globalCompositeOperation = 'source-over';
    
    return ctx;
  },
  
  /**
   * Clears canvas efficiently
   */
  clearCanvas(ctx, width, height, performanceMode = false) {
    if (performanceMode) {
      // Fast clear for performance mode
      ctx.clearRect(0, 0, width, height);
    } else {
      // More thorough clear for quality mode
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.restore();
    }
  },
  
  /**
   * Optimizes path drawing for performance
   */
  optimizePathDrawing(ctx, points, performanceMode = false) {
    if (points.length === 0) return;
    
    ctx.beginPath();
    
    if (performanceMode) {
      // Skip points for better performance
      const step = Math.max(1, Math.floor(points.length / 200)); // Max 200 points
      
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = step; i < points.length; i += step) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      // Always include the last point
      if (points.length > 1) {
        const lastPoint = points[points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }
    } else {
      // Draw all points for quality mode
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    
    ctx.stroke();
  }
};

/**
 * Memory management utilities for ECG waveform data
 */
export class ECGMemoryManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxCacheSize = options.maxCacheSize || 5;
    this.maxDataAge = options.maxDataAge || 30000; // 30 seconds
    this.cleanupInterval = options.cleanupInterval || 10000; // 10 seconds
    this.lastCleanup = Date.now();
  }
  
  /**
   * Gets cached waveform data or creates new data
   */
  getWaveformData(key, generator) {
    // Clean up old data periodically
    this.periodicCleanup();
    
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      cached.lastAccessed = Date.now();
      cached.accessCount++;
      return cached.data;
    }
    
    // Generate new data
    const data = generator();
    this.cacheWaveformData(key, data);
    return data;
  }
  
  /**
   * Caches waveform data with LRU eviction
   */
  cacheWaveformData(key, data) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLeastRecentlyUsed();
    }
    
    this.cache.set(key, {
      data: data,
      created: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      size: this.estimateDataSize(data)
    });
  }
  
  /**
   * Evicts least recently used cache entry
   */
  evictLeastRecentlyUsed() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (value.lastAccessed < oldestTime) {
        oldestTime = value.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  
  /**
   * Estimates memory size of waveform data
   */
  estimateDataSize(data) {
    if (!Array.isArray(data)) return 0;
    
    // Rough estimate: each point has x, y, waveType, timestamp, etc.
    // Assume ~100 bytes per point (conservative estimate)
    return data.length * 100;
  }
  
  /**
   * Periodic cleanup of old cache entries
   */
  periodicCleanup() {
    const now = Date.now();
    
    if (now - this.lastCleanup < this.cleanupInterval) {
      return;
    }
    
    this.lastCleanup = now;
    
    // Remove entries older than maxDataAge
    for (const [key, value] of this.cache.entries()) {
      if (now - value.created > this.maxDataAge) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Gets cache statistics
   */
  getCacheStats() {
    let totalSize = 0;
    let totalAccessCount = 0;
    const entries = [];
    
    for (const [key, value] of this.cache.entries()) {
      totalSize += value.size;
      totalAccessCount += value.accessCount;
      entries.push({
        key: key,
        size: value.size,
        accessCount: value.accessCount,
        age: Date.now() - value.created,
        lastAccessed: Date.now() - value.lastAccessed
      });
    }
    
    return {
      entryCount: this.cache.size,
      maxSize: this.maxCacheSize,
      totalSize: totalSize,
      averageAccessCount: entries.length > 0 ? totalAccessCount / entries.length : 0,
      entries: entries.sort((a, b) => b.accessCount - a.accessCount) // Sort by access count
    };
  }
  
  /**
   * Clears all cached data
   */
  clear() {
    this.cache.clear();
    this.lastCleanup = Date.now();
  }
  
  /**
   * Forces cleanup of old entries
   */
  forceCleanup() {
    this.lastCleanup = 0; // Force cleanup on next access
    this.periodicCleanup();
  }
}

/**
 * Calculates medically accurate ECG intervals based on heart rate
 * @param {number} heartRate - Heart rate in BPM
 * @returns {Object} Medical intervals in milliseconds
 */
export function calculateMedicalIntervals(heartRate) {
  const validation = validateHeartRate(heartRate);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  const rrInterval = (60 / heartRate) * 1000; // RR interval in milliseconds
  const classification = classifyHeartRate(heartRate);
  
  // Medical standard intervals with heart rate adjustments
  let prInterval, qtInterval, qtcInterval;
  
  switch (classification) {
    case HEART_RATE_CLASSIFICATIONS.BRADYCARDIA:
      // Bradycardia: longer intervals
      prInterval = Math.min(220, 160 + (60 - heartRate) * 1.0); // Longer PR for bradycardia
      qtInterval = Math.min(500, 400 + (60 - heartRate) * 3); // Longer QT
      break;
    case HEART_RATE_CLASSIFICATIONS.TACHYCARDIA:
      // Tachycardia: shorter intervals
      prInterval = Math.max(120, 160 - (heartRate - 100) * 0.4); // Shorter PR for tachycardia
      qtInterval = Math.max(300, 400 - (heartRate - 100) * 1.0); // Shorter QT
      break;
    default:
      // Normal heart rate
      prInterval = 160; // Standard PR interval
      qtInterval = 400; // Standard QT interval
      break;
  }
  
  // Calculate corrected QT interval (Bazett's formula)
  qtcInterval = qtInterval / Math.sqrt(rrInterval / 1000);
  
  return {
    rrInterval,
    prInterval,
    qtInterval,
    qtcInterval,
    classification,
    // Additional medical intervals
    pWaveInterval: ECG_TIMING.P_WAVE_DURATION,
    qrsInterval: ECG_TIMING.QRS_DURATION,
    stSegment: ECG_TIMING.ST_SEGMENT,
    tWaveInterval: ECG_TIMING.T_WAVE_DURATION
  };
}

/**
 * Generates ECG waveform with precise medical timing relationships
 * @param {number} heartRate - Heart rate in BPM
 * @param {number} duration - Duration in seconds to generate
 * @param {number} samplingRate - Samples per second
 * @returns {Array} Array of ECG data points with medical accuracy
 */
export function generateMedicalECGWaveform(heartRate, duration = 4, samplingRate = 500) {
  const intervals = calculateMedicalIntervals(heartRate);
  const totalSamples = duration * samplingRate;
  const sampleInterval = 1000 / samplingRate; // ms per sample
  
  const waveformData = [];
  let currentTime = 0;
  
  for (let i = 0; i < totalSamples; i++) {
    // Determine position within current cardiac cycle
    const cyclePosition = currentTime % intervals.rrInterval;
    let amplitude = ECG_AMPLITUDES.BASELINE;
    let waveType = ECG_WAVE_TYPES.BASELINE;
    
    // P wave timing (0 to P wave duration)
    if (cyclePosition <= intervals.pWaveInterval) {
      const t = cyclePosition / intervals.pWaveInterval;
      amplitude = generatePWave(t, ECG_AMPLITUDES.P_WAVE, intervals.classification);
      waveType = ECG_WAVE_TYPES.P;
    }
    // PR interval (P wave end to QRS start)
    else if (cyclePosition <= intervals.pWaveInterval + intervals.prInterval) {
      amplitude = ECG_AMPLITUDES.BASELINE;
      waveType = ECG_WAVE_TYPES.BASELINE;
    }
    // QRS complex
    else if (cyclePosition <= intervals.pWaveInterval + intervals.prInterval + intervals.qrsInterval) {
      const qrsStart = intervals.pWaveInterval + intervals.prInterval;
      const t = (cyclePosition - qrsStart) / intervals.qrsInterval;
      amplitude = generateQRSComplex(t, ECG_AMPLITUDES.QRS_COMPLEX, intervals.classification);
      waveType = ECG_WAVE_TYPES.QRS;
    }
    // ST segment
    else if (cyclePosition <= intervals.pWaveInterval + intervals.prInterval + intervals.qrsInterval + intervals.stSegment) {
      amplitude = ECG_AMPLITUDES.BASELINE;
      waveType = ECG_WAVE_TYPES.BASELINE;
    }
    // T wave
    else if (cyclePosition <= intervals.pWaveInterval + intervals.prInterval + intervals.qrsInterval + intervals.stSegment + intervals.tWaveInterval) {
      const tStart = intervals.pWaveInterval + intervals.prInterval + intervals.qrsInterval + intervals.stSegment;
      const t = (cyclePosition - tStart) / intervals.tWaveInterval;
      amplitude = generateTWave(t, ECG_AMPLITUDES.T_WAVE, intervals.classification);
      waveType = ECG_WAVE_TYPES.T;
    }
    
    waveformData.push({
      x: currentTime,
      y: amplitude,
      waveType: waveType,
      timestamp: Date.now() + currentTime,
      cyclePosition: cyclePosition,
      heartRate: heartRate,
      classification: intervals.classification
    });
    
    currentTime += sampleInterval;
  }
  
  return waveformData;
}

/**
 * Validates ECG waveform for medical accuracy
 * @param {Array} waveformData - ECG waveform data points
 * @param {number} heartRate - Expected heart rate
 * @returns {Object} Validation results with medical accuracy metrics
 */
export function validateECGMedicalAccuracy(waveformData, heartRate) {
  if (!Array.isArray(waveformData) || waveformData.length === 0) {
    return {
      isValid: false,
      errors: ['Waveform data is empty or invalid'],
      metrics: null
    };
  }
  
  const intervals = calculateMedicalIntervals(heartRate);
  const errors = [];
  const warnings = [];
  
  // Find wave components
  const pWaves = waveformData.filter(point => point.waveType === ECG_WAVE_TYPES.P);
  const qrsComplexes = waveformData.filter(point => point.waveType === ECG_WAVE_TYPES.QRS);
  const tWaves = waveformData.filter(point => point.waveType === ECG_WAVE_TYPES.T);
  
  // Validate wave presence
  if (pWaves.length === 0) errors.push('Missing P waves');
  if (qrsComplexes.length === 0) errors.push('Missing QRS complexes');
  if (tWaves.length === 0) errors.push('Missing T waves');
  
  // Validate wave sequence (P-QRS-T)
  if (pWaves.length > 0 && qrsComplexes.length > 0 && tWaves.length > 0) {
    const firstP = pWaves[0].x;
    const firstQRS = qrsComplexes[0].x;
    const firstT = tWaves[0].x;
    
    if (!(firstP < firstQRS && firstQRS < firstT)) {
      errors.push('Incorrect wave sequence - should be P-QRS-T');
    }
  }
  
  // Validate amplitude relationships
  if (qrsComplexes.length > 0 && pWaves.length > 0 && tWaves.length > 0) {
    const maxQRSAmplitude = Math.max(...qrsComplexes.map(p => Math.abs(p.y)));
    const maxPAmplitude = Math.max(...pWaves.map(p => p.y));
    const maxTAmplitude = Math.max(...tWaves.map(p => p.y));
    
    if (maxQRSAmplitude <= maxPAmplitude) {
      warnings.push('QRS amplitude should be higher than P wave amplitude');
    }
    if (maxQRSAmplitude <= maxTAmplitude) {
      warnings.push('QRS amplitude should be higher than T wave amplitude');
    }
  }
  
  // Calculate metrics
  const metrics = {
    totalDuration: waveformData[waveformData.length - 1]?.x - waveformData[0]?.x,
    pWaveCount: pWaves.length,
    qrsCount: qrsComplexes.length,
    tWaveCount: tWaves.length,
    estimatedHeartRate: waveformData.length > 0 && qrsComplexes.length > 0 ? 
      (qrsComplexes.length / ((waveformData[waveformData.length - 1].x - waveformData[0].x) / 1000)) * 60 : 0,
    classification: intervals.classification,
    medicalIntervals: intervals
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metrics
  };
}

/**
 * Generates different ECG patterns based on heart rate classification
 * @param {string} classification - Heart rate classification
 * @param {number} heartRate - Heart rate in BPM
 * @param {number} duration - Duration in seconds
 * @returns {Array} ECG waveform data with pattern-specific characteristics
 */
export function generateECGPattern(classification, heartRate, duration = 4) {
  let adjustedHeartRate = heartRate;
  let patternModifications = {};
  
  switch (classification) {
    case HEART_RATE_CLASSIFICATIONS.BRADYCARDIA:
      // Ensure heart rate is in bradycardia range
      adjustedHeartRate = Math.min(heartRate, 59);
      patternModifications = {
        pWaveAmplitude: ECG_AMPLITUDES.P_WAVE * 1.2,
        qrsAmplitude: ECG_AMPLITUDES.QRS_COMPLEX * 1.1,
        tWaveAmplitude: ECG_AMPLITUDES.T_WAVE * 1.15,
        morphologyVariation: 'broader_waves'
      };
      break;
      
    case HEART_RATE_CLASSIFICATIONS.TACHYCARDIA:
      // Ensure heart rate is in tachycardia range
      adjustedHeartRate = Math.max(heartRate, 101);
      patternModifications = {
        pWaveAmplitude: ECG_AMPLITUDES.P_WAVE * 0.8,
        qrsAmplitude: ECG_AMPLITUDES.QRS_COMPLEX * 0.9,
        tWaveAmplitude: ECG_AMPLITUDES.T_WAVE * 0.85,
        morphologyVariation: 'narrower_waves'
      };
      break;
      
    default:
      // Normal sinus rhythm
      adjustedHeartRate = Math.max(60, Math.min(100, heartRate));
      patternModifications = {
        pWaveAmplitude: ECG_AMPLITUDES.P_WAVE,
        qrsAmplitude: ECG_AMPLITUDES.QRS_COMPLEX,
        tWaveAmplitude: ECG_AMPLITUDES.T_WAVE,
        morphologyVariation: 'normal'
      };
      break;
  }
  
  // Generate waveform with pattern-specific modifications
  const waveformData = generateMedicalECGWaveform(adjustedHeartRate, duration);
  
  // Apply pattern modifications
  return waveformData.map(point => ({
    ...point,
    y: point.y * (patternModifications[`${point.waveType.toLowerCase()}WaveAmplitude`] || 1),
    patternType: classification,
    patternModifications
  }));
}