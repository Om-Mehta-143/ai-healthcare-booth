import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Heart, Activity, Thermometer, Eye, Settings, BarChart3 } from 'lucide-react';

const DemoMode = ({ isActive, onToggle, onScenarioChange, currentScenario }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [speed, setSpeed] = useState(2); // 1x, 2x, 5x speed

  const scenarios = [
    {
      name: "Normal Operation",
      description: "Standard patient monitoring with normal vital ranges",
      icon: <Heart className="w-5 h-5 text-green-500" />,
      color: "green",
      vitals: {
        heartRate: { min: 60, max: 100, variance: 5 },
        spO2: { min: 95, max: 100, variance: 2 },
        temperature: { min: 36.5, max: 37.2, variance: 0.3 },
        bloodPressure: { min: 110, max: 130, variance: 10 }
      }
    },
    {
      name: "Critical Patient",
      description: "Emergency scenario with unstable vitals requiring immediate attention",
      icon: <Activity className="w-5 h-5 text-red-500" />,
      color: "red",
      vitals: {
        heartRate: { min: 120, max: 180, variance: 20 },
        spO2: { min: 85, max: 92, variance: 5 },
        temperature: { min: 38.5, max: 40.0, variance: 0.8 },
        bloodPressure: { min: 80, max: 100, variance: 15 }
      }
    },
    {
      name: "Post-Surgery Recovery",
      description: "Patient in recovery with gradually improving vitals",
      icon: <Thermometer className="w-5 h-5 text-blue-500" />,
      color: "blue",
      vitals: {
        heartRate: { min: 70, max: 90, variance: 8 },
        spO2: { min: 92, max: 98, variance: 3 },
        temperature: { min: 36.8, max: 37.8, variance: 0.5 },
        bloodPressure: { min: 100, max: 120, variance: 12 }
      }
    },
    {
      name: "Pediatric Case",
      description: "Young patient with higher baseline heart rate and temperature",
      icon: <Eye className="w-5 h-5 text-purple-500" />,
      color: "purple",
      vitals: {
        heartRate: { min: 80, max: 120, variance: 15 },
        spO2: { min: 96, max: 100, variance: 2 },
        temperature: { min: 36.8, max: 37.5, variance: 0.4 },
        bloodPressure: { min: 90, max: 110, variance: 8 }
      }
    },
    {
      name: "Geriatric Monitoring",
      description: "Elderly patient with lower baseline vitals and slower recovery",
      icon: <BarChart3 className="w-5 h-5 text-orange-500" />,
      color: "orange",
      vitals: {
        heartRate: { min: 55, max: 85, variance: 6 },
        spO2: { min: 93, max: 97, variance: 3 },
        temperature: { min: 36.2, max: 36.9, variance: 0.3 },
        bloodPressure: { min: 130, max: 150, variance: 12 }
      }
    }
  ];

  useEffect(() => {
    if (isActive && isPlaying) {
      const interval = setInterval(() => {
        setScenarioIndex(prev => (prev + 1) % scenarios.length);
      }, 8000 / speed); // Change scenario every 8 seconds (adjusted for speed)

      return () => clearInterval(interval);
    }
  }, [isActive, isPlaying, speed, scenarios.length, onScenarioChange]);

  useEffect(() => {
    if (onScenarioChange && scenarios[scenarioIndex]) {
      onScenarioChange(scenarios[scenarioIndex]);
    }
  }, [scenarioIndex, onScenarioChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextScenario = () => {
    setScenarioIndex(prev => (prev + 1) % scenarios.length);
  };

  const handlePreviousScenario = () => {
    setScenarioIndex(prev => (prev - 1 + scenarios.length) % scenarios.length);
  };

  const handleSpeedChange = () => {
    const speeds = [1, 2, 5];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleReset = () => {
    setScenarioIndex(0);
    setIsPlaying(false);
    setSpeed(2);
  };

  if (!isActive) return null;

  const currentScenarioData = scenarios[scenarioIndex];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Demo Mode</h3>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Current Scenario */}
        <div className={`mb-4 p-4 rounded-xl border-2 border-${currentScenarioData.color}-200 dark:border-${currentScenarioData.color}-700 bg-${currentScenarioData.color}-50 dark:bg-${currentScenarioData.color}-900/20`}>
          <div className="flex items-center space-x-3 mb-2">
            {currentScenarioData.icon}
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {currentScenarioData.name}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentScenarioData.description}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Play/Pause Controls */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handlePreviousScenario}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className={`p-3 rounded-full transition-all duration-300 ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleNextScenario}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400 transform rotate-180" />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
            <button
              onClick={handleSpeedChange}
              className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
            >
              {speed}x
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 font-medium"
          >
            Reset Demo
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Scenario {scenarioIndex + 1} of {scenarios.length}</span>
            <span>{Math.round((scenarioIndex / (scenarios.length - 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(scenarioIndex / (scenarios.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 text-center">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            isPlaying 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isPlaying ? 'Auto-cycling' : 'Paused'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoMode;
