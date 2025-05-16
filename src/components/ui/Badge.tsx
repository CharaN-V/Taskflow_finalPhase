import React from 'react';

type BadgeProps = {
  text: string;
  color: string;
  onClick?: () => void;
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ text, color, onClick, className = '' }) => {
  const getContrastTextColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance - the higher, the brighter
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If bright, use dark text, otherwise use light text
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastTextColor(color);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: color, color: textColor }}
      onClick={onClick}
    >
      {text}
    </span>
  );
};