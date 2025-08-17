import React, { useState } from 'react';
import { Camera, Download, Share2, Eye } from 'lucide-react';

const Imaging = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const images = [
    {
      id: 1,
      name: 'Chest X-Ray',
      type: 'X-Ray',
      patient: 'Sarah Johnson',
      date: '2024-01-15',
      aiAnalysis: 'Normal',
      confidence: 94,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgyODBWMjAwSDIwVjIwWiIgZmlsbD0iI2U1ZTdlYiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0xMDAgODBMMjAwIDEyMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgyODBWMjAwSDIwVjIwWiIgZmlsbD0iI2U1ZTdlYiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0xMDAgODBMMjAwIDEyMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
    },
    {
      id: 2,
      name: 'Abdominal Ultrasound',
      type: 'Ultrasound',
      patient: 'Michael Chen',
      date: '2024-01-15',
      aiAnalysis: 'Abnormal',
      confidence: 87,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgyODBWMjAwSDIwVjIwWiIgZmlsbD0iI2U1ZTdlYiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjE1IiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0xMjAgNjBMMTgwIDE0MCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
    },
    {
      id: 3,
      name: 'Brain MRI',
      type: 'MRI',
      patient: 'Emma Davis',
      date: '2024-01-14',
      aiAnalysis: 'Normal',
      confidence: 96,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgyODBWMjAwSDIwVjIwWiIgZmlsbD0iI2U1ZTdlYiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0xMDAgNzBMMjAwIDEzMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
    },
    {
      id: 4,
      name: 'Cardiac CT',
      type: 'CT',
      patient: 'Robert Wilson',
      date: '2024-01-13',
      aiAnalysis: 'Abnormal',
      confidence: 79,
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgyODBWMjAwSDIwVjIwWiIgZmlsbD0iI2U1ZTdlYiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjQ1IiBmaWxsPSIjZmZmIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjI1IiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0xMTAgODBMMTkwIDEyMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
    }
  ];

  const getAnalysisColor = (analysis) => {
    return analysis === 'Normal' 
      ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50 dark:border-green-700/50' 
      : 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200/50 dark:border-red-700/50';
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleDownloadImage = (image) => {
    // Create a canvas to generate a downloadable image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    // Set background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add medical image placeholder
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(image.name, canvas.width / 2, 80);
    
    ctx.font = '16px Arial';
    ctx.fillText(image.type, canvas.width / 2, 110);
    
    ctx.font = '14px Arial';
    ctx.fillText(`Patient: ${image.patient}`, canvas.width / 2, 140);
    ctx.fillText(`Date: ${image.date}`, canvas.width / 2, 160);
    ctx.fillText(`AI Analysis: ${image.aiAnalysis}`, canvas.width / 2, 180);
    ctx.fillText(`Confidence: ${image.confidence}%`, canvas.width / 2, 200);

    // Create download link
    const link = document.createElement('a');
    link.download = `${image.name}_${image.patient}_${image.date}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareImage = (image) => {
    if (navigator.share) {
      navigator.share({
        title: image.name,
        text: `Medical image: ${image.name} - ${image.patient} - ${image.date}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const text = `${image.name} - ${image.patient} - ${image.date} - AI Analysis: ${image.aiAnalysis} (${image.confidence}%)`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Image information copied to clipboard!');
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Medical Imaging</h2>
          <p className="text-gray-600 dark:text-gray-400">AI-powered diagnostic imaging analysis</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50/80 dark:bg-blue-900/20 rounded-full border border-blue-200/50 dark:border-blue-700/50">
          <div className="w-3 h-3 bg-blue-500 rounded-full pulse-slow"></div>
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{images.length} Images</span>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Total Images</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300 mb-1">{images.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Available</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="card vitals-card p-6 glow-green">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Normal Results</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300 mb-1">
                {images.filter(img => img.aiAnalysis === 'Normal').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Healthy</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="card vitals-card p-6 glow-blue">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">Abnormal Results</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300 mb-1">
                {images.filter(img => img.aiAnalysis === 'Abnormal').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Requires Attention</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
        
        <div className="card vitals-card p-6 glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-1">AI Accuracy</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300 mb-1">92%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Precision</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="card overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors duration-300">{image.type}</span>
                <span className={`px-3 py-2 rounded-full text-xs font-semibold ${getAnalysisColor(image.aiAnalysis)} transition-colors duration-300`}>
                  AI: {image.aiAnalysis}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">{image.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Patient: {image.patient}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Date: {image.date}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Confidence:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{image.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors duration-300">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      image.aiAnalysis === 'Normal' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${image.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Placeholder Image */}
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">{image.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">{image.type}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewImage(image)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => handleDownloadImage(image)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button 
                  onClick={() => handleShareImage(image)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis Summary */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-1">AI Analysis Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive diagnostic insights</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Recent Findings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-4 bg-green-50/80 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 transition-colors duration-300">
                <div className="w-4 h-4 bg-green-500 rounded-full pulse-slow"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Chest X-Ray: Normal lung fields</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-red-50/80 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50 transition-colors duration-300">
                <div className="w-4 h-4 bg-red-500 rounded-full pulse-slow"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Abdominal US: Possible mass detected</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50/80 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 transition-colors duration-300">
                <div className="w-4 h-4 bg-green-500 rounded-full pulse-slow"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Brain MRI: Normal brain structure</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">AI Performance</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Sensitivity:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">94%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Specificity:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">89%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Processing Time:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">2.3s avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {showModal && selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transition-colors duration-300">
            <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold gradient-text">{selectedImage.name}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-3xl font-bold transition-colors duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Display */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-12 flex items-center justify-center transition-colors duration-300">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Camera className="w-16 h-16 text-blue-500" />
                      </div>
                      <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">{selectedImage.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{selectedImage.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDownloadImage(selectedImage)}
                      className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleShareImage(selectedImage)}
                      className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
                
                {/* Image Details */}
                <div className="space-y-6">
                  <div className="card p-6">
                    <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Image Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Type:</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{selectedImage.type}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Patient:</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{selectedImage.patient}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                        <span className="font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Date:</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{selectedImage.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">AI Analysis</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Result:</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getAnalysisColor(selectedImage.aiAnalysis)} transition-colors duration-300`}>
                          {selectedImage.aiAnalysis}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Confidence:</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{selectedImage.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors duration-300">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              selectedImage.aiAnalysis === 'Normal' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                            style={{ width: `${selectedImage.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
     </div>
   );
 };

export default Imaging;
