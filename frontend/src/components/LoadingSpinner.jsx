import React from 'react';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className={`loading loading-spinner loading-${size} text-primary`}></span>
        <p className="mt-4 text-lg text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

