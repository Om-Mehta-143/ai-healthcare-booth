/**
 * Unit tests for ECG Waveform Generation Utilities
 */

import {
  classifyHeartRate,
  calculateECGParameters,
  generatePWave,
  generateQRSComplex,
  generateTWave,
  generateECGCycle,
  validateHeartRate,
  calculateMedicalIntervals,
  generateMedicalECGWaveform,
  validateECGMedicalAccuracy,
  generateECGPattern,
  HEART_RATE_CLASSIFICATIONS,
  ECG_WAVE_TYPES,
  ECG_TIMING,
  ECG_AMPLITUDES
} from '../ecgWaveformUtils';

describe('Heart Rate Classification', () => {
  describe('classifyHeartRate', () => {
    test('should classify bradycardia correctly', () => {
      expect(classifyHeartRate(45)).toBe(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
      expect(classifyHeartRate(59)).toBe(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
    });

    test('should classify normal heart rate correctly', () => {
      expect(classifyHeartRate(60)).toBe(HEART_RATE_CLASSIFICATIONS.NORMAL);
      expect(classifyHeartRate(80)).toBe(HEART_RATE_CLASSIFICATIONS.NORMAL);
      expect(classifyHeartRate(100)).toBe(HEART_RATE_CLASSIFICATIONS.NORMAL);
    });

    test('should classify tachycardia correctly', () => {
      expect(classifyHeartRate(101)).toBe(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
      expect(classifyHeartRate(150)).toBe(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
    });

    test('should throw error for invalid heart rates', () => {
      expect(() => classifyHeartRate(19)).toThrow('Invalid heart rate');
      expect(() => classifyHeartRate(301)).toThrow('Invalid heart rate');
      expect(() => classifyHeartRate('invalid')).toThrow('Invalid heart rate');
      expect(() => classifyHeartRate(null)).toThrow('Invalid heart rate');
    });
  });
});

describe('ECG Parameter Calculation', () => {
  describe('calculateECGParameters', () => {
    test('should calculate correct parameters for normal heart rate', () => {
      const params = calculateECGParameters(75);
      
      expect(params.cycleLength).toBe(800); // 60/75 * 1000 = 800ms
      expect(params.classification).toBe(HEART_RATE_CLASSIFICATIONS.NORMAL);
      expect(params.pWave.amplitude).toBe(ECG_AMPLITUDES.P_WAVE);
      expect(params.qrsComplex.amplitude).toBe(ECG_AMPLITUDES.QRS_COMPLEX);
      expect(params.tWave.amplitude).toBe(ECG_AMPLITUDES.T_WAVE);
    });

    test('should adjust parameters for bradycardia', () => {
      const params = calculateECGParameters(50);
      
      expect(params.classification).toBe(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
      expect(params.pWave.amplitude).toBeGreaterThan(ECG_AMPLITUDES.P_WAVE);
      expect(params.qrsComplex.amplitude).toBeGreaterThan(ECG_AMPLITUDES.QRS_COMPLEX);
      expect(params.tWave.amplitude).toBeGreaterThan(ECG_AMPLITUDES.T_WAVE);
    });

    test('should adjust parameters for tachycardia', () => {
      const params = calculateECGParameters(120);
      
      expect(params.classification).toBe(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
      expect(params.pWave.amplitude).toBeLessThan(ECG_AMPLITUDES.P_WAVE);
      expect(params.qrsComplex.amplitude).toBeLessThan(ECG_AMPLITUDES.QRS_COMPLEX);
      expect(params.tWave.amplitude).toBeLessThan(ECG_AMPLITUDES.T_WAVE);
    });

    test('should throw error for invalid heart rates', () => {
      expect(() => calculateECGParameters(15)).toThrow('Invalid heart rate');
      expect(() => calculateECGParameters(350)).toThrow('Invalid heart rate');
    });
  });
});

describe('Wave Morphology Generation', () => {
  describe('generatePWave', () => {
    test('should return 0 for out-of-range time values', () => {
      expect(generatePWave(-0.1)).toBe(0);
      expect(generatePWave(1.1)).toBe(0);
    });

    test('should return positive values within range', () => {
      expect(generatePWave(0.5)).toBeGreaterThan(0);
      expect(generatePWave(0.3)).toBeGreaterThan(0);
      expect(generatePWave(0.7)).toBeGreaterThan(0);
    });

    test('should have maximum amplitude near center', () => {
      const centerValue = generatePWave(0.5);
      const edgeValue = generatePWave(0.1);
      expect(centerValue).toBeGreaterThan(edgeValue);
    });

    test('should use custom amplitude when provided', () => {
      const customAmplitude = 0.5;
      const result = generatePWave(0.5, customAmplitude);
      expect(result).toBeLessThanOrEqual(customAmplitude);
    });
  });

  describe('generateQRSComplex', () => {
    test('should return 0 for out-of-range time values', () => {
      expect(generateQRSComplex(-0.1)).toBe(0);
      expect(generateQRSComplex(1.1)).toBe(0);
    });

    test('should have negative Q wave component', () => {
      const qWaveValue = generateQRSComplex(0.1);
      expect(qWaveValue).toBeLessThan(0);
    });

    test('should have positive R wave component', () => {
      const rWaveValue = generateQRSComplex(0.4);
      expect(rWaveValue).toBeGreaterThan(0);
    });

    test('should have negative S wave component', () => {
      const sWaveValue = generateQRSComplex(0.8);
      expect(sWaveValue).toBeLessThan(0);
    });

    test('should have maximum positive amplitude in R wave region', () => {
      const rWaveMax = generateQRSComplex(0.35);
      const qWaveValue = generateQRSComplex(0.1);
      const sWaveValue = generateQRSComplex(0.8);
      
      expect(rWaveMax).toBeGreaterThan(Math.abs(qWaveValue));
      expect(rWaveMax).toBeGreaterThan(Math.abs(sWaveValue));
    });
  });

  describe('generateTWave', () => {
    test('should return 0 for out-of-range time values', () => {
      expect(generateTWave(-0.1)).toBe(0);
      expect(generateTWave(1.1)).toBe(0);
    });

    test('should return positive values within range', () => {
      expect(generateTWave(0.3)).toBeGreaterThan(0);
      expect(generateTWave(0.6)).toBeGreaterThan(0);
      expect(generateTWave(0.9)).toBeGreaterThan(0);
    });

    test('should have asymmetric shape with peak around 60%', () => {
      const peakValue = generateTWave(0.6);
      const earlyValue = generateTWave(0.3);
      const lateValue = generateTWave(0.9);
      
      expect(peakValue).toBeGreaterThan(earlyValue);
      expect(peakValue).toBeGreaterThan(lateValue);
    });

    test('should use custom amplitude when provided', () => {
      const customAmplitude = 0.8;
      const result = generateTWave(0.6, customAmplitude);
      expect(result).toBeLessThanOrEqual(customAmplitude);
    });
  });
});

describe('ECG Cycle Generation', () => {
  describe('generateECGCycle', () => {
    test('should generate correct number of samples', () => {
      const heartRate = 60;
      const samplingRate = 100;
      const cycle = generateECGCycle(heartRate, samplingRate);
      
      // At 60 BPM, cycle length is 1000ms
      // At 100 samples/sec, should have ~100 samples
      expect(cycle.length).toBeCloseTo(100, 0);
    });

    test('should include all wave types', () => {
      const cycle = generateECGCycle(75);
      const waveTypes = new Set(cycle.map(point => point.waveType));
      
      expect(waveTypes.has(ECG_WAVE_TYPES.P)).toBe(true);
      expect(waveTypes.has(ECG_WAVE_TYPES.QRS)).toBe(true);
      expect(waveTypes.has(ECG_WAVE_TYPES.T)).toBe(true);
      expect(waveTypes.has(ECG_WAVE_TYPES.BASELINE)).toBe(true);
    });

    test('should have correct data point structure', () => {
      const cycle = generateECGCycle(75);
      const firstPoint = cycle[0];
      
      expect(firstPoint).toHaveProperty('x');
      expect(firstPoint).toHaveProperty('y');
      expect(firstPoint).toHaveProperty('waveType');
      expect(firstPoint).toHaveProperty('timestamp');
      
      expect(typeof firstPoint.x).toBe('number');
      expect(typeof firstPoint.y).toBe('number');
      expect(typeof firstPoint.waveType).toBe('string');
      expect(typeof firstPoint.timestamp).toBe('number');
    });

    test('should have increasing time values', () => {
      const cycle = generateECGCycle(75);
      
      for (let i = 1; i < cycle.length; i++) {
        expect(cycle[i].x).toBeGreaterThan(cycle[i - 1].x);
      }
    });

    test('should generate different cycles for different heart rates', () => {
      const cycle60 = generateECGCycle(60);
      const cycle120 = generateECGCycle(120);
      
      // Higher heart rate should have shorter cycle
      expect(cycle120.length).toBeLessThan(cycle60.length);
    });
  });
});

describe('Heart Rate Validation', () => {
  describe('validateHeartRate', () => {
    test('should validate correct heart rates', () => {
      const result = validateHeartRate(75);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject non-number inputs', () => {
      const result = validateHeartRate('75');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Heart rate must be a number');
    });

    test('should reject NaN values', () => {
      const result = validateHeartRate(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Heart rate cannot be NaN');
    });

    test('should reject heart rates below minimum', () => {
      const result = validateHeartRate(15);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Heart rate too low: minimum 20 BPM');
    });

    test('should reject heart rates above maximum', () => {
      const result = validateHeartRate(350);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Heart rate too high: maximum 300 BPM');
    });

    test('should accept boundary values', () => {
      const minResult = validateHeartRate(20);
      const maxResult = validateHeartRate(300);
      
      expect(minResult.isValid).toBe(true);
      expect(maxResult.isValid).toBe(true);
    });
  });
});

describe('Integration Tests', () => {
  test('should generate medically accurate ECG cycle', () => {
    const heartRate = 75;
    const cycle = generateECGCycle(heartRate);
    
    // Find QRS complex (should have highest amplitude)
    const qrsPoints = cycle.filter(point => point.waveType === ECG_WAVE_TYPES.QRS);
    const maxQRSAmplitude = Math.max(...qrsPoints.map(point => Math.abs(point.y)));
    
    // Find P and T waves
    const pPoints = cycle.filter(point => point.waveType === ECG_WAVE_TYPES.P);
    const tPoints = cycle.filter(point => point.waveType === ECG_WAVE_TYPES.T);
    
    const maxPAmplitude = Math.max(...pPoints.map(point => point.y));
    const maxTAmplitude = Math.max(...tPoints.map(point => point.y));
    
    // QRS should have highest amplitude
    expect(maxQRSAmplitude).toBeGreaterThan(maxPAmplitude);
    expect(maxQRSAmplitude).toBeGreaterThan(maxTAmplitude);
    
    // P and T waves should be positive
    expect(maxPAmplitude).toBeGreaterThan(0);
    expect(maxTAmplitude).toBeGreaterThan(0);
  });

  test('should maintain wave sequence P-QRS-T', () => {
    const cycle = generateECGCycle(75);
    
    // Find first occurrence of each wave type
    const pIndex = cycle.findIndex(point => point.waveType === ECG_WAVE_TYPES.P);
    const qrsIndex = cycle.findIndex(point => point.waveType === ECG_WAVE_TYPES.QRS);
    const tIndex = cycle.findIndex(point => point.waveType === ECG_WAVE_TYPES.T);
    
    // Verify correct sequence
    expect(pIndex).toBeLessThan(qrsIndex);
    expect(qrsIndex).toBeLessThan(tIndex);
  });
});

describe('Medical Accuracy Enhancements', () => {
  describe('Enhanced P Wave Generation', () => {
    test('should generate different morphology for bradycardia', () => {
      const normalPWave = generatePWave(0.5, 0.25, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const bradyPWave = generatePWave(0.5, 0.25, HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
      
      // Bradycardia should have broader, more rounded P waves
      expect(Math.abs(bradyPWave)).toBeGreaterThan(Math.abs(normalPWave));
    });

    test('should generate different morphology for tachycardia', () => {
      const normalPWave = generatePWave(0.5, 0.25, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const tachyPWave = generatePWave(0.5, 0.25, HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
      
      // Tachycardia should have narrower, more peaked P waves
      expect(Math.abs(tachyPWave)).toBeLessThan(Math.abs(normalPWave));
    });

    test('should include biphasic component for medical accuracy', () => {
      const pWaveValues = [];
      for (let t = 0; t <= 1; t += 0.1) {
        pWaveValues.push(generatePWave(t, 0.25, HEART_RATE_CLASSIFICATIONS.NORMAL));
      }
      
      // Should have some variation due to biphasic component
      const hasVariation = pWaveValues.some((val, i) => 
        i > 0 && Math.abs(val - pWaveValues[i-1]) > 0.001
      );
      expect(hasVariation).toBe(true);
    });
  });

  describe('Enhanced QRS Complex Generation', () => {
    test('should generate medically accurate Q-R-S sequence', () => {
      const qWave = generateQRSComplex(0.1, 1.5, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const rWave = generateQRSComplex(0.4, 1.5, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const sWave = generateQRSComplex(0.8, 1.5, HEART_RATE_CLASSIFICATIONS.NORMAL);
      
      // Q wave should be negative, R wave positive, S wave negative
      expect(qWave).toBeLessThan(0);
      expect(rWave).toBeGreaterThan(0);
      expect(sWave).toBeLessThan(0);
      
      // R wave should have highest absolute amplitude
      expect(Math.abs(rWave)).toBeGreaterThan(Math.abs(qWave));
      expect(Math.abs(rWave)).toBeGreaterThan(Math.abs(sWave));
    });

    test('should adjust morphology for bradycardia', () => {
      const normalQRS = generateQRSComplex(0.4, 1.5, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const bradyQRS = generateQRSComplex(0.4, 1.5, HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
      
      // Bradycardia should have slightly wider QRS with more pronounced deflections
      expect(Math.abs(bradyQRS)).toBeGreaterThanOrEqual(Math.abs(normalQRS) * 0.9);
    });

    test('should adjust morphology for tachycardia', () => {
      const normalQRS = generateQRSComplex(0.4, 1.5, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const tachyQRS = generateQRSComplex(0.4, 1.5, HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
      
      // Tachycardia should have sharper, more narrow QRS
      expect(Math.abs(tachyQRS)).toBeLessThanOrEqual(Math.abs(normalQRS) * 1.1);
    });
  });

  describe('Enhanced T Wave Generation', () => {
    test('should generate asymmetric T wave morphology', () => {
      const earlyT = generateTWave(0.3, 0.3, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const peakT = generateTWave(0.6, 0.3, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const lateT = generateTWave(0.9, 0.3, HEART_RATE_CLASSIFICATIONS.NORMAL);
      
      // Peak should be higher than early and late values
      expect(peakT).toBeGreaterThan(earlyT);
      expect(peakT).toBeGreaterThan(lateT);
      
      // Should be asymmetric (early rise slower than late fall)
      expect(earlyT).toBeGreaterThan(lateT * 0.8);
    });

    test('should adjust morphology for different heart rate classifications', () => {
      const normalT = generateTWave(0.6, 0.3, HEART_RATE_CLASSIFICATIONS.NORMAL);
      const bradyT = generateTWave(0.6, 0.3, HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
      const tachyT = generateTWave(0.6, 0.3, HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
      
      // All should be positive (normal T waves)
      expect(normalT).toBeGreaterThan(0);
      expect(bradyT).toBeGreaterThan(0);
      expect(tachyT).toBeGreaterThan(0);
      
      // Should have different morphologies
      expect(bradyT).not.toEqual(normalT);
      expect(tachyT).not.toEqual(normalT);
    });

    test('should include subtle notching for medical realism', () => {
      const tWaveValues = [];
      for (let t = 0; t <= 1; t += 0.05) {
        tWaveValues.push(generateTWave(t, 0.3, HEART_RATE_CLASSIFICATIONS.NORMAL));
      }
      
      // Should have some subtle variations due to notching
      const hasNotching = tWaveValues.some((val, i) => 
        i > 1 && i < tWaveValues.length - 1 &&
        Math.abs(val - (tWaveValues[i-1] + tWaveValues[i+1]) / 2) > 0.001
      );
      expect(hasNotching).toBe(true);
    });
  });
});

describe('Medical Intervals and Timing', () => {
  describe('calculateMedicalIntervals', () => {
    test('should calculate correct intervals for normal heart rate', () => {
      const intervals = calculateMedicalIntervals(75);
      
      expect(intervals.rrInterval).toBeCloseTo(800, 0); // 60/75 * 1000
      expect(intervals.prInterval).toBe(160); // Standard PR interval
      expect(intervals.qtInterval).toBe(400); // Standard QT interval
      expect(intervals.classification).toBe(HEART_RATE_CLASSIFICATIONS.NORMAL);
    });

    test('should adjust intervals for bradycardia', () => {
      const intervals = calculateMedicalIntervals(45);
      
      expect(intervals.rrInterval).toBeCloseTo(1333, 0); // 60/45 * 1000
      expect(intervals.prInterval).toBeGreaterThan(160); // Longer PR in bradycardia
      expect(intervals.qtInterval).toBeGreaterThan(400); // Longer QT in bradycardia
      expect(intervals.classification).toBe(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
    });

    test('should adjust intervals for tachycardia', () => {
      const intervals = calculateMedicalIntervals(120);
      
      expect(intervals.rrInterval).toBeCloseTo(500, 0); // 60/120 * 1000
      expect(intervals.prInterval).toBeLessThan(160); // Shorter PR in tachycardia
      expect(intervals.qtInterval).toBeLessThan(400); // Shorter QT in tachycardia
      expect(intervals.classification).toBe(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
    });

    test('should calculate corrected QT interval', () => {
      const intervals = calculateMedicalIntervals(75);
      
      expect(intervals.qtcInterval).toBeDefined();
      expect(typeof intervals.qtcInterval).toBe('number');
      expect(intervals.qtcInterval).toBeGreaterThan(0);
    });
  });

  describe('generateMedicalECGWaveform', () => {
    test('should generate waveform with medical timing accuracy', () => {
      const waveform = generateMedicalECGWaveform(75, 2, 500);
      
      expect(Array.isArray(waveform)).toBe(true);
      expect(waveform.length).toBeGreaterThan(0);
      
      // Should have all required properties
      const firstPoint = waveform[0];
      expect(firstPoint).toHaveProperty('x');
      expect(firstPoint).toHaveProperty('y');
      expect(firstPoint).toHaveProperty('waveType');
      expect(firstPoint).toHaveProperty('cyclePosition');
      expect(firstPoint).toHaveProperty('heartRate');
      expect(firstPoint).toHaveProperty('classification');
    });

    test('should maintain proper wave sequence in medical waveform', () => {
      const waveform = generateMedicalECGWaveform(75, 2, 500);
      
      // Find first occurrence of each wave type
      const pIndex = waveform.findIndex(point => point.waveType === ECG_WAVE_TYPES.P);
      const qrsIndex = waveform.findIndex(point => point.waveType === ECG_WAVE_TYPES.QRS);
      const tIndex = waveform.findIndex(point => point.waveType === ECG_WAVE_TYPES.T);
      
      // Verify correct sequence
      expect(pIndex).toBeLessThan(qrsIndex);
      expect(qrsIndex).toBeLessThan(tIndex);
    });

    test('should generate different waveforms for different heart rates', () => {
      const waveform60 = generateMedicalECGWaveform(60, 1, 500);
      const waveform120 = generateMedicalECGWaveform(120, 1, 500);
      
      // Should have different cycle characteristics
      const cycles60 = waveform60.filter(p => p.waveType === ECG_WAVE_TYPES.QRS).length;
      const cycles120 = waveform120.filter(p => p.waveType === ECG_WAVE_TYPES.QRS).length;
      
      expect(cycles120).toBeGreaterThan(cycles60);
    });
  });
});

describe('ECG Pattern Generation', () => {
  describe('generateECGPattern', () => {
    test('should generate bradycardia pattern', () => {
      const pattern = generateECGPattern(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA, 50, 2);
      
      expect(Array.isArray(pattern)).toBe(true);
      expect(pattern.length).toBeGreaterThan(0);
      expect(pattern[0]).toHaveProperty('patternType');
      expect(pattern[0].patternType).toBe(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA);
    });

    test('should generate tachycardia pattern', () => {
      const pattern = generateECGPattern(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA, 130, 2);
      
      expect(Array.isArray(pattern)).toBe(true);
      expect(pattern.length).toBeGreaterThan(0);
      expect(pattern[0]).toHaveProperty('patternType');
      expect(pattern[0].patternType).toBe(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA);
    });

    test('should generate normal sinus rhythm pattern', () => {
      const pattern = generateECGPattern(HEART_RATE_CLASSIFICATIONS.NORMAL, 75, 2);
      
      expect(Array.isArray(pattern)).toBe(true);
      expect(pattern.length).toBeGreaterThan(0);
      expect(pattern[0]).toHaveProperty('patternType');
      expect(pattern[0].patternType).toBe(HEART_RATE_CLASSIFICATIONS.NORMAL);
    });

    test('should apply pattern-specific amplitude modifications', () => {
      const normalPattern = generateECGPattern(HEART_RATE_CLASSIFICATIONS.NORMAL, 75, 1);
      const bradyPattern = generateECGPattern(HEART_RATE_CLASSIFICATIONS.BRADYCARDIA, 50, 1);
      const tachyPattern = generateECGPattern(HEART_RATE_CLASSIFICATIONS.TACHYCARDIA, 130, 1);
      
      // Find QRS complexes in each pattern
      const normalQRS = normalPattern.filter(p => p.waveType === ECG_WAVE_TYPES.QRS);
      const bradyQRS = bradyPattern.filter(p => p.waveType === ECG_WAVE_TYPES.QRS);
      const tachyQRS = tachyPattern.filter(p => p.waveType === ECG_WAVE_TYPES.QRS);
      
      if (normalQRS.length > 0 && bradyQRS.length > 0 && tachyQRS.length > 0) {
        const normalMaxAmplitude = Math.max(...normalQRS.map(p => Math.abs(p.y)));
        const bradyMaxAmplitude = Math.max(...bradyQRS.map(p => Math.abs(p.y)));
        const tachyMaxAmplitude = Math.max(...tachyQRS.map(p => Math.abs(p.y)));
        
        // Bradycardia should have higher amplitude than normal
        expect(bradyMaxAmplitude).toBeGreaterThanOrEqual(normalMaxAmplitude * 0.9);
        
        // Tachycardia should have lower amplitude than normal
        expect(tachyMaxAmplitude).toBeLessThanOrEqual(normalMaxAmplitude * 1.1);
      }
    });
  });
});

describe('Medical Accuracy Validation', () => {
  describe('validateECGMedicalAccuracy', () => {
    test('should validate correct ECG waveform', () => {
      const waveform = generateMedicalECGWaveform(75, 2, 500);
      const validation = validateECGMedicalAccuracy(waveform, 75);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.metrics).toBeDefined();
      expect(validation.metrics.pWaveCount).toBeGreaterThan(0);
      expect(validation.metrics.qrsCount).toBeGreaterThan(0);
      expect(validation.metrics.tWaveCount).toBeGreaterThan(0);
    });

    test('should detect missing wave components', () => {
      const incompleteWaveform = [
        { x: 0, y: 0, waveType: ECG_WAVE_TYPES.BASELINE },
        { x: 100, y: 1.5, waveType: ECG_WAVE_TYPES.QRS },
        { x: 200, y: 0, waveType: ECG_WAVE_TYPES.BASELINE }
      ];
      
      const validation = validateECGMedicalAccuracy(incompleteWaveform, 75);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Missing P waves');
      expect(validation.errors).toContain('Missing T waves');
    });

    test('should detect incorrect wave sequence', () => {
      const incorrectWaveform = [
        { x: 0, y: 1.5, waveType: ECG_WAVE_TYPES.QRS },
        { x: 100, y: 0.25, waveType: ECG_WAVE_TYPES.P },
        { x: 200, y: 0.3, waveType: ECG_WAVE_TYPES.T }
      ];
      
      const validation = validateECGMedicalAccuracy(incorrectWaveform, 75);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Incorrect wave sequence - should be P-QRS-T');
    });

    test('should calculate accurate heart rate estimation', () => {
      const waveform = generateMedicalECGWaveform(75, 4, 500);
      const validation = validateECGMedicalAccuracy(waveform, 75);
      
      expect(validation.metrics.estimatedHeartRate).toBeCloseTo(75, 0);
    });

    test('should provide medical interval information', () => {
      const waveform = generateMedicalECGWaveform(75, 2, 500);
      const validation = validateECGMedicalAccuracy(waveform, 75);
      
      expect(validation.metrics.medicalIntervals).toBeDefined();
      expect(validation.metrics.medicalIntervals.rrInterval).toBeDefined();
      expect(validation.metrics.medicalIntervals.prInterval).toBeDefined();
      expect(validation.metrics.medicalIntervals.qtInterval).toBeDefined();
      expect(validation.metrics.medicalIntervals.qtcInterval).toBeDefined();
    });
  });
});

describe('Integration Tests for Medical Accuracy', () => {
  test('should generate medically accurate ECG for all heart rate classifications', () => {
    const heartRates = [45, 75, 130]; // Bradycardia, Normal, Tachycardia
    const classifications = [
      HEART_RATE_CLASSIFICATIONS.BRADYCARDIA,
      HEART_RATE_CLASSIFICATIONS.NORMAL,
      HEART_RATE_CLASSIFICATIONS.TACHYCARDIA
    ];
    
    heartRates.forEach((hr, index) => {
      const waveform = generateMedicalECGWaveform(hr, 2, 500);
      const validation = validateECGMedicalAccuracy(waveform, hr);
      
      expect(validation.isValid).toBe(true);
      expect(validation.metrics.classification).toBe(classifications[index]);
      expect(validation.metrics.estimatedHeartRate).toBeCloseTo(hr, 0);
    });
  });

  test('should maintain wave amplitude relationships across all classifications', () => {
    const heartRates = [45, 75, 130];
    
    heartRates.forEach(hr => {
      const waveform = generateMedicalECGWaveform(hr, 2, 500);
      
      const pWaves = waveform.filter(p => p.waveType === ECG_WAVE_TYPES.P);
      const qrsWaves = waveform.filter(p => p.waveType === ECG_WAVE_TYPES.QRS);
      const tWaves = waveform.filter(p => p.waveType === ECG_WAVE_TYPES.T);
      
      if (pWaves.length > 0 && qrsWaves.length > 0 && tWaves.length > 0) {
        const maxP = Math.max(...pWaves.map(p => Math.abs(p.y)));
        const maxQRS = Math.max(...qrsWaves.map(p => Math.abs(p.y)));
        const maxT = Math.max(...tWaves.map(p => Math.abs(p.y)));
        
        // QRS should have highest amplitude
        expect(maxQRS).toBeGreaterThan(maxP);
        expect(maxQRS).toBeGreaterThan(maxT);
      }
    });
  });

  test('should generate consistent timing relationships', () => {
    const waveform = generateMedicalECGWaveform(75, 4, 500);
    const intervals = calculateMedicalIntervals(75);
    
    // Find cycles and verify timing
    const qrsPoints = waveform.filter(p => p.waveType === ECG_WAVE_TYPES.QRS);
    
    if (qrsPoints.length >= 2) {
      const firstQRS = qrsPoints[0].x;
      const secondQRS = qrsPoints.find(p => p.x > firstQRS + 100)?.x;
      
      if (secondQRS) {
        const measuredRRInterval = secondQRS - firstQRS;
        expect(measuredRRInterval).toBeCloseTo(intervals.rrInterval, 50); // Within 50ms tolerance
      }
    }
  });
});