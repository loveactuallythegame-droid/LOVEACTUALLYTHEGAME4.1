'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showGlimmer?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  variant = 'default',
  size = 'default',
  showGlimmer = true,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    default: 'bg-gradient-main text-white shadow-soft hover:shadow-glow',
    ghost: 'bg-transparent text-accent hover:bg-accent/10',
    outline: 'bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-full font-headers font-semibold',
        'transition-all duration-300 ease-out',
        'hover:scale-105 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {showGlimmer && variant === 'default' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'linear',
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default PrimaryButton;