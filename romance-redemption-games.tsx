'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Heart, Trophy, Clock, Star, Camera, Video, CheckCircle, Play, Award, Target } from 'lucide-react';
import { EnhancedDrMarcieAvatar } from './enhanced-dr-marcie-avatar';
import { DrMarcieVoiceService } from './dr-marcie-voice-service';

interface RomanceGame {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: number;
  estimatedTime: number;
  requiresEvidence: boolean;
  evidenceType?: string[];
  maxPoints: number;
}

interface RomanceSession {
  id: string;
  gameTitle: string;
  category: string;
  subcategory: string;
  gameType: string;
  completed: boolean;
  completedAt?: string;
  creativityScore: number;
  effortScore: number;
  followThroughScore: number;
  overallScore: number;
  partner1Rating: number;
  partner2Rating: number;
  impactRating: number;
  sincerityRating: number;
  photoEvidence: string[];
  videoEvidence: string[];
  writtenEvidence?: string;
  partnerVerification: boolean;
  timeSpent?: number;
  drMarcieFeedback?: string;
  drMarcieGrade?: string;
}

interface RomanceRedemptionGamesProps {
  userId: string;
  coupleId: string;
  userName: string;
  partnerName: string;
}

export function RomanceRedemptionGames({ userId, coupleId, userName, partnerName }: RomanceRedemptionGamesProps) {
  const [availableGames, setAvailableGames] = useState<Record<string, RomanceGame[]>>({});
  const [sessions, setSessions] = useState<RomanceSession[]>([]);
  const [selectedGame, setSelectedGame] = useState<RomanceGame | null>(null);
  const [currentSession, setCurrentSession] = useState<RomanceSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('connectionDepth');
  const [showResults, setShowResults] = useState(false);

  // Game completion state
  const [creativityScore, setCreativityScore] = useState(75);
  const [effortScore, setEffortScore] = useState(75);
  const [followThroughScore, setFollowThroughScore] = useState(75);
  const [partnerRating, setPartnerRating] = useState(7);
  const [impactRating, setImpactRating] = useState(7);
  const [sincerityRating, setSincerityRating] = useState(7);
  const [writtenEvidence, setWrittenEvidence] = useState('');
  const [photoEvidence, setPhotoEvidence] = useState<string[]>([]);
  const [partnerVerified, setPartnerVerified] = useState(false);

  useEffect(() => {
    fetchRomanceGames();
  }, [coupleId]);

  const fetchRomanceGames = async () => {
    try {
      const response = await fetch(`/api/romance-redemption?coupleId=${coupleId}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableGames(data.availableGames);
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch romance games:', error);
    }
  };

  const startGame = async (game: RomanceGame) => {
    try {
      const response = await fetch('/api/romance-redemption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupleId,
          initiatorId: userId,
          gameType: game.id,
          category: game.category,
          subcategory: game.subcategory,
          difficulty: game.difficulty,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentSession(data.session);
        setSelectedGame(game);
        setIsPlaying(true);
        
        // Dr. Marcie introduces the game
        if (data.drMarcieIntro) {
          DrMarcieVoiceService.speak(data.drMarcieIntro, 'romance_redemption');
        }
      }
    } catch (error) {
      console.error('Failed to start romance game:', error);
    }
  };

  const completeGame = async () => {
    if (!currentSession) return;

    try {
      const response = await fetch('/api/romance-redemption', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          completed: true,
          creativityScore,
          effortScore,
          followThroughScore,
          partner1Rating: partnerRating,
          partner2Rating: partnerRating,
          impactRating,
          sincerityRating,
          writtenEvidence: writtenEvidence.trim(),
          photoEvidence,
          partnerVerification: partnerVerified,
          timeSpent: Math.floor(Math.random() * 30) + 15, // Simulated time
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentSession(data.session);
        setShowResults(true);
        
        // Dr. Marcie provides feedback
        if (data.drMarcieFeedback) {
          DrMarcieVoiceService.speak(data.drMarcieFeedback, 'romance_redemption');
        }
        
        await fetchRomanceGames();
      }
    } catch (error) {
      console.error('Failed to complete romance game:', error);
    }
  };

  const resetGame = () => {
    setCurrentSession(null);
    setSelectedGame(null);
    setIsPlaying(false);
    setShowResults(false);
    setCreativityScore(75);
    setEffortScore(75);
    setFollowThroughScore(75);
    setPartnerRating(7);
    setImpactRating(7);
    setSincerityRating(7);
    setWrittenEvidence('');
    setPhotoEvidence([]);
    setPartnerVerified(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      case 4:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      case 4:
        return 'Expert';
      default:
        return 'Unknown';
    }
  };

  const getCompletedCount = (category: string) => {
    return sessions.filter(s => s.category === category && s.completed).length;
  };

  const categoryInfo = {
    connectionDepth: {
      title: 'Connection Depth Games',
      description: 'Deep knowledge and emotional bonding challenges',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    romanceRevival: {
      title: 'Romance Revival Challenges',
      description: 'Reignite the spark with creative romance activities',
      icon: Star,
      color: 'from-purple-500 to-violet-500',
    },
    repairReconnection: {
      title: 'Repair & Reconnection Rituals',
      description: 'Healing and strengthening relationship bonds',
      icon: Target,
      color: 'from-blue-500 to-indigo-500',
    },
  };

  if (isPlaying && selectedGame && currentSession) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        {showResults ? (
          // Results View
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4">
                <EnhancedDrMarcieAvatar expression="pleased" />
                <div>
                  <CardTitle className="text-2xl text-green-800">Game Complete! 🎉</CardTitle>
                  <CardDescription className="text-lg text-green-600">
                    {selectedGame.title} - Results & Feedback
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">{creativityScore}</div>
                    <p className="text-sm text-gray-600">Creativity Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{effortScore}</div>
                    <p className="text-sm text-gray-600">Effort Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{followThroughScore}</div>
                    <p className="text-sm text-gray-600">Follow-Through Score</p>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Score */}
              <Card className="bg-gradient-to-r from-yellow-50 to-amber-50">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-amber-600">
                    {Math.round((creativityScore + effortScore + followThroughScore) / 3)}
                  </div>
                  <p className="text-lg font-medium text-amber-800">Overall Score</p>
                  <div className="text-sm text-amber-600 mt-2">
                    Grade: {currentSession.drMarcieGrade || 'A-'}
                  </div>
                </CardContent>
              </Card>

              {/* Dr. Marcie's Feedback */}
              {currentSession.drMarcieFeedback && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Star className="h-5 w-5" />
                      Dr. Marcie's Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">{currentSession.drMarcieFeedback}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} variant="outline">
                  Play Another Game
                </Button>
                <Button 
                  onClick={resetGame}
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Game Playing View
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <EnhancedDrMarcieAvatar expression="happy" />
                <div>
                  <CardTitle className="text-xl">{selectedGame.title}</CardTitle>
                  <CardDescription>{selectedGame.description}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getDifficultyColor(selectedGame.difficulty)}>
                      {getDifficultyText(selectedGame.difficulty)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedGame.estimatedTime} min
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {selectedGame.maxPoints} pts
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Game Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">How to Play</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">
                    {getGameInstructions(selectedGame.id)}
                  </p>
                </CardContent>
              </Card>

              {/* Game Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Game Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderGameContent(selectedGame)}
                </CardContent>
              </Card>

              {/* Evidence & Scoring */}
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Challenge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Written Evidence */}
                  <div>
                    <Label>Share your experience (required)</Label>
                    <Textarea
                      placeholder="Describe what you did, how it went, and what you learned..."
                      value={writtenEvidence}
                      onChange={(e) => setWrittenEvidence(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Self-Assessment */}
                  <div className="space-y-4">
                    <div>
                      <Label>Creativity Score ({creativityScore}/100)</Label>
                      <Slider
                        value={[creativityScore]}
                        onValueChange={(value) => setCreativityScore(value[0])}
                        max={100}
                        min={0}
                        step={5}
                      />
                    </div>
                    <div>
                      <Label>Effort Score ({effortScore}/100)</Label>
                      <Slider
                        value={[effortScore]}
                        onValueChange={(value) => setEffortScore(value[0])}
                        max={100}
                        min={0}
                        step={5}
                      />
                    </div>
                    <div>
                      <Label>Follow-Through Score ({followThroughScore}/100)</Label>
                      <Slider
                        value={[followThroughScore]}
                        onValueChange={(value) => setFollowThroughScore(value[0])}
                        max={100}
                        min={0}
                        step={5}
                      />
                    </div>
                  </div>

                  {/* Partner Verification */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="partner-verification"
                      checked={partnerVerified}
                      onChange={(e) => setPartnerVerified(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="partner-verification">
                      My partner confirms I completed this challenge
                    </Label>
                  </div>

                  <Button
                    onClick={completeGame}
                    disabled={!writtenEvidence.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    Complete Challenge
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4">
            <EnhancedDrMarcieAvatar expression="happy" />
            <div>
              <CardTitle className="text-2xl text-purple-800">Romance Redemption Games</CardTitle>
              <CardDescription className="text-lg text-purple-600">
                15 Amazing challenges to strengthen your relationship bond
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(categoryInfo).map(([key, info]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <info.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{info.title.split(' ')[0]} {info.title.split(' ')[1]}</span>
              <span className="sm:hidden">{info.title.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1">
                {getCompletedCount(key.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1))}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categoryInfo).map(([categoryKey, info]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
            {/* Category Header */}
            <Card className={`bg-gradient-to-r ${info.color} text-white`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <info.icon className="h-6 w-6" />
                  {info.title}
                </CardTitle>
                <CardDescription className="text-white/90">
                  {info.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGames[categoryKey]?.map((game) => {
                const isCompleted = sessions.some(s => s.gameType === game.id && s.completed);
                const session = sessions.find(s => s.gameType === game.id);

                return (
                  <Card key={game.id} className={`relative ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                    {isCompleted && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getDifficultyColor(game.difficulty)}>
                          {getDifficultyText(game.difficulty)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {game.estimatedTime}m
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {game.maxPoints}
                        </Badge>
                        {game.requiresEvidence && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            Evidence
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {isCompleted && session && (
                          <div className="p-3 bg-green-100 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-800">Completed!</span>
                              <span className="text-sm text-green-600">Score: {session.overallScore}/100</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              Grade: {session.drMarcieGrade || 'A-'}
                            </p>
                          </div>
                        )}
                        
                        <Button
                          onClick={() => startGame(game)}
                          disabled={isCompleted}
                          className="w-full"
                          variant={isCompleted ? "outline" : "default"}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isCompleted ? 'Play Again' : 'Start Challenge'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Romance Redemption Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(categoryInfo).map(([key, info]) => {
              const completed = getCompletedCount(key.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1));
              const total = availableGames[key]?.length || 5;
              const percentage = (completed / total) * 100;

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{info.title}</span>
                    <span className="text-sm text-gray-600">{completed}/{total}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getGameInstructions(gameId: string): string {
  const instructions: Record<string, string> = {
    how_well_know_me: "Test your knowledge of each other with progressively harder questions. Be honest - Dr. Marcie will know if you're guessing!",
    ten_things_adore: "Each partner writes 10 things they adore about the other. Points for creativity and specificity - no generic answers allowed!",
    curiosity_conversations: "Take turns asking deep, meaningful questions. Listen actively and ask follow-up questions. Quality over quantity!",
    memory_lane_championship: "Recall specific details from your relationship milestones. The more specific and heartfelt, the better your score!",
    future_dreams_alignment: "Share your dreams for the future and find common ground. Create a shared vision that excites both of you!",
    surprise_factor: "Plan and execute a surprise for your partner. Document the process and their reaction - creativity counts!",
    love_note_olympics: "Write creative, heartfelt messages to each other. Try different formats - poems, letters, songs, or visual art!",
    date_night_design: "Collaboratively plan a perfect date within your budget constraints. Show your planning process and teamwork!",
    compliment_combat: "Take turns giving genuine, specific compliments. Keep going until someone runs out - no repeats allowed!",
    touch_language_learning: "Explore each other's physical affection preferences through guided exercises. Communication is key!",
    forgiveness_foundations: "Work through past hurts with structured conversations. This requires vulnerability and genuine commitment to healing.",
    trust_rebuilding_blocks: "Make small commitments to each other and follow through. Consistency over time rebuilds trust brick by brick.",
    intimacy_ladders: "Gradually increase emotional and physical closeness through progressive activities. Go at a comfortable pace for both.",
    gratitude_explosions: "Overwhelm each other with appreciation through multiple formats - verbal, written, and actions throughout the day!",
    new_tradition_creation: "Design a unique ritual or tradition that's meaningful to your relationship. Make it something you'll want to repeat!"
  };

  return instructions[gameId] || "Follow Dr. Marcie's guidance to complete this relationship-strengthening challenge!";
}

function renderGameContent(game: RomanceGame) {
  // This would render specific game interfaces based on the game type
  // For now, showing a general activity prompt
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">Your Challenge:</h4>
        <p className="text-purple-700">
          {getGameInstructions(game.id)}
        </p>
      </div>
      
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Tips for Success:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Be genuine and authentic in your responses</li>
          <li>• Take your time - quality over speed</li>
          <li>• Document your experience for evidence</li>
          <li>• Have fun and stay connected to your partner</li>
        </ul>
      </div>
    </div>
  );
}