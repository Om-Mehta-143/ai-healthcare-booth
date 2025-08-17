import React, { useState } from 'react';
import { MapPin, AlertTriangle, Users, TrendingUp, Activity } from 'lucide-react';

const OutbreakMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const outbreakData = [
    {
      id: 1,
      region: 'Northern District',
      cases: 47,
      severity: 'High',
      coordinates: { x: 25, y: 30 },
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      lastUpdate: '2 hours ago'
    },
    {
      id: 2,
      region: 'Eastern Valley',
      cases: 23,
      severity: 'Medium',
      coordinates: { x: 70, y: 45 },
      symptoms: ['Headache', 'Nausea'],
      lastUpdate: '4 hours ago'
    },
    {
      id: 3,
      region: 'Western Hills',
      cases: 89,
      severity: 'Critical',
      coordinates: { x: 15, y: 70 },
      symptoms: ['Fever', 'Cough', 'Shortness of Breath'],
      lastUpdate: '1 hour ago'
    },
    {
      id: 4,
      region: 'Central Plains',
      cases: 12,
      severity: 'Low',
      coordinates: { x: 50, y: 60 },
      symptoms: ['Mild Fever'],
      lastUpdate: '6 hours ago'
    },
    {
      id: 5,
      region: 'Southern Coast',
      cases: 34,
      severity: 'Medium',
      coordinates: { x: 80, y: 80 },
      symptoms: ['Cough', 'Sore Throat'],
      lastUpdate: '3 hours ago'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeveritySize = (severity) => {
    switch (severity) {
      case 'Low': return 'w-3 h-3';
      case 'Medium': return 'w-4 h-4';
      case 'High': return 'w-5 h-5';
      case 'Critical': return 'w-6 h-6';
      default: return 'w-3 h-3';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Outbreak Map</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time disease outbreak monitoring and tracking</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-50/80 dark:bg-red-900/20 rounded-full border border-red-200/50 dark:border-red-700/50">
          <div className="w-3 h-3 bg-red-500 rounded-full pulse-slow"></div>
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
            {outbreakData.filter(r => r.severity === 'Critical').length} Critical
          </span>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Affected Regions</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300 mb-1">{outbreakData.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Active Areas</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Total Cases</p>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300 mb-1">
                {outbreakData.reduce((sum, region) => sum + region.cases, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Confirmed</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Critical Areas</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300 mb-1">
                {outbreakData.filter(r => r.severity === 'Critical').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">High Risk</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="card vitals-card p-6 glow-green">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">24h Change</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300 mb-1">+12%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Trending</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-1">Regional Outbreak Distribution</h3>
            <p className="text-gray-600 dark:text-gray-400">Interactive outbreak severity mapping</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50 transition-colors duration-300">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-700 dark:text-green-300">Low</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/50 dark:border-yellow-700/50 transition-colors duration-300">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-yellow-700 dark:text-yellow-300">Medium</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-700/50 transition-colors duration-300">
              <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
              <span className="font-semibold text-orange-700 dark:text-orange-300">High</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-50/80 dark:bg-red-900/20 rounded-lg border border-red-200/50 dark:border-red-700/50 transition-colors duration-300">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-red-700 dark:text-red-300">Critical</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Map */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl border-2 border-gray-200 dark:border-gray-700 h-96 overflow-hidden transition-colors duration-300 shadow-inner">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50 dark:from-blue-800/20 dark:to-green-800/20 transition-colors duration-300"></div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-gray-300 dark:bg-gray-600 opacity-30 dark:opacity-20 transition-colors duration-300" style={{ top: `${i * 10}%` }}></div>
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-gray-300 dark:bg-gray-600 opacity-30 dark:opacity-20 transition-colors duration-300" style={{ left: `${i * 10}%` }}></div>
            ))}
          </div>
          
          {/* Region Labels */}
          <div className="absolute top-4 left-4 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors duration-300">Northern District</div>
          <div className="absolute top-4 right-4 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors duration-300">Eastern Valley</div>
          <div className="absolute bottom-4 left-4 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors duration-300">Western Hills</div>
          <div className="absolute bottom-4 right-4 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors duration-300">Southern Coast</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors duration-300">Central Plains</div>
          
          {/* Hotspot Markers */}
          {outbreakData.map((region) => (
            <div
              key={region.id}
              className={`absolute ${getSeverityColor(region.severity)} ${getSeveritySize(region.severity)} rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow hover:scale-125 transition-transform duration-200`}
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y}%`
              }}
              onClick={() => setSelectedRegion(region)}
            >
              <div className="relative">
                <div className={`absolute inset-0 ${getSeverityColor(region.severity)} rounded-full animate-ping opacity-75`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Region Details */}
      {selectedRegion && (
        <div className="card p-8 border-l-4 border-red-500 glow-blue">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-1">{selectedRegion.region}</h3>
              <p className="text-gray-600 dark:text-gray-400">Detailed outbreak information</p>
            </div>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-3xl font-bold transition-colors duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Outbreak Statistics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Active Cases:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{selectedRegion.cases}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Severity Level:</span>
                  <span className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors duration-300 ${
                    selectedRegion.severity === 'Critical' ? 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200/50 dark:border-red-700/50' :
                    selectedRegion.severity === 'High' ? 'bg-orange-100/80 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200/50 dark:border-orange-700/50' :
                    selectedRegion.severity === 'Medium' ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-700/50' :
                    'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50 dark:border-green-700/50'
                  }`}>
                    {selectedRegion.severity}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Last Update:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{selectedRegion.lastUpdate}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Common Symptoms</h4>
              <div className="space-y-3">
                {selectedRegion.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50/80 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50 transition-colors duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outbreak Timeline */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-1">Outbreak Timeline</h3>
            <p className="text-gray-600 dark:text-gray-400">Recent outbreak developments and updates</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-6 p-4 bg-red-50/80 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50 transition-colors duration-300">
            <div className="w-4 h-4 bg-red-500 rounded-full pulse-slow"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Western Hills outbreak detected</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">2 hours ago - 89 cases reported</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 p-4 bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50 transition-colors duration-300">
            <div className="w-4 h-4 bg-orange-500 rounded-full pulse-slow"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Northern District cases increasing</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">4 hours ago - 47 cases reported</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 p-4 bg-yellow-50/80 dark:bg-yellow-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50 transition-colors duration-300">
            <div className="w-4 h-4 bg-yellow-500 rounded-full pulse-slow"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Eastern Valley monitoring</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">6 hours ago - 23 cases reported</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutbreakMap;
