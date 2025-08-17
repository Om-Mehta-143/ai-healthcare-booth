import React, { useState, useEffect } from 'react';
import { Heart, Activity, Thermometer, Eye, TrendingUp, TrendingDown, Minus, Wifi, WifiOff } from 'lucide-react';
import ECGWaveform from './ECGWaveform';
import AnimatedCounter from './AnimatedCounter';
import Tooltip from './Tooltip';
import Sparkline from './Sparkline';
import { useRealTimeData, useVitalSigns, useAIProcessing } from '../hooks/useRealTimeData';

const VitalsMonitor = ({ isDemoMode = false }) => {
  const { isConnected, lastUpdate, dataPoints } = useRealTimeData();
  const { vitals } = useVitalSigns();
  const { isProcessing, confidence, predictions } = useAIProcessing();
  
  // Historical data for sparklines
  const [heartRateHistory, setHeartRateHistory] = useState([72, 74, 71, 73, 75, 72, 70, 73]);
  const [spO2History, setSpO2History] = useState([98, 97, 98, 99, 98, 97, 98, 98]);
  const [tempHistory, setTempHistory] = useState([36.8, 36.9, 36.7, 36.8, 36.9, 36.8, 36.7, 36.8]);

  // Update history when vitals change
  useEffect(() => {
    setHeartRateHistory(prev => [...prev.slice(-7), vitals.heartRate]);
    setSpO2History(prev => [...prev.slice(-7), vitals.spO2]);
    setTempHistory(prev => [...prev.slice(-7), parseFloat(vitals.temperature)]);
  }, [vitals]);

  const [aiDiagnosis] = useState({
    condition: 'Pneumonia',
    confidence: 'High'
  });

  // Get trend indicators
  const getTrend = (history) => {
    if (history.length < 2) return 'stable';
    const recent = history.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previous = history.slice(-6, -3);
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    if (avg > prevAvg * 1.02) return 'up';
    if (avg < prevAvg * 0.98) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const patients = [
    { id: 1, name: 'Sarah Johnson', age: 34, status: 'Stable', vitals: 'Normal', lastUpdate: '2 min ago' },
    { id: 2, name: 'Michael Chen', age: 67, status: 'Critical', vitals: 'Low SpO2', lastUpdate: '1 min ago' },
    { id: 3, name: 'Emma Davis', age: 28, status: 'Stable', vitals: 'Normal', lastUpdate: '5 min ago' },
    { id: 4, name: 'Robert Wilson', age: 45, status: 'Warning', vitals: 'Elevated HR', lastUpdate: '3 min ago' },
    { id: 5, name: 'Lisa Brown', age: 52, status: 'Stable', vitals: 'Normal', lastUpdate: '4 min ago' }
  ];

  // Real-time connection status
  const getConnectionStatus = () => {
    if (!isConnected) return { icon: WifiOff, color: 'text-red-500', text: 'Disconnected' };
    return { icon: Wifi, color: 'text-green-500', text: 'Live Data' };
  };





  const getStatusColor = (status) => {
    switch (status) {
      case 'Stable': return 'status-stable';
      case 'Critical': return 'status-critical';
      case 'Warning': return 'status-warning';
      default: return 'status-stable';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Vitals Monitor</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time patient monitoring and diagnostics</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 ${
          isConnected 
            ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200/50 dark:border-green-700/50' 
            : 'bg-red-50/80 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/50'
        }`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 pulse-slow' : 'bg-red-500 animate-pulse'}`}></div>
          <span className={`text-sm font-semibold transition-colors duration-300 ${
            isConnected ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {getConnectionStatus().text} • {dataPoints} pts
          </span>
        </div>
      </div>
      
      {/* Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Tooltip content="Normal range: 60-100 BPM. Current reading indicates normal cardiac rhythm.">
          <div className="card vitals-card p-6 glow-blue hover:scale-[1.03] transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Heart Rate</p>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(getTrend(heartRateHistory))}
                    <Sparkline 
                      data={heartRateHistory} 
                      color="#dc2626" 
                      width={40} 
                      height={16}
                      trend={getTrend(heartRateHistory)}
                    />
                  </div>
                </div>
                <AnimatedCounter 
                  end={vitals.heartRate} 
                  className="text-4xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300 mb-1"
                  duration={1500}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">BPM</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full pulse-slow"></div>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Normal range: 95-100%. Measures oxygen saturation in blood. Current level is excellent.">
          <div className="card vitals-card p-6 glow-blue hover:scale-[1.03] transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">SpO2</p>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(getTrend(spO2History))}
                    <Sparkline 
                      data={spO2History} 
                      color="#2563eb" 
                      width={40} 
                      height={16}
                      trend={getTrend(spO2History)}
                    />
                  </div>
                </div>
                <AnimatedCounter 
                  end={vitals.spO2} 
                  suffix="%" 
                  className="text-4xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300 mb-1"
                  duration={1500}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Oxygen Saturation</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full pulse-slow"></div>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Normal range: 36.1-37.2°C (97-99°F). Core body temperature is within normal limits.">
          <div className="card vitals-card p-6 glow-blue hover:scale-[1.03] transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Temperature</p>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(getTrend(tempHistory))}
                    <Sparkline 
                      data={tempHistory} 
                      color="#ea580c" 
                      width={40} 
                      height={16}
                      trend={getTrend(tempHistory)}
                    />
                  </div>
                </div>
                <AnimatedCounter 
                  end={parseFloat(vitals.temperature)} 
                  suffix="°C" 
                  decimals={1}
                  className="text-4xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300 mb-1"
                  duration={1500}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Body Temp</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center">
                  <Thermometer className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full pulse-slow"></div>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content="Normal range: 90-120/60-80 mmHg. Systolic/Diastolic pressure readings are optimal.">
          <div className="card vitals-card p-6 glow-purple hover:scale-[1.03] transition-all duration-300 cursor-help">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Blood Pressure</p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300 mb-1">{vitals.bloodPressure}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">mmHg</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-purple-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full pulse-slow"></div>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* AI Diagnosis Card */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">AI Diagnosis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Condition:</span>
            <span className="text-lg font-bold text-red-600 dark:text-red-400 transition-colors duration-300">{aiDiagnosis.condition}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Probability:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {isProcessing ? (
                  <span className="animate-pulse text-blue-500">Processing...</span>
                ) : (
                  <AnimatedCounter end={confidence} suffix="%" duration={1000} />
                )}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors duration-300">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isProcessing 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500'
                }`}
                style={{ width: `${isProcessing ? 100 : confidence}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Confidence:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {aiDiagnosis.confidence}
            </span>
          </div>
        </div>
      </div>

      {/* ECG Waveform Animation */}
      <div className="card p-8 glow-green">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-1">
              ECG Waveform
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Real-time cardiac monitoring - {vitals.heartRate} BPM</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50/80 dark:bg-green-900/20 rounded-full border border-green-200/50 dark:border-green-700/50">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-slow"></div>
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Recording</span>
          </div>
        </div>
        <div className="ecg-container p-4">
          <ECGWaveform 
            heartRate={vitals.heartRate}
            width={600}
            height={150}
            showGrid={true}
            showLegend={true}
            autoPlay={true}
            onHeartRateChange={(change) => {
              console.log(`Heart rate changed from ${change.from} to ${change.to} BPM`);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-1">Patient Status</h3>
            <p className="text-gray-600 dark:text-gray-400">Current patient monitoring overview</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {patients.length} patients monitored
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full enhanced-table rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Age</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Vitals</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id} className={`table-row border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-700/50'}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{patient.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">{patient.age}</td>
                  <td className="py-4 px-6">
                    <span className={`status-badge ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">{patient.vitals}</td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">{patient.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VitalsMonitor;
