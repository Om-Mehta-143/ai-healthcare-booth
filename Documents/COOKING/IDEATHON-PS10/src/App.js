import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VitalsMonitor from './components/VitalsMonitor';
import Imaging from './components/Imaging';
import OutbreakMap from './components/OutbreakMap';
import Alerts from './components/Alerts';
import DemoMode from './components/DemoMode';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import InstallPWA from './components/InstallPWA';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('vitals');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { toggleTheme } = useTheme();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only trigger if no input is focused
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
      
      switch (event.key.toLowerCase()) {
        case 't':
          toggleTheme();
          break;
        case 'd':
          setIsDemoMode(!isDemoMode);
          break;
        case '1':
          setActiveTab('vitals');
          break;
        case '2':
          setActiveTab('imaging');
          break;
        case '3':
          setActiveTab('outbreak');
          break;
        case '4':
          setActiveTab('alerts');
          break;
        case '5':
          setActiveTab('analytics');
          break;
        case 'b':
          if (event.ctrlKey) {
            event.preventDefault();
            setIsSidebarVisible(!isSidebarVisible);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDemoMode, isSidebarVisible, toggleTheme]);

  const renderContent = () => {
    switch (activeTab) {
      case 'vitals':
        return <VitalsMonitor isDemoMode={isDemoMode} />;
      case 'imaging':
        return <Imaging isDemoMode={isDemoMode} />;
      case 'outbreak':
        return <OutbreakMap isDemoMode={isDemoMode} />;
      case 'alerts':
        return <Alerts isDemoMode={isDemoMode} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <VitalsMonitor isDemoMode={isDemoMode} />;
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500">
      <Navbar isDemoMode={isDemoMode} onToggleDemoMode={() => setIsDemoMode(!isDemoMode)} />
      <div className="flex">
        {/* Sidebar with toggle button */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isVisible={isSidebarVisible} />
        
        {/* Main content with sidebar toggle button */}
        <main className="flex-1 p-8 max-w-full overflow-x-hidden relative">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className={`fixed top-24 z-40 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 ${
              isSidebarVisible ? 'left-72' : 'left-4'
            }`}
            title="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Demo Mode */}
      <DemoMode 
        isActive={isDemoMode}
        onToggle={() => setIsDemoMode(!isDemoMode)}
        onScenarioChange={(scenario) => console.log('Scenario changed:', scenario)}
        currentScenario={null}
      />
      
      {/* PWA Install Prompt */}
      <InstallPWA />
      
      {/* Keyboard Shortcuts Indicator */}
      <div className="fixed bottom-4 right-4 bg-black/80 dark:bg-white/80 text-white dark:text-black px-3 py-2 rounded-lg text-xs font-mono opacity-50 hover:opacity-100 transition-opacity duration-300">
        Press T for theme • D for demo • 1-5 for tabs • Ctrl+B to toggle sidebar
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
