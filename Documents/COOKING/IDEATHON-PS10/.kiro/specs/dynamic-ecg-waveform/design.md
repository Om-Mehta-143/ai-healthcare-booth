# Design Document

## Overview

The dynamic ECG waveform feature will enhance the existing VitalsMonitor component by implementing a more sophisticated, medically accurate ECG visualization that responds dynamically to heart rate changes. The current implementation has basic ECG functionality, but this design will improve it with better waveform generation, smoother animations, and more realistic medical visualization.

The solution will use React hooks for state management, SVG for high-quality vector graphics, and Canvas API for performance-critical real-time rendering. The ECG waveform will be implemented as a reusable component that can be integrated into the existing dashboard architecture.

## Architecture

### Component Structure
```
ECGWaveform (New Component)
├── ECGCanvas (Canvas-based renderer)
├── ECGControls (Optional controls for zoom/speed)
└── ECGLegend (Wave identification and status)

VitalsMonitor (Enhanced)
├── Existing vitals cards
├── ECGWaveform (Integrated)
└── Patient table
```

### Data Flow
1. Heart rate data flows from VitalsMonitor state to ECGWaveform component
2. ECGWaveform calculates waveform parameters based on heart rate
3. Animation loop updates waveform position and morphology
4. Canvas renders the waveform with medical-grade accuracy

### Technology Stack
- **React 18.2.0**: Component framework (existing)
- **Canvas API**: High-performance real-time rendering
- **SVG**: Fallback for static elements and grid
- **Tailwind CSS**: Styling (existing)
- **RequestAnimationFrame**: Smooth 60fps animation

## Components and Interfaces

### ECGWaveform Component

```javascript
interface ECGWaveformProps {
  heartRate: number;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

interface ECGState {
  animationPhase: number;
  waveformData: Point[];
  isAnimating: boolean;
  lastHeartRate: number;
}
```

### ECG Wave Generation Algorithm

The component will implement a medically accurate ECG wave generation algorithm:

1. **P Wave**: Atrial depolarization (0.08-0.12s duration, 0.25mV amplitude)
2. **PR Interval**: Conduction delay (0.12-0.20s)
3. **QRS Complex**: Ventricular depolarization (0.06-0.10s duration, 1.0-2.0mV amplitude)
4. **ST Segment**: Ventricular plateau (0.08-0.12s)
5. **T Wave**: Ventricular repolarization (0.16s duration, 0.1-0.5mV amplitude)

### Heart Rate Adaptation Logic

```javascript
const calculateWaveformParameters = (heartRate) => {
  const rr_interval = 60000 / heartRate; // milliseconds between beats
  
  return {
    cycleLength: rr_interval,
    pWaveDuration: Math.max(80, Math.min(120, rr_interval * 0.08)),
    qrsComplexDuration: Math.max(60, Math.min(100, rr_interval * 0.06)),
    tWaveDuration: Math.max(120, Math.min(200, rr_interval * 0.16)),
    amplitude: heartRate > 100 ? 0.8 : heartRate < 60 ? 1.2 : 1.0
  };
};
```

## Data Models

### ECG Point Structure
```javascript
interface ECGPoint {
  x: number;        // Time coordinate (ms)
  y: number;        // Amplitude coordinate (mV)
  waveType: 'P' | 'QRS' | 'T' | 'baseline';
  timestamp: number; // For animation timing
}
```

### Waveform Configuration
```javascript
interface WaveformConfig {
  samplingRate: number;     // Points per second (default: 500)
  displayDuration: number;  // Seconds of data to show (default: 4)
  gridSpacing: {
    major: number;          // Major grid lines (0.2s, 0.5mV)
    minor: number;          // Minor grid lines (0.04s, 0.1mV)
  };
  colors: {
    waveform: string;       // ECG trace color (#00FF00)
    grid: string;           // Grid color (#E5E7EB)
    cursor: string;         // Real-time cursor (#3B82F6)
  };
}
```

## Error Handling

### Data Validation
- Heart rate bounds checking (20-300 BPM)
- Graceful degradation for invalid data
- Fallback to flat line for missing heart rate

### Performance Safeguards
- Animation frame rate limiting
- Memory management for waveform data
- Automatic pause when component is not visible

### Error States
```javascript
const ErrorStates = {
  NO_DATA: 'no-data',
  INVALID_HEART_RATE: 'invalid-hr',
  RENDERING_ERROR: 'render-error',
  PERFORMANCE_LIMIT: 'perf-limit'
};
```

## Testing Strategy

### Unit Tests
- ECG wave generation algorithm accuracy
- Heart rate to waveform parameter conversion
- Component prop validation
- Error state handling

### Integration Tests
- Integration with VitalsMonitor component
- Real-time data updates
- Animation performance under load
- Cross-browser compatibility

### Visual Regression Tests
- Waveform morphology accuracy
- Grid alignment and scaling
- Color scheme consistency
- Responsive design behavior

### Performance Tests
- Animation frame rate consistency
- Memory usage over time
- CPU utilization monitoring
- Battery impact on mobile devices

## Implementation Phases

### Phase 1: Core ECG Component
- Create ECGWaveform component with Canvas rendering
- Implement basic P-QRS-T wave generation
- Add heart rate responsive timing

### Phase 2: Medical Accuracy
- Implement precise wave morphology
- Add heart rate classification (bradycardia/normal/tachycardia)
- Include medical grid background

### Phase 3: Performance Optimization
- Optimize Canvas rendering performance
- Add animation frame rate control
- Implement memory management

### Phase 4: Integration & Polish
- Integrate with existing VitalsMonitor
- Add responsive design
- Implement accessibility features

## Technical Considerations

### Canvas vs SVG Decision
- **Canvas**: Chosen for real-time animation performance
- **SVG**: Used for static grid and legend elements
- **Hybrid approach**: Canvas for waveform, SVG for UI elements

### Animation Strategy
- Use `requestAnimationFrame` for smooth 60fps animation
- Implement time-based animation (not frame-based)
- Add automatic pause/resume based on visibility

### Medical Accuracy Requirements
- Maintain proper ECG wave timing relationships
- Use standard medical colors and scaling
- Implement realistic wave morphology variations

### Accessibility
- Provide alternative text descriptions
- Support keyboard navigation
- Include high contrast mode support
- Add screen reader compatible status updates