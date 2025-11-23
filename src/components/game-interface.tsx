'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Heart, Zap, Trophy, Users } from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface GameInterfaceProps {
  gameType: 'emotional_connection' | 'psych_based' | 'creative_chaos';
  gameTitle: string;
  description: string;
  estimatedTime: number;
  maxPoints: number;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onGameComplete: (scores: { player1Score: number; player2Score: number; feedback: string }) => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  prompt: string;
  timeLimit?: number;
  pointValue: number;
}

export default function GameInterface({
  gameType,
  gameTitle,
  description,
  estimatedTime,
  maxPoints,
  personalityLevel,
  coupleBackstory,
  onGameComplete
}: GameInterfaceProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'playing' | 'scoring' | 'results'>('intro');
  const [currentChallenge, setCurrentChallenge] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const getChallenges = (): Challenge[] => {
    switch (gameType) {
      case 'emotional_connection':
        return [
          {
            id: '1',
            title: 'Vulnerability Share',
            description: 'Share something you\'ve never told your partner',
            prompt: 'Take turns sharing a meaningful memory from your childhood that shaped who you are today.',
            timeLimit: 300,
            pointValue: 30
          },
          {
            id: '2',
            title: 'Gratitude Focus',
            description: 'Express specific appreciation',
            prompt: 'Each person name 3 specific things your partner did this week that made you feel loved.',
            timeLimit: 240,
            pointValue: 25
          }
        ];
      default:
        return [];
    }
  };

  const [challenges] = useState<Challenge[]>(getChallenges());

  useEffect(() => {
    if (currentPhase === 'playing' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentPhase === 'playing' && timeRemaining === 0 && gameStarted) {
      nextChallenge();
    }
  }, [currentPhase, timeRemaining, gameStarted]);

  const startGame = (): void => {
    setCurrentPhase('playing');
    setGameStarted(true);
    setTimeRemaining(challenges[0]?.timeLimit || 300);
  };

  const nextChallenge = (): void => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeRemaining(challenges[currentChallenge + 1]?.timeLimit || 300);
    } else {
      setCurrentPhase('scoring');
    }
  };

  const scoreChallenge = (p1Score: number, p2Score: number): void => {
    setPlayer1Score(prev => prev + p1Score);
    setPlayer2Score(prev => prev + p2Score);
    nextChallenge();
  };

  const completeGame = (): void => {
    setCurrentPhase('results');
    onGameComplete({
      player1Score,
      player2Score,
      feedback: `Great job completing ${gameTitle}!`
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentChallengeData = challenges[currentChallenge];
  const progress = challenges.length > 0 ? ((currentChallenge + 1) / challenges.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl">{gameTitle}</CardTitle>
          </CardHeader>
        </Card>

        {gameStarted && (
          <Card className="bg-white/90">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Challenge {currentChallenge + 1} of {challenges.length}
                </span>
                <div className="flex items-center space-x-2 text-sm">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/90 min-h-[400px]">
          <CardContent className="p-6">
            {currentPhase === 'intro' && (
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to Play?</h2>
                <p className="text-lg text-gray-600">
                  Complete {challenges.length} relationship challenges with Dr. Marcie's guidance.
                </p>
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Start the Game! 💕
                </Button>
              </div>
            )}

            {currentPhase === 'playing' && currentChallengeData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{currentChallengeData.title}</h2>
                  <p className="text-gray-600 mb-4">{currentChallengeData.description}</p>
                </div>

                <Card className="bg-gradient-to-br from-pink-50 to-purple-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">Challenge:</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {currentChallengeData.prompt}
                    </p>
                  </CardContent>
                </Card>

                <div className="text-center space-x-4">
                  <Button 
                    onClick={() => scoreChallenge(currentChallengeData.pointValue, currentChallengeData.pointValue)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Challenge Complete! ✨
                  </Button>
                </div>
              </div>
            )}

            {currentPhase === 'scoring' && (
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Time for Dr. Marcie's Feedback!</h2>
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">Partner 1</h3>
                      <div className="text-3xl font-bold text-pink-600">{player1Score}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg mb-2">Partner 2</h3>
                      <div className="text-3xl font-bold text-purple-600">{player2Score}</div>
                    </CardContent>
                  </Card>
                </div>
                <Button 
                  onClick={completeGame}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Get Dr. Marcie's Verdict! 🎭
                </Button>
              </div>
            )}

            {currentPhase === 'results' && (
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Game Complete! 🎉</h2>
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Trophy className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                      <h3 className="font-bold text-xl">Final Score</h3>
                      <div className="text-3xl font-bold text-pink-600 mt-2">
                        {player1Score + player2Score}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Heart className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-bold text-xl">Relationship XP</h3>
                      <div className="text-3xl font-bold text-purple-600 mt-2">
                        +{Math.floor((player1Score + player2Score) / 10)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
