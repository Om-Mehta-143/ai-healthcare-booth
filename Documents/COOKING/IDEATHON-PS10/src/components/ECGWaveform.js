import React, { useState, useEffect, useRef } from 'react';

const ECGWaveform = ({ 
  heartRate = 72, 
  width = 600, 
  height = 150, 
  showGrid = true, 
  showLegend = true, 
  autoPlay = true,
  onHeartRateChange,
  className = ""
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [currentHeartRate, setCurrentHeartRate] = useState(heartRate);
  const animationRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (onHeartRateChange && currentHeartRate !== heartRate) {
      onHeartRateChange({ from: currentHeartRate, to: heartRate });
      setCurrentHeartRate(heartRate);
    }
  }, [heartRate, currentHeartRate, onHeartRateChange]);

  useEffect(() => {
    if (!autoPlay) return;

    const animate = () => {
      setAnimationPhase(prev => (prev + 0.02) % 1);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoPlay]);

  // Generate ECG waveform based on heart rate
  const generateWaveform = () => {
    const cyclesPerSecond = heartRate / 60;
    const cycleWidth = width / Math.min(4, Math.max(2, Math.floor(cyclesPerSecond * 2)));
    
    let pathData = `M0,${height/2} `;
    
    for (let cycle = 0; cycle < Math.min(4, Math.max(2, Math.floor(cyclesPerSecond * 2))); cycle++) {
      const cycleStartX = cycle * cycleWidth;
      
      // Baseline
      pathData += `L${cycleStartX + 5},${height/2} `;
      
      // P Wave
      pathData += `Q${cycleStartX + 5 + cycleWidth * 0.1},${height/2 - 15} ${cycleStartX + 5 + cycleWidth * 0.2},${height/2} `;
      
      // Baseline before QRS
      pathData += `L${cycleStartX + 5 + cycleWidth * 0.25},${height/2} `;
      
      // QRS Complex
      pathData += `L${cycleStartX + 5 + cycleWidth * 0.25},${height/2 - 25} `;
      pathData += `L${cycleStartX + 5 + cycleWidth * 0.35},${height/2 + 35} `;
      pathData += `L${cycleStartX + 5 + cycleWidth * 0.45},${height/2} `;
      
      // Baseline after QRS
      pathData += `L${cycleStartX + 5 + cycleWidth * 0.6},${height/2} `;
      
      // T Wave
      pathData += `Q${cycleStartX + 5 + cycleWidth * 0.7},${height/2 - 15} ${cycleStartX + 5 + cycleWidth * 0.8},${height/2} `;
      
      // Baseline to next cycle
      pathData += `L${cycleStartX + 5 + cycleWidth * 0.9},${height/2} `;
    }
    
    pathData += `L${width},${height/2}`;
    return pathData;
  };

  return (
    <div className={`ecg-waveform ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        {/* Grid Lines */}
        {showGrid && (
          <>
            {/* Horizontal Grid */}
            {Array.from({ length: Math.floor(height / 20) + 1 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 20}
                x2={width}
                y2={i * 20}
                stroke="#e5e7eb"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {/* Vertical Grid */}
            {Array.from({ length: Math.floor(width / 50) + 1 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2={height}
                stroke="#e5e7eb"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </>
        )}

        {/* ECG Waveform */}
        <path
          d={generateWaveform()}
          stroke="red"
          strokeWidth="2"
          fill="none"
          className="transition-all duration-300 ease-out"
          style={{
            transform: `translateX(${-animationPhase * 100}px)`,
            transformOrigin: 'center'
          }}
        />

        {/* Moving Cursor */}
        <line
          x1={animationPhase * width}
          y1="0"
          x2={animationPhase * width}
          y2={height}
          stroke="blue"
          strokeWidth="2"
          opacity="0.7"
          className="animate-pulse"
        />
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>P Wave</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>QRS Complex</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>T Wave</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ECGWaveform;