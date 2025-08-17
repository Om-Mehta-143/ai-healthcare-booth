import React, { useState, useEffect } from 'react';
import ECGWaveform from '../components/ECGWaveform';

/**
 * ECGWaveformExample Component
 * 
 * Demonstrates the real-time ECG animation system with interactive controls
 * for testing animation state management, heart rate changes, and performance.
 */
const ECGWaveformExample = () => {
  const [heartRate, setHeartRate] = useState(72);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [animationState, setAnimationState] = useState('playing');

  // Simulate heart rate changes for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic heart rate variations
      const variation = (Math.random() - 0.5) * 10; // ±5 BPM variation
      const newHeartRate = Math.max(50, Math.min(120, heartRate + variation));
      setHeartRate(Math.round(newHeartRate));
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [heartRate]);

  const handleAnimationStateChange = (state) => {
    setAnimationState(state);
    console.log('Animation state changed:', state);
  };

  const handleHeartRateChange = (event) => {
    setHeartRate(parseInt(event.target.value));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ECG Waveform Animation System Demo</h1>
      
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Animation Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Heart Rate: {heartRate} BPM
            </label>
            <input
              type="range"
              min="40"
              max="180"
              value={heartRate}
              onChange={handleHeartRateChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Auto Play
            </label>
            <button
              onClick={toggleAutoPlay}
              className={`px-4 py-2 rounded ${
                isAutoPlay 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {isAutoPlay ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Animation State
            </label>
            <div className={`px-3 py-2 rounded text-center ${
              animationState === 'playing' 
                ? 'bg-green-100 text-green-800'
                : animationState === 'paused'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {animationState}
            </div>
          </div>
        </div>
      </div>

      {/* ECG Waveform Display */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Real-time ECG Waveform</h2>
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-black">
          <ECGWaveform
            heartRate={heartRate}
            width={800}
            height={200}
            showGrid={true}
            showLegend={true}
            autoPlay={isAutoPlay}
            onAnimationStateChange={handleAnimationStateChange}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Performance Information */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Animation System Features</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>requestAnimationFrame-based animation loop</strong> - Smooth 60fps animation</li>
          <li><strong>Time-based animation calculations</strong> - Consistent timing regardless of frame rate</li>
          <li><strong>Right-to-left scrolling effect</strong> - Realistic ECG monitor behavior</li>
          <li><strong>Animation state management</strong> - Play/pause/reset functionality</li>
          <li><strong>Performance optimization</strong> - Automatic pause when tab is hidden</li>
          <li><strong>Heart rate responsiveness</strong> - Waveform frequency adapts to BPM changes</li>
          <li><strong>Medical accuracy</strong> - Proper P-QRS-T wave morphology and timing</li>
        </ul>
      </div>

      {/* Heart Rate Classifications */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Heart Rate Classifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded ${heartRate < 60 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border'}`}>
            <div className="font-semibold text-blue-600">Bradycardia</div>
            <div>&lt; 60 BPM</div>
            <div className="text-xs text-gray-600 mt-1">Slower beat intervals, higher amplitude</div>
          </div>
          
          <div className={`p-3 rounded ${heartRate >= 60 && heartRate <= 100 ? 'bg-green-100 border-2 border-green-500' : 'bg-white border'}`}>
            <div className="font-semibold text-green-600">Normal Rhythm</div>
            <div>60-100 BPM</div>
            <div className="text-xs text-gray-600 mt-1">Standard sinus rhythm pattern</div>
          </div>
          
          <div className={`p-3 rounded ${heartRate > 100 ? 'bg-red-100 border-2 border-red-500' : 'bg-white border'}`}>
            <div className="font-semibold text-red-600">Tachycardia</div>
            <div>&gt; 100 BPM</div>
            <div className="text-xs text-gray-600 mt-1">Faster beat intervals, lower amplitude</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGWaveformExample;