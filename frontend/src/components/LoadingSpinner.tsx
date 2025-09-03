import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-semibold">Chargement...</p>
        <p className="text-white/80 text-sm mt-2">Veuillez patienter</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
