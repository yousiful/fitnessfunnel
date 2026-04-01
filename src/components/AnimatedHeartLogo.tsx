import React from 'react';

interface AnimatedHeartLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const AnimatedHeartLogo: React.FC<AnimatedHeartLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Animated Heart Logo */}
      <div className="relative">
        <svg 
          className={`${sizeClasses[size]} text-red-500 animate-heartbeat`}
          viewBox="0 0 24 24" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Heart shape with gradient */}
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#FF5252" />
              <stop offset="100%" stopColor="#E53E3E" />
            </linearGradient>
          </defs>
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGradient)"
            stroke="#B91C1C"
            strokeWidth="0.5"
          />
        </svg>
        
        {/* Pulse effect overlay */}
        <div className="absolute inset-0 animate-pulse-ring">
          <svg 
            className={`${sizeClasses[size]} text-red-300 opacity-30`}
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="ml-3">
          <h1 className={`${textSizes[size]} font-bold text-gray-900 leading-tight`}>
            The Internet Health Site
          </h1>
        </div>
      )}
    </div>
  );
};

export default AnimatedHeartLogo;