
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-t-4 border-cyan-500 border-t-transparent rounded-full animate-spin neon-border"></div>
      <p className="text-cyan-300 text-lg font-orbitron tracking-wider">Finding the Vibe...</p>
    </div>
  );
};

export default LoadingSpinner;
