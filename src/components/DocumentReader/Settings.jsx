import React from 'react';
import { useDocumentContext } from '../../context/DocumentContext';

const Settings = () => {
  const { 
    theme,
    darkMode,
    fontSize, 
    isLeftHanded,
    showProgress,
    contentFilters,
    setDarkMode,
    setFontSize,
    setIsLeftHanded,
    setShowProgress,
    setContentFilters,
    toggleFilter
  } = useDocumentContext();

  return (
    <div>
      <h3 className="font-medium mb-4">Display Options</h3>
      
      {/* Theme toggle */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Theme</h4>
        <div className="flex space-x-3">
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${!darkMode ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setDarkMode(false)}
          >
            Light
          </button>
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${darkMode ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setDarkMode(true)}
          >
            Dark
          </button>
        </div>
      </div>
      
      {/* Font size */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Font Size</h4>
        <div className="flex space-x-2">
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${fontSize === 'small' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setFontSize('small')}
          >
            Small
          </button>
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${fontSize === 'medium' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setFontSize('medium')}
          >
            Medium
          </button>
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${fontSize === 'large' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setFontSize('large')}
          >
            Large
          </button>
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${fontSize === 'x-large' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setFontSize('x-large')}
          >
            XL
          </button>
        </div>
      </div>
      
      {/* Handedness preference */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Controls Position</h4>
        <div className="flex space-x-3">
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${!isLeftHanded ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setIsLeftHanded(false)}
          >
            Right-handed
          </button>
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${isLeftHanded ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setIsLeftHanded(true)}
          >
            Left-handed
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Positions the mobile drawer controls for easier one-handed use
        </p>
      </div>
      
      {/* Progress bar toggle */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Progress Bar</h4>
        <div className="flex space-x-3">
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${showProgress ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setShowProgress(true)}
          >
            Show
          </button>
          <button 
            className={`flex-1 py-2 px-3 border rounded-md ${!showProgress ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => setShowProgress(false)}
          >
            Hide
          </button>
        </div>
      </div>
      
      {/* Content filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Content Display</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={contentFilters.images} 
              onChange={() => toggleFilter(contentFilters, setContentFilters, 'images')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Show images</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={contentFilters.tables} 
              onChange={() => toggleFilter(contentFilters, setContentFilters, 'tables')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Show tables</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={contentFilters.code} 
              onChange={() => toggleFilter(contentFilters, setContentFilters, 'code')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Show code blocks</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;