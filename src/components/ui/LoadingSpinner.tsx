import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'white' | 'gray';
}

export default function LoadingSpinner({ size = 'medium', color = 'blue' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} border-current`} />
  );
}