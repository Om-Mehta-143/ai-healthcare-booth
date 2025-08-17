import React from 'react';
import { Heart, Camera, Map, Bell, ChevronRight, BarChart3 } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isVisible = true }) => {
  const tabs = [
    { id: 'vitals', label: 'Vitals Monitor', icon: Heart, color: 'red', description: 'Real-time patient monitoring' },
    { id: 'imaging', label: 'Medical Imaging', icon: Camera, color: 'blue', description: 'Diagnostic imaging tools' },
    { id: 'outbreak', label: 'Outbreak Map', icon: Map, color: 'green', description: 'Disease tracking & analysis' },
    { id: 'alerts', label: 'Alert System', icon: Bell, color: 'yellow', description: 'Critical notifications' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'purple', description: 'System performance & metrics' },
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      red: {
        active: 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500 text-red-700 dark:text-red-400',
        inactive: 'hover:bg-red-50/50 dark:hover:bg-red-900/10',
        icon: isActive ? 'text-red-500' : 'text-red-400/70'
      },
      blue: {
        active: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500 text-blue-700 dark:text-blue-400',
        inactive: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
        icon: isActive ? 'text-blue-500' : 'text-blue-400/70'
      },
      green: {
        active: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500 text-green-700 dark:text-green-400',
        inactive: 'hover:bg-green-50/50 dark:hover:bg-green-900/10',
        icon: isActive ? 'text-green-500' : 'text-green-400/70'
      },
      yellow: {
        active: 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400',
        inactive: 'hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10',
        icon: isActive ? 'text-yellow-500' : 'text-yellow-400/70'
      },
      purple: {
        active: 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500 text-purple-700 dark:text-purple-400',
        inactive: 'hover:bg-purple-50/50 dark:hover:bg-purple-900/10',
        icon: isActive ? 'text-purple-500' : 'text-purple-400/70'
      }
    };
    return colors[color];
  };

  return (
    <div className={`${
      isVisible ? 'w-72' : 'w-0'
    } bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-2xl border-r border-white/20 dark:border-gray-700/50 min-h-screen transition-all duration-500 overflow-hidden`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold gradient-text mb-2">Navigation</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        
        {/* Navigation Items */}
        <nav className="space-y-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colorClasses = getColorClasses(tab.color, isActive);
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-button w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive
                    ? `${colorClasses.active} border-l-4 shadow-lg transform scale-[1.02]`
                    : `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 ${colorClasses.inactive} border-l-4 border-transparent hover:border-gray-300 dark:hover:border-gray-600`
                }`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 dark:bg-gray-700/50 shadow-md' 
                        : 'bg-gray-100/50 dark:bg-gray-700/30 group-hover:bg-white/30 dark:group-hover:bg-gray-600/50'
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${colorClasses.icon}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs opacity-70 mt-1">{tab.description}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                    isActive ? 'opacity-100 transform translate-x-1' : 'opacity-0 group-hover:opacity-50'
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="mt-12 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <div className="font-semibold mb-1">System Status</div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-slow"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
