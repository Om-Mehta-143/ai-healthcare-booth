import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Brain, 
  Clock, 
  Shield, 
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    systemUptime: 99.97,
    patientsMonitored: 247,
    aiPredictions: 1247,
    criticalAlerts: 3,
    systemLoad: 67,
    memoryUsage: 42,
    networkLatency: 12,
    dataAccuracy: 98.3,
    responseTime: 45,
    errorRate: 0.12
  });

  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        patientsMonitored: prev.patientsMonitored + Math.floor(Math.random() * 3) - 1,
        aiPredictions: prev.aiPredictions + Math.floor(Math.random() * 5),
        criticalAlerts: Math.max(0, Math.min(10, prev.criticalAlerts + Math.floor(Math.random() * 3) - 1)),
        systemLoad: Math.max(20, Math.min(95, prev.systemLoad + Math.floor(Math.random() * 10) - 5)),
        memoryUsage: Math.max(30, Math.min(80, prev.memoryUsage + Math.floor(Math.random() * 6) - 3)),
        networkLatency: Math.max(5, Math.min(25, prev.networkLatency + Math.floor(Math.random() * 4) - 2)),
        dataAccuracy: Math.max(95, Math.min(99.9, prev.dataAccuracy + (Math.random() * 0.4) - 0.2)),
        responseTime: Math.max(30, Math.min(80, prev.responseTime + Math.floor(Math.random() * 8) - 4)),
        errorRate: Math.max(0.01, Math.min(0.5, prev.errorRate + (Math.random() * 0.1) - 0.05))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (value <= thresholds.warning) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getStatusIcon = (value, thresholds) => {
    if (value <= thresholds.good) return <TrendingUp className="w-4 h-4" />;
    if (value <= thresholds.warning) return <Activity className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const metrics = [
    {
      title: "System Uptime",
      value: analytics.systemUptime,
      suffix: "%",
      icon: <Shield className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      thresholds: { good: 99.9, warning: 99.5 },
      description: "System availability over the last 30 days"
    },
    {
      title: "Patients Monitored",
      value: analytics.patientsMonitored,
      icon: <Users className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      thresholds: { good: 200, warning: 150 },
      description: "Active patient monitoring sessions"
    },
    {
      title: "AI Predictions",
      value: analytics.aiPredictions,
      icon: <Brain className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      thresholds: { good: 1000, warning: 800 },
      description: "AI diagnostic predictions made today"
    },
    {
      title: "Critical Alerts",
      value: analytics.criticalAlerts,
      icon: <Zap className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      thresholds: { good: 0, warning: 2 },
      description: "High-priority medical alerts requiring attention"
    }
  ];

  const performanceMetrics = [
    {
      title: "System Load",
      value: analytics.systemLoad,
      suffix: "%",
      thresholds: { good: 60, warning: 80 },
      color: "text-blue-600"
    },
    {
      title: "Memory Usage",
      value: analytics.memoryUsage,
      suffix: "%",
      thresholds: { good: 50, warning: 70 },
      color: "text-green-600"
    },
    {
      title: "Network Latency",
      value: analytics.networkLatency,
      suffix: "ms",
      thresholds: { good: 15, warning: 25 },
      color: "text-orange-600"
    },
    {
      title: "Response Time",
      value: analytics.responseTime,
      suffix: "ms",
      thresholds: { good: 50, warning: 70 },
      color: "text-purple-600"
    }
  ];

  const qualityMetrics = [
    {
      title: "Data Accuracy",
      value: analytics.dataAccuracy,
      suffix: "%",
      thresholds: { good: 98, warning: 95 },
      color: "text-green-600"
    },
    {
      title: "Error Rate",
      value: analytics.errorRate,
      suffix: "%",
      thresholds: { good: 0.2, warning: 0.5 },
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">System performance and operational metrics</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`card p-6 ${metric.bgColor} hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                <div className={metric.color}>{metric.icon}</div>
              </div>
              <div className={`text-right ${getStatusColor(metric.value, metric.thresholds)} px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1`}>
                {getStatusIcon(metric.value, metric.thresholds)}
                <span>
                  {metric.value <= metric.thresholds.good ? 'Optimal' : 
                   metric.value <= metric.thresholds.warning ? 'Warning' : 'Critical'}
                </span>
              </div>
            </div>
            
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter 
                  end={metric.value} 
                  suffix={metric.suffix}
                  className={`text-3xl font-bold ${metric.color}`}
                  duration={2000}
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Performance & Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">System Performance</h3>
          </div>
          
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${metric.color}`}>
                      <AnimatedCounter 
                        end={metric.value} 
                        suffix={metric.suffix}
                        duration={1500}
                      />
                    </span>
                    <div className={`p-1 rounded-full ${getStatusColor(metric.value, metric.thresholds)}`}>
                      {getStatusIcon(metric.value, metric.thresholds)}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      metric.value <= metric.thresholds.good ? 'bg-green-500' :
                      metric.value <= metric.thresholds.warning ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (metric.value / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quality Metrics</h3>
          </div>
          
          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${metric.color}`}>
                      <AnimatedCounter 
                        end={metric.value} 
                        suffix={metric.suffix}
                        decimals={metric.title === "Data Accuracy" ? 1 : 2}
                        duration={1500}
                      />
                    </span>
                    <div className={`p-1 rounded-full ${getStatusColor(metric.value, metric.thresholds)}`}>
                      {getStatusIcon(metric.value, metric.thresholds)}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      metric.value >= metric.thresholds.good ? 'bg-green-500' :
                      metric.value >= metric.thresholds.warning ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${metric.title === "Data Accuracy" ? metric.value : Math.max(0, 100 - (metric.value * 100))}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Real-time Activity</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { time: '2 min ago', event: 'New patient connected - Sarah Johnson', type: 'info' },
            { time: '4 min ago', event: 'AI prediction completed - 98.7% confidence', type: 'success' },
            { time: '7 min ago', event: 'Critical alert resolved - Patient #3 stabilized', type: 'warning' },
            { time: '12 min ago', event: 'System backup completed successfully', type: 'info' },
            { time: '18 min ago', event: 'New AI model deployed - v2.1.4', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{activity.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
