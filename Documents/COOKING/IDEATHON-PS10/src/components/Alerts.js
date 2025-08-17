import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, Clock, User, Activity, Heart } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Patient #2 SpO2 dropped to 88%',
      description: 'Oxygen saturation has fallen below normal range. Immediate attention required.',
      patient: 'Michael Chen',
      timestamp: '2 minutes ago',
      status: 'unread',
      priority: 'high',
      vitals: { spO2: 88, heartRate: 95, temperature: 37.2 }
    },
    {
      id: 2,
      type: 'warning',
      title: 'Patient #4 Elevated Heart Rate',
      description: 'Heart rate increased to 120 BPM. Monitor for additional symptoms.',
      patient: 'Robert Wilson',
      timestamp: '15 minutes ago',
      status: 'read',
      priority: 'medium',
      vitals: { spO2: 96, heartRate: 120, temperature: 36.8 }
    },
    {
      id: 3,
      type: 'info',
      title: 'New patient admitted',
      description: 'Patient #6 - Lisa Brown has been admitted to the system.',
      patient: 'Lisa Brown',
      timestamp: '1 hour ago',
      status: 'read',
      priority: 'low',
      vitals: { spO2: 98, heartRate: 72, temperature: 36.5 }
    },
    {
      id: 4,
      type: 'critical',
      title: 'AI Detection: Possible Pneumonia',
      description: 'AI analysis suggests 78% probability of pneumonia in Patient #1.',
      patient: 'Sarah Johnson',
      timestamp: '3 hours ago',
      status: 'read',
      priority: 'high',
      vitals: { spO2: 94, heartRate: 88, temperature: 37.8 }
    },
    {
      id: 5,
      type: 'warning',
      title: 'Equipment Maintenance Required',
      description: 'Ultrasound machine #3 requires calibration. Schedule maintenance.',
      patient: 'N/A',
      timestamp: '4 hours ago',
      status: 'read',
      priority: 'medium',
      vitals: null
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.7 ? 'critical' : 'warning',
        title: `Patient #${Math.floor(Math.random() * 10) + 1} ${Math.random() > 0.5 ? 'SpO2 alert' : 'Heart rate alert'}`,
        description: 'New vital sign alert detected.',
        patient: 'New Patient',
        timestamp: 'Just now',
        status: 'unread',
        priority: Math.random() > 0.7 ? 'high' : 'medium',
        vitals: { spO2: Math.floor(Math.random() * 10) + 90, heartRate: Math.floor(Math.random() * 30) + 70, temperature: (Math.random() * 1 + 36.5).toFixed(1) }
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }, 10000); // Add new alert every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Bell className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50/80 dark:bg-red-900/20 dark:border-red-700/50';
      case 'medium': return 'border-yellow-500 bg-yellow-50/80 dark:bg-yellow-900/20 dark:border-yellow-700/50';
      case 'low': return 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 dark:border-blue-700/50';
      default: return 'border-gray-300 bg-gray-50/80 dark:bg-gray-700/20 dark:border-gray-600/50';
    }
  };

  const getStatusColor = (status) => {
    return status === 'unread' ? 'bg-blue-500' : 'bg-gray-300';
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.patient.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Alerts & Notifications</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time system alerts and patient notifications</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-50/80 dark:bg-red-900/20 rounded-full border border-red-200/50 dark:border-red-700/50">
          <div className="w-3 h-3 bg-red-500 rounded-full pulse-slow"></div>
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
            {alerts.filter(a => a.status === 'unread').length} New
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Total Alerts</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300 mb-1">{alerts.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Active</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>

        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Critical</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300 mb-1">
                {alerts.filter(a => a.type === 'critical').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">High Priority</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>

        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Warnings</p>
              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300 mb-1">
                {alerts.filter(a => a.type === 'warning').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Medium Priority</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>

        <div className="card vitals-card p-6 glow-green">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Resolved</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300 mb-1">
                {alerts.filter(a => a.status === 'read').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Completed</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg glow-blue'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'critical'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'warning'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'info'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Info
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 w-64"
            />
            <Bell className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`card p-8 border-l-4 ${getPriorityColor(alert.priority)} transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]`}
          >
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                  {getAlertIcon(alert.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{alert.title}</h3>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(alert.status)} ${alert.status === 'unread' ? 'pulse-slow' : ''}`}></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{alert.timestamp}</span>
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg transition-colors duration-300">{alert.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{alert.patient}</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{alert.timestamp}</span>
                  </div>
                </div>

                {/* Vitals Display */}
                {alert.vitals && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">Current Vitals:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">SpO2: {alert.vitals.spO2}%</span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">HR: {alert.vitals.heartRate} BPM</span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Temp: {alert.vitals.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Alerts State */}
      {filteredAlerts.length === 0 && (
        <div className="card p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bell className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-300">No alerts found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors duration-300">No alerts match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default Alerts;
