import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ECGWaveform from '../ECGWaveform';

// Mock Canvas API
const mockContext = {
  scale: jest.fn(),
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fillText: jest.fn(),
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

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockContext)
});

describe('ECG Integration Tests', () => {
  test('ECG component responds to heart rate changes', () => {
    const onHeartRateChange = jest.fn();
    const { rerender } = render(
      <ECGWaveform heartRate={72} onHeartRateChange={onHeartRateChange} showLegend={true} />
    );

    // Should render with initial heart rate
    expect(screen.getByText(/Current: 72 BPM/)).toBeInTheDocument();

    // Change heart rate
    rerender(
      <ECGWaveform heartRate={85} onHeartRateChange={onHeartRateChange} showLegend={true} />
    );

    // Should call callback
    expect(onHeartRateChange).toHaveBeenCalledWith({
      from: 72,
      to: 85,
      timestamp: expect.any(Number)
    });

    // Should show transition
    expect(screen.getByText(/transitioning/)).toBeInTheDocument();
  });

  test('ECG component handles different heart rate classifications', () => {
    // Test bradycardia
    const { rerender } = render(<ECGWaveform heartRate={50} showLegend={true} />);
    expect(screen.getByText('Bradycardia')).toBeInTheDocument();

    // Test normal
    rerender(<ECGWaveform heartRate={75} showLegend={true} />);
    expect(screen.getByText('Normal Rhythm')).toBeInTheDocument();

    // Test tachycardia
    rerender(<ECGWaveform heartRate={120} showLegend={true} />);
    expect(screen.getByText('Tachycardia')).toBeInTheDocument();
  });

  test('ECG component integrates with parent data flow', () => {
    const TestParent = ({ heartRate }) => {
      return <ECGWaveform heartRate={heartRate} showLegend={true} />;
    };

    const { rerender } = render(<TestParent heartRate={70} />);
    expect(screen.getByText(/Current: 70 BPM/)).toBeInTheDocument();

    rerender(<TestParent heartRate={90} />);
    expect(screen.getByText(/transitioning/)).toBeInTheDocument();
  });
});