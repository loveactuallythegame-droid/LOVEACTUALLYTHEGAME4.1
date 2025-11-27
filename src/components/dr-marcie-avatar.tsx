'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type DrMarcieMood = 'happy' | 'sassy' | 'serious' | 'concerned' | 'excited';

interface DrMarcieAvatarProps {
  mood?: DrMarcieMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showPulse?: boolean;
  showSpeechBubble?: boolean;
  speechText?: string;
}

const moodColors = {
  happy: 'from-pink-400 to-purple-400',
  sassy: 'from-purple-500 to-pink-500',
  serious: 'from-purple-600 to-purple-700',
  concerned: 'from-pink-500 to-red-500',
  excited: 'from-pink-400 to-yellow-400',
};

const moodAnimations = {
  happy: { scale: [1, 1.05, 1], rotate: [-2, 2, -2] },
  sassy: { rotate: [0, -5, 5, 0] },
  serious: { scale: 1 },
  concerned: { y: [0, -2, 0] },
  excited: { scale: [1, 1.1, 1], rotate: [-5, 5, -5] },
};

export const DrMarcieAvatar: React.FC<DrMarcieAvatarProps> = ({
  mood = 'happy',
  size = 'md',
  className,
  showPulse = true,
  showSpeechBubble = false,
  speechText = "Let's work on this together, lovebirds!",
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const avatarVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      ...moodAnimations[mood]
    },
    hover: { scale: 1.05 },
  };

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      {/* Avatar Container */}
      <motion.div
        className={cn(
          'relative rounded-full overflow-hidden',
          'bg-gradient-to-br from-pink-400 to-purple-600',
          'border-4 border-white shadow-lg',
          sizeClasses[size],
          showPulse && 'pulse-gentle'
        )}
        variants={avatarVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Inner Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        
        {/* Placeholder for Dr. Marcie's Image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className={cn(
            'text-white text-2xl font-bold',
            mood === 'sassy' && 'rotate-12',
            mood === 'serious' && 'text-lg'
          )}>
            Dr. M
          </div>
        </div>

        {/* Mood Indicator Ring */}
        <div className={cn(
          'absolute -inset-1 rounded-full',
          'bg-gradient-to-r',
          moodColors[mood],
          'opacity-60 blur-sm',
          'animate-pulse'
        )} />
      </motion.div>

      {/* Speech Bubble */}
      {showSpeechBubble && speechText && (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="speech-bubble font-marcie text-sm text-primary max-w-xs">
            {speechText}
          </div>
        </motion.div>
      )}

      {/* Mood Label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className={cn(
          'text-xs font-accents px-2 py-1 rounded-full',
          'bg-gradient-to-r',
          moodColors[mood],
          'text-white'
        )}>
          {mood}
        </span>
      </motion.div>
    </div>
  );
};

export default DrMarcieAvatar;