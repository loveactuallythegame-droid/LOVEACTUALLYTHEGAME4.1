"use client";

import React from 'react';
import FightSolver from './fight-solver';
import { DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface EnhancedSOSFightSolverProps {
  coupleId: string;
  userId: string;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onResolutionComplete?: () => void;
}

const EnhancedSOSFightSolver: React.FC<EnhancedSOSFightSolverProps> = ({
  coupleId,
  userId,
  personalityLevel,
  coupleBackstory,
  onResolutionComplete,
}) => {
  return (
    <div className="min-h-screen p-4">
      {/* Minimal wrapper: reuse existing FightSolver implementation */}
      <FightSolver
        coupleId={coupleId}
        userId={userId}
        personalityLevel={personalityLevel}
        coupleBackstory={coupleBackstory}
        onResolutionComplete={(sessionId?: string) => {
          if (onResolutionComplete) onResolutionComplete();
          // noop: preserve compatibility with callers expecting a string param
          return;
        }}
      />
    </div>
  );
};

export default EnhancedSOSFightSolver;
