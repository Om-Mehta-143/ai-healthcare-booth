/**
 * ECG Grid Example
 * 
 * This file demonstrates the medical-grade ECG grid functionality
 * implemented in the ECGWaveform component.
 */

// Example usage of ECGWaveform with medical-grade grid
export const ECGGridExample = {
  // Basic grid configuration
  basicGrid: {
    showGrid: true,
    width: 400,
    height: 120,
    heartRate: 72
  },

  // Large component with scale indicators
  largeGrid: {
    showGrid: true,
    width: 800,
    height: 240,
    heartRate: 85
  },

  // Small responsive grid
  smallGrid: {
    showGrid: true,
    width: 200,
    height: 80,
    heartRate: 95
  },

  // Grid disabled for comparison
  noGrid: {
    showGrid: false,
    width: 400,
    height: 120,
    heartRate: 72
  }
};

// Medical ECG grid specifications
export const ECGGridSpecs = {
  // Standard ECG paper specifications
  paperSpeed: 25, // mm/s
  amplitudeScale: 10, // mm/mV
  
  // Grid line intervals
  majorGrid: {
    time: 0.2, // seconds (5mm)
    amplitude: 0.5 // mV (5mm)
  },
  
  minorGrid: {
    time: 0.04, // seconds (1mm)
    amplitude: 0.1 // mV (1mm)
  },

  // Medical colors
  colors: {
    minorGrid: '#1a4d1a', // Dark green
    majorGrid: '#2d5a2d', // Medium green
    baseline: '#4a7c4a', // Prominent green
    waveform: '#00ff41', // Bright medical green
    cursor: '#ffff00', // Medical yellow
    background: '#0a0a0a' // Deep black
  }
};

// Grid calculation utilities
export const calculateGridSpacing = (width, height) => {
  const minMajorSpacing = 20;
  const maxMajorSpacing = 60;
  
  let majorGridX = Math.max(minMajorSpacing, Math.min(maxMajorSpacing, width / 10));
  let majorGridY = Math.max(minMajorSpacing, Math.min(maxMajorSpacing, height / 6));
  
  // Ensure even distribution
  majorGridX = width / Math.round(width / majorGridX);
  majorGridY = height / Math.round(height / majorGridY);
  
  return {
    major: { x: majorGridX, y: majorGridY },
    minor: { x: majorGridX / 5, y: majorGridY / 5 }
  };
};

export default ECGGridExample;