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

const GameInterface: React.FC<GameInterfaceProps> = ({
  gameType,
  gameTitle,
  description,
  estimatedTime,
  maxPoints,
  personalityLevel,
  coupleBackstory,
  onGameComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'playing' | 'scoring' | 'results'>('intro');
  const [currentChallenge, setCurrentChallenge] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Sample challenges based on game type
  const getChallenges = (): Challenge[] => {
    switch (gameType) {
      case 'emotional_connection':
        return [
          {
            id: '1',
            title: 'Vulnerability Share',
            description: 'Share something you\'ve never told your partner',
            prompt: 'Take turns sharing a meaningful memory from your childhood that shaped who you are today.',
            timeLimit: 300, // 5 minutes
            pointValue: 30
          },
          {
            id: '2',
            title: 'Gratitude Focus',
            description: 'Express specific appreciation',
            prompt: 'Each person name 3 specific things your partner did this week that made you feel loved.',
            timeLimit: 240,
            pointValue: 25
          },
          {
            id: '3',
            title: 'Future Dreams',
            description: 'Share your hopes together',
            prompt: 'Describe your dream date night together 5 years from now. Be as detailed as possible.',
            timeLimit: 300,
            pointValue: 45
          }
        ];
      
      case 'psych_based':
        return [
          {
            id: '1',
            title: 'Love Language Quiz',
            description: 'Guess your partner\'s top love language',
            prompt: 'Without discussing, write down what you think your partner\'s primary love language is and why.',
            timeLimit: 180,
            pointValue: 35
          },
          {
            id: '2',
            title: 'Conflict Style Analysis',
            description: 'Identify your argument patterns',
            prompt: 'Describe how you each typically handle disagreements. Are you avoiders, confronters, or something else?',
            timeLimit: 240,
            pointValue: 30
          },
          {
            id: '3',
            title: 'Attachment Dance',
            description: 'Understand your connection patterns',
            prompt: 'Share a time when you felt most secure in the relationship and what your partner did to create that feeling.',
            timeLimit: 300,
            pointValue: 35
          }
        ];
      
      case 'creative_chaos':
        return [
          {
            id: '1',
            title: 'Relationship Movie Trailer',
            description: 'Create your love story preview',
            prompt: 'In 2 minutes, act out a movie trailer for your relationship story. Include dramatic narration!',
            timeLimit: 180,
            pointValue: 40
          },
          {
            id: '2',
            title: 'Partner Portrait',
            description: 'Draw each other (badly)',
            prompt: 'Draw a portrait of your partner in 60 seconds. Artistic skill is NOT the point - enthusiasm is!',
            timeLimit: 120,
            pointValue: 25
          },
          {
            id: '3',
            title: 'Silly Love Song',
            description: 'Compose your anthem',
            prompt: 'Create a 30-second love song about your relationship using only humming, beatboxing, and made-up words.',
            timeLimit: 150,
            pointValue: 35
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
    } else if (currentPhase === 'playing' && timeRemaining === 0) {
      nextChallenge();
    }
  }, [currentPhase, timeRemaining]);

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
      feedback: `Great job completing ${gameTitle}! You've strengthened your connection through ${challenges.length} challenges.`
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameTypeIcon = () => {
    switch (gameType) {
      case 'emotional_connection':
        return <Heart className="w-5 h-5" />;
      case 'psych_based':
        return <Zap className="w-5 h-5" />;
      case 'creative_chaos':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const currentChallengeData = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-500 text-white rounded-full">
                  {getGameTypeIcon()}
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">{gameTitle}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">{description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-pink-600 dark:text-pink-400">
                {estimatedTime} min
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Game Progress */}
        {gameStarted && (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Challenge {currentChallenge + 1} of {challenges.length}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Dr. Marcie Introduction */}
        {currentPhase === 'intro' && (
          <EnhancedDrMarcieAvatar
            personalityLevel={personalityLevel}
            coupleBackstory={coupleBackstory}
            className="animate__animated animate__fadeInUp"
            hostingContext="game_intro"
            expression="happy"
            contextData={{
              gameType,
              gameTitle,
              challengeDescription: description
            }}
            autoGreeting={true}
            initialMessage={`Welcome to ${gameTitle}! I'm excited to guide you through ${challenges.length} relationship-strengthening challenges. Let's see what you two lovebirds are made of!`}
          />
        )}

        {/* Main Game Content */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm min-h-[400px]">
          <CardContent className="p-6">
            
            {/* Introduction Phase */}
            {currentPhase === 'intro' && (
              <div className="text-center space-y-6 animate__animated animate__fadeIn">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ready to Play?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  You're about to embark on {challenges.length} relationship-strengthening challenges. 
                  Dr. Marcie will guide you through each one and provide her signature feedback.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                  <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <Trophy className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Max Points</h3>
                    <p className="text-pink-600 dark:text-pink-400">{maxPoints}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Timer className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Duration</h3>
                    <p className="text-purple-600 dark:text-purple-400">{estimatedTime} minutes</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Challenges</h3>
                    <p className="text-blue-600 dark:text-blue-400">{challenges.length}</p>
                  </div>
                </div>
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
                >
                  Start the Game! 💕
                </Button>
              </div>
            )}

            {/* Playing Phase */}
            {currentPhase === 'playing' && currentChallengeData && (
              <div className="space-y-6 animate__animated animate__fadeIn">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {currentChallengeData.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentChallengeData.description}
                  </p>
                  <Badge className="bg-pink-500 text-white">
                    {currentChallengeData.pointValue} points available
                  </Badge>
                </div>

                <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">Challenge:</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {currentChallengeData.prompt}
                    </p>
                  </CardContent>
                </Card>

                <div className="text-center space-x-4">
                  <Button 
                    onClick={() => scoreChallenge(currentChallengeData.pointValue, currentChallengeData.pointValue)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Challenge Complete! ✨
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => scoreChallenge(0, 0)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Skip This One
                  </Button>
                </div>
              </div>
            )}

            {/* Scoring Phase */}
            {currentPhase === 'scoring' && (
              <div className="text-center space-y-6 animate__animated animate__fadeIn">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Time for Dr. Marcie's Feedback!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Partner 1</h3>
                      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{player1Score}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">points earned</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Partner 2</h3>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{player2Score}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">points earned</p>
                    </CardContent>
                  </Card>
                </div>
                <Button 
                  onClick={completeGame}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  Get Dr. Marcie's Verdict! 🎭
                </Button>
              </div>
            )}

            {/* Results Phase */}
            {currentPhase === 'results' && (
              <div className="text-center space-y-6 animate__animated animate__fadeIn">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Game Complete! 🎉</h2>
                <EnhancedDrMarcieAvatar
                  personalityLevel={personalityLevel}
                  coupleBackstory={coupleBackstory}
                  hostingContext="feedback"
                  expression="pleased"
                  contextData={{
                    gameType,
                    gameTitle,
                    player1Score,
                    player2Score,
                    challengeDescription: description
                  }}
                  autoGreeting={true}
                  initialMessage={`Well, well! Look what we have here - you two just completed ${gameTitle}! Time for my expert analysis of your performance.`}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
                    <CardContent className="p-6 text-center">
                      <Trophy className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                      <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Final Scores</h3>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Partner 1:</span>
                          <span className="font-bold text-pink-600 dark:text-pink-400">{player1Score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Partner 2:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">{player2Score}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span className="text-gray-900 dark:text-gray-100">Total:</span>
                          <span className="text-pink-600 dark:text-pink-400">{player1Score + player2Score}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardContent className="p-6 text-center">
                      <Heart className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Relationship XP</h3>
                      <div className="mt-4">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          +{Math.floor((player1Score + player2Score) / 10)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">vulnerability points earned</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>