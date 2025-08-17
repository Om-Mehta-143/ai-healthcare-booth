import React from 'react';

const Sparkline = ({ 
  data, 
  color = "#3b82f6", 
  width = 60, 
  height = 20, 
  strokeWidth = 2,
  showDots = false,
  showArea = true,
  trend = 'stable',
  className = ""
}) => {
  if (!data || data.length < 2) {
    return (
      <div 
        className={`flex items-center justify-center text-xs text-gray-400 ${className}`}
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  // Calculate SVG viewBox and path
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points}`;
  
  // Create area fill path
  const areaPathData = `M ${points} L ${width},${height} L 0,${height} Z`;

  // Get trend color
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Background grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Area fill */}
        {showArea && (
          <path
            d={areaPathData}
            fill={`${color}20`}
            opacity="0.3"
          />
        )}
        
        {/* Line */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {showDots && data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="animate-pulse"
            />
          );
        })}
        
        {/* Trend indicator */}
        <circle
          cx={width - 5}
          cy={5}
          r="8"
          fill={getTrendColor()}
          opacity="0.8"
        />
        <text
          x={width - 5}
          y="8"
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontWeight="bold"
        >
          {getTrendIcon()}
        </text>
      </svg>
      
      {/* Hover tooltip */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Trend: {trend}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default Sparkline;