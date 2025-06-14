
import React from 'react';

interface JupiterBrainsLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
  showText?: boolean;
  className?: string;
}

const JupiterBrainsLogo: React.FC<JupiterBrainsLogoProps> = ({ 
  size = 'md', 
  variant = 'color',
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: { logo: 'w-6 h-6', text: 'text-lg' },
    md: { logo: 'w-8 h-8', text: 'text-xl' },
    lg: { logo: 'w-12 h-12', text: 'text-2xl' },
    xl: { logo: 'w-16 h-16', text: 'text-3xl' }
  };

  const variantClasses = {
    light: { text: 'text-white', accent: 'text-blue-300' },
    dark: { text: 'text-gray-900', accent: 'text-blue-600' },
    color: { text: 'text-gray-900', accent: 'text-blue-600' }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size].logo} relative`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer ring - Jupiter's orbit */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          
          {/* Inner planet - Jupiter */}
          <circle
            cx="32"
            cy="32"
            r="18"
            fill="url(#gradient2)"
            className="drop-shadow-lg"
          />
          
          {/* Jupiter's bands */}
          <ellipse
            cx="32"
            cy="28"
            rx="16"
            ry="2"
            fill="rgba(255,255,255,0.3)"
          />
          <ellipse
            cx="32"
            cy="36"
            rx="14"
            ry="1.5"
            fill="rgba(255,255,255,0.2)"
          />
          
          {/* Great Red Spot */}
          <ellipse
            cx="38"
            cy="32"
            rx="4"
            ry="2.5"
            fill="rgba(239,68,68,0.8)"
          />
          
          {/* Brain neural connections */}
          <path
            d="M20 20 Q32 16 44 20 M20 44 Q32 48 44 44 M20 32 Q26 26 32 32 Q38 38 44 32"
            stroke="url(#gradient3)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          
          {/* Neural nodes */}
          <circle cx="20" cy="20" r="2" fill="#3B82F6" opacity="0.8" />
          <circle cx="44" cy="20" r="2" fill="#3B82F6" opacity="0.8" />
          <circle cx="20" cy="44" r="2" fill="#3B82F6" opacity="0.8" />
          <circle cx="44" cy="44" r="2" fill="#3B82F6" opacity="0.8" />
          <circle cx="20" cy="32" r="1.5" fill="#60A5FA" opacity="0.9" />
          <circle cx="44" cy="32" r="1.5" fill="#60A5FA" opacity="0.9" />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <radialGradient id="gradient2" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#FBB6CE" />
              <stop offset="30%" stopColor="#F87171" />
              <stop offset="70%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </radialGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Company Name */}
      {showText && (
        <div className={`font-bold ${sizeClasses[size].text} ${variantClasses[variant].text}`}>
          Jupiter<span className={variantClasses[variant].accent}>Brains</span>
        </div>
      )}
    </div>
  );
};

export default JupiterBrainsLogo;
