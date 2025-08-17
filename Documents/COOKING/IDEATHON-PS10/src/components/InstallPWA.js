import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (!checkIfInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
        setShowInstallPrompt(false);
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Install App</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get quick access to AI Diagnostic</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Fast access from home screen</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Native app experience</span>
          </div>
        </div>

        {/* Install Button */}
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
            isInstalling
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isInstalling ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Installing...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Install AI Diagnostic</span>
            </>
          )}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          Tap "Install" to add to your home screen
        </p>
      </div>
    </div>
  );
};

export default InstallPWA;
