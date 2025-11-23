'use client';

import GameInterface from '@/components/game-interface';
import type { DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface EnhancedGameInterfaceProps {
  gameType: 'emotional_connection' | 'psych_based' | 'creative_chaos';
  gameTitle: string;
  description: string;
  estimatedTime: number;
  maxPoints: number;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onGameComplete: (scores: { player1Score: number; player2Score: number; feedback: string }) => void;
  enhancedMetrics?: boolean;
}

export function EnhancedGameInterface(props: EnhancedGameInterfaceProps) {
  return <GameInterface {...props} />;
}
