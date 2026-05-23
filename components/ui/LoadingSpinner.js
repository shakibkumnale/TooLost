import React from 'react';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]}`}
        style={{
          borderColor: 'var(--color-primary) transparent transparent transparent',
          borderStyle: 'solid',
          borderWidth: size === 'sm' ? '2px' : size === 'lg' ? '4px' : '3px',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
