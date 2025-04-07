import React from 'react';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="h-1 bg-gray-200 dark:bg-gray-700">
      <div 
        className="h-1 bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;