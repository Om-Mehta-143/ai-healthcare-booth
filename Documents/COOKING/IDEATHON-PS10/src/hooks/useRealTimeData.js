import { useState, useEffect } from 'react';

// Hook for real-time connection status
export const useRealTimeData = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dataPoints, setDataPoints] = useState(1247);

  useEffect(() => {
    // Simulate connection status changes
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setDataPoints(prev => prev + Math.floor(Math.random() * 3));
      
      // Simulate occasional disconnections
      if (Math.random() < 0.02) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, lastUpdate, dataPoints };
};

// Hook for vital signs data
export const useVitalSigns = () => {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    spO2: 98,
    temperature: 36.8,
    bloodPressure: '120/80'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        heartRate: Math.floor(Math.random() * 20) + 65,
        spO2: Math.floor(Math.random() * 5) + 95,
        temperature: (Math.random() * 0.6 + 36.5).toFixed(1),
        bloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 15) + 75}`
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { vitals };
};

// Hook for AI processing status
export const useAIProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(78);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate AI processing cycles
      if (Math.random() < 0.3) {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setConfidence(Math.floor(Math.random() * 20) + 70);
        }, 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { isProcessing, confidence, predictions };
};