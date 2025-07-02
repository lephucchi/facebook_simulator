import React from 'react';
import { cn } from '../../utils';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  isOnline = false,
  className 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const indicatorSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  };

  return (
    <div className={cn('relative', sizes[size], className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
      />
      {isOnline && (
        <div className={cn(
          'absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full',
          indicatorSizes[size]
        )}></div>
      )}
    </div>
  );
};

export default Avatar;
