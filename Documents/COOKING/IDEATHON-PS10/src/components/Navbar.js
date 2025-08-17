import React from 'react';
import { Activity, Wifi, Battery, Sun, Moon, Zap, Play, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = ({ isDemoMode, onToggleDemoMode }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-white/20 dark:border-gray-700/50 transition-all duration-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg glow-blue float">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                AI Poly-Diagnostic Station
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Advanced Medical Monitoring System
              </p>
            </div>
          </div>
          
          {/* Status and Controls */}
          <div className="flex items-center space-x-6">
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50 transition-all duration-300 hover:scale-105">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse-slow"></div>
                <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">99.9% Uptime</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300 hover:scale-105">
                <Battery className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">247 Patients</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50/80 dark:bg-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 hover:scale-105">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">AI Active</span>
              </div>
            </div>
            
            {/* Demo Mode Toggle */}
            <button
              onClick={onToggleDemoMode}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isDemoMode
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Play className={`w-4 h-4 ${isDemoMode ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">
                {isDemoMode ? 'Demo Active' : 'Demo Mode'}
              </span>
            </button>
            
            {/* Theme Toggle */}
            <div className="theme-toggle-container">
              <Sun className={`w-4 h-4 transition-all duration-300 ${isDarkMode ? 'text-gray-400 scale-90' : 'text-yellow-500 scale-110'}`} />
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <div className={`theme-toggle-slider ${isDarkMode ? 'dark' : ''}`} />
              </button>
              <Moon className={`w-4 h-4 transition-all duration-300 ${isDarkMode ? 'text-blue-400 scale-110' : 'text-gray-400 scale-90'}`} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
