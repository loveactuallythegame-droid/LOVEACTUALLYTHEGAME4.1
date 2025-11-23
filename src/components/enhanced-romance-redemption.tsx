'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, Trophy, Clock, Star, Camera, Video, CheckCircle, Play, Award, Target, 
  Timer, Upload, Zap, Medal, Users, Eye, ThumbsUp, Sparkles, Crown, Gift,
  MessageSquare, Calendar, AlarmClock, Flame, TrendingUp, Smile
} from 'lucide-react';
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
  timeBonus: boolean;
  partnerRatingRequired: boolean;
  realWorldVerification: boolean;
  creativityMultiplier: number;
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
  timeBonusEarned?: boolean;
  realWorldCompleted?: boolean;
  drMarcieFeedback?: string;
  drMarcieGrade?: string;
  pointsAwarded?: number;
  deadline?: string;
  startedAt?: string;
}

interface CompetitionStats {
  weeklyRank: number;
  monthlyRank: number;
  totalGamesCompleted: number;
  perfectScores: number;
  averageScore: number;
  favoriteCategory: string;
  longestStreak: number;
  currentStreak: number;
}

interface EnhancedRomanceRedemptionProps {
  userId: string;
  coupleId: string;
  userName: string;
  partnerName: string;
}

export function EnhancedRomanceRedemption({ userId, coupleId, userName, partnerName }: EnhancedRomanceRedemptionProps) {
  const [availableGames, setAvailableGames] = useState<Record<string, RomanceGame[]>>({});
  const [sessions, setSessions] = useState<RomanceSession[]>([]);
  const [competitionStats, setCompetitionStats] = useState<CompetitionStats | null>(null);
  const [selectedGame, setSelectedGame] = useState<RomanceGame | null>(null);
  const [currentSession, setCurrentSession] = useState<RomanceSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('connectionDepth');
  const [showResults, setShowResults] = useState(false);
  const [gameTimer, setGameTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  // Enhanced scoring state
  const [creativityScore, setCreativityScore] = useState(75);
  const [effortScore, setEffortScore] = useState(75);
  const [followThroughScore, setFollowThroughScore] = useState(75);
  const [partnerRating, setPartnerRating] = useState(7);
  const [impactRating, setImpactRating] = useState(7);
  const [sincerityRating, setSincerityRating] = useState(7);
  const [writtenEvidence, setWrittenEvidence] = useState('');
  const [photoEvidence, setPhotoEvidence] = useState<File[]>([]);
  const [videoEvidence, setVideoEvidence] = useState<File[]>([]);
  const [partnerVerified, setPartnerVerified] = useState(false);
  const [realWorldCompleted, setRealWorldCompleted] = useState(false);

  // Evidence upload states
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [evidencePreview, setEvidencePreview] = useState<string[]>([]);

  useEffect(() => {
    fetchRomanceGames();
    fetchCompetitionStats();
  }, [coupleId]);

  useEffect(() => {
    if (timerActive && currentSession) {
      timerRef.current = setInterval(() => {
        setGameTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, currentSession]);

  const fetchRomanceGames = async () => {
    try {
      const response = await fetch(`/api/romance-redemption?coupleId=${coupleId}&enhanced=true`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableGames(data.availableGames);
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch romance games:', error);
    }
  };

  const fetchCompetitionStats = async () => {
    try {
      const response = await fetch(`/api/romance-redemption/stats?userId=${userId}&coupleId=${coupleId}`);
      const data = await response.json();
      
      if (data.success) {
        setCompetitionStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch competition stats:', error);
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
          enhanced: true,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentSession(data.session);
        setSelectedGame(game);
        setIsPlaying(true);
        setGameTimer(0);
        setTimerActive(true);
        
        // Dr. Marcie introduces the game
        if (data.drMarcieIntro) {
          DrMarcieVoiceService.speak(data.drMarcieIntro, 'romance_redemption');
        }
      }
    } catch (error) {
      console.error('Failed to start romance game:', error);
    }
  };

  const uploadEvidence = async (files: File[], type: 'photo' | 'video') => {
    setUploadingMedia(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('sessionId', currentSession?.id || '');

        const response = await fetch('/api/romance-redemption/upload-evidence', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        return data.success ? data.url : null;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);

      if (type === 'photo') {
        setEvidencePreview(prev => [...prev, ...validUrls]);
      }

      return validUrls;
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      return [];
    } finally {
      setUploadingMedia(false);
    }
  };

  const completeGame = async () => {
    if (!currentSession || !selectedGame) return;

    setTimerActive(false);
    const timeSpent = gameTimer;
    const timeBonusEarned = selectedGame.timeBonus && timeSpent <= (selectedGame.estimatedTime * 60);

    try {
      // Upload evidence files first
      let photoUrls: string[] = [];
      let videoUrls: string[] = [];

      if (photoEvidence.length > 0) {
        photoUrls = await uploadEvidence(photoEvidence, 'photo');
      }

      if (videoEvidence.length > 0) {
        videoUrls = await uploadEvidence(videoEvidence, 'video');
      }

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
          photoEvidence: photoUrls,
          videoEvidence: videoUrls,
          partnerVerification: partnerVerified,
          realWorldCompleted,
          timeSpent,
          timeBonusEarned,
          enhanced: true,
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
        await fetchCompetitionStats();
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
    setTimerActive(false);
    setGameTimer(0);
    setCreativityScore(75);
    setEffortScore(75);
    setFollowThroughScore(75);
    setPartnerRating(7);
    setImpactRating(7);
    setSincerityRating(7);
    setWrittenEvidence('');
    setPhotoEvidence([]);
    setVideoEvidence([]);
    setEvidencePreview([]);
    setPartnerVerified(false);
    setRealWorldCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800 border-green-300';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-300';
      case 4: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
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
      gradient: 'bg-gradient-to-r from-pink-50 to-rose-50',
    },
    romanceRevival: {
      title: 'Romance Revival Challenges',
      description: 'Reignite the spark with creative romance activities',
      icon: Sparkles,
      color: 'from-purple-500 to-violet-500',
      gradient: 'bg-gradient-to-r from-purple-50 to-violet-50',
    },
    repairReconnection: {
      title: 'Repair & Reconnection Rituals',
      description: 'Healing and strengthening relationship bonds',
      icon: Target,
      color: 'from-blue-500 to-indigo-500',
      gradient: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    },
  };

  if (isPlaying && selectedGame && currentSession) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {showResults ? (
          // Enhanced Results View
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <EnhancedDrMarcieAvatar expression="pleased" />
                <div>
                  <CardTitle className="text-xl md:text-2xl text-green-800 flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Game Complete! 🎉
                  </CardTitle>
                  <CardDescription className="text-lg text-green-600">
                    {selectedGame.title} - Results & Rewards
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhanced Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/70">
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      {creativityScore}
                    </div>
                    <p className="text-sm text-gray-600">Creativity</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/70">
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                      <Zap className="h-5 w-5" />
                      {effortScore}
                    </div>
                    <p className="text-sm text-gray-600">Effort</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/70">
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {followThroughScore}
                    </div>
                    <p className="text-sm text-gray-600">Follow-Through</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/70">
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-2">
                      <Timer className="h-5 w-5" />
                      {formatTime(gameTimer)}
                    </div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Score & Bonuses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-yellow-50 to-amber-50">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-amber-600 flex items-center justify-center gap-2">
                      <Crown className="h-8 w-8" />
                      {Math.round((creativityScore + effortScore + followThroughScore) / 3)}
                    </div>
                    <p className="text-lg font-medium text-amber-800">Overall Score</p>
                    <div className="text-sm text-amber-600 mt-2">
                      Grade: {currentSession.drMarcieGrade || 'A-'}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-emerald-600 flex items-center justify-center gap-2">
                      <Medal className="h-8 w-8" />
                      {currentSession.pointsAwarded || 0}
                    </div>
                    <p className="text-lg font-medium text-emerald-800">Points Earned</p>
                    {currentSession.timeBonusEarned && (
                      <div className="text-sm text-emerald-600 mt-2 flex items-center justify-center gap-1">
                        <Zap className="h-3 w-3" />
                        Time Bonus!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Evidence & Verification Status */}
              {(evidencePreview.length > 0 || partnerVerified || realWorldCompleted) && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <CheckCircle className="h-5 w-5" />
                      Verification & Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className={`flex items-center gap-2 ${evidencePreview.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        <Camera className="h-4 w-4" />
                        Evidence: {evidencePreview.length > 0 ? 'Submitted' : 'None'}
                      </div>
                      <div className={`flex items-center gap-2 ${partnerVerified ? 'text-green-600' : 'text-gray-400'}`}>
                        <Users className="h-4 w-4" />
                        Partner: {partnerVerified ? 'Verified' : 'Pending'}
                      </div>
                      <div className={`flex items-center gap-2 ${realWorldCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                        <Eye className="h-4 w-4" />
                        Real-World: {realWorldCompleted ? 'Completed' : 'Not Required'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dr. Marcie's Enhanced Feedback */}
              {currentSession.drMarcieFeedback && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <MessageSquare className="h-5 w-5" />
                      Dr. Marcie's Professional Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700 leading-relaxed">{currentSession.drMarcieFeedback}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Play Another Game
                </Button>
                <Button 
                  onClick={resetGame}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Enhanced Game Playing View
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <EnhancedDrMarcieAvatar expression="happy" />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{selectedGame.title}</CardTitle>
                      <CardDescription className="mt-1">{selectedGame.description}</CardDescription>
                    </div>
                    
                    {/* Live Timer */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                            <Timer className="h-5 w-5" />
                            {formatTime(gameTimer)}
                          </div>
                          <p className="text-xs text-blue-500">
                            Target: {selectedGame.estimatedTime}m
                            {selectedGame.timeBonus && (
                              <span className="ml-1 text-amber-600">⚡</span>
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
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
                    {selectedGame.timeBonus && (
                      <Badge variant="outline" className="flex items-center gap-1 text-amber-600">
                        <Zap className="h-3 w-3" />
                        Time Bonus
                      </Badge>
                    )}
                    {selectedGame.requiresEvidence && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        Evidence Required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Enhanced Game Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    How to Play & Succeed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-blue-700">{getGameInstructions(selectedGame.id)}</p>
                    
                    {/* Success Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Pro Tips for Maximum Points:
                      </h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Be genuine and specific - generic responses get lower scores</li>
                        <li>• Document your process with photos/videos for extra points</li>
                        <li>• Complete within the time limit for bonus multipliers</li>
                        <li>• Get your partner to verify completion for verification bonus</li>
                        <li>• Put real effort into the real-world components</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Game Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Your Challenge Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderEnhancedGameContent(selectedGame)}
                </CardContent>
              </Card>

              {/* Enhanced Evidence & Completion Section */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Complete Your Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Written Evidence */}
                  <div>
                    <Label className="text-green-700 font-medium">
                      Share Your Experience (Required)
                    </Label>
                    <Textarea
                      placeholder="Describe what you did, how it went, what you learned, and how your partner reacted..."
                      value={writtenEvidence}
                      onChange={(e) => setWrittenEvidence(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                    <p className="text-xs text-green-600 mt-1">
                      Tip: Be specific and detailed for higher creativity scores!
                    </p>
                  </div>

                  {/* Enhanced Evidence Upload */}
                  {selectedGame.requiresEvidence && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-green-700 font-medium flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Evidence Upload (Photos/Videos)
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setPhotoEvidence(files);
                              }}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-gray-600 mt-1">Photos (JPG, PNG)</p>
                          </div>
                          <div>
                            <Input
                              type="file"
                              accept="video/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setVideoEvidence(files);
                              }}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-gray-600 mt-1">Videos (MP4, MOV)</p>
                          </div>
                        </div>
                        {(photoEvidence.length > 0 || videoEvidence.length > 0) && (
                          <Alert className="mt-2">
                            <Upload className="h-4 w-4" />
                            <AlertDescription>
                              Ready to upload: {photoEvidence.length} photos, {videoEvidence.length} videos
                              (+{(photoEvidence.length * 10) + (videoEvidence.length * 15)} bonus points)
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Self-Assessment Sliders */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-800 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Self-Assessment Scoring
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center justify-between">
                          <span>Creativity</span>
                          <span className="font-bold text-purple-600">{creativityScore}/100</span>
                        </Label>
                        <Slider
                          value={[creativityScore]}
                          onValueChange={(value) => setCreativityScore(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-600">How creative was your approach?</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center justify-between">
                          <span>Effort</span>
                          <span className="font-bold text-blue-600">{effortScore}/100</span>
                        </Label>
                        <Slider
                          value={[effortScore]}
                          onValueChange={(value) => setEffortScore(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-600">How much effort did you put in?</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center justify-between">
                          <span>Follow-Through</span>
                          <span className="font-bold text-green-600">{followThroughScore}/100</span>
                        </Label>
                        <Slider
                          value={[followThroughScore]}
                          onValueChange={(value) => setFollowThroughScore(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-600">Did you complete everything fully?</p>
                      </div>
                    </div>
                  </div>

                  {/* Partner Rating Section */}
                  {selectedGame.partnerRatingRequired && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-green-800 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Partner Impact Assessment
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center justify-between">
                            <span>Impact Rating</span>
                            <span className="font-bold text-pink-600">{impactRating}/10</span>
                          </Label>
                          <Slider
                            value={[impactRating]}
                            onValueChange={(value) => setImpactRating(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                          <p className="text-xs text-gray-600">How did this impact your partner?</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center justify-between">
                            <span>Sincerity Rating</span>
                            <span className="font-bold text-pink-600">{sincerityRating}/10</span>
                          </Label>
                          <Slider
                            value={[sincerityRating]}
                            onValueChange={(value) => setSincerityRating(value[0])}
                            max={10}
                            min={1}
                            step={1}
                          />
                          <p className="text-xs text-gray-600">How sincere was your effort?</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Checkboxes */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Verification & Confirmation
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                        <input
                          type="checkbox"
                          id="partner-verification"
                          checked={partnerVerified}
                          onChange={(e) => setPartnerVerified(e.target.checked)}
                          className="rounded mt-1"
                        />
                        <div>
                          <Label htmlFor="partner-verification" className="font-medium">
                            Partner Verification (+25 points)
                          </Label>
                          <p className="text-sm text-gray-600">
                            My partner confirms I completed this challenge authentically
                          </p>
                        </div>
                      </div>

                      {selectedGame.realWorldVerification && (
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                          <input
                            type="checkbox"
                            id="real-world-completed"
                            checked={realWorldCompleted}
                            onChange={(e) => setRealWorldCompleted(e.target.checked)}
                            className="rounded mt-1"
                          />
                          <div>
                            <Label htmlFor="real-world-completed" className="font-medium">
                              Real-World Completion (+30 points)
                            </Label>
                            <p className="text-sm text-gray-600">
                              I completed the real-world component of this challenge
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={completeGame}
                    disabled={!writtenEvidence.trim() || uploadingMedia}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3"
                  >
                    {uploadingMedia ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading Evidence...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4 mr-2" />
                        Complete Challenge & Earn Points
                      </>
                    )}
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
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Enhanced Header with Competition Stats */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <EnhancedDrMarcieAvatar expression="happy" />
              <div>
                <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Romance Redemption Games
                </CardTitle>
                <CardDescription className="text-lg text-purple-600">
                  15 Competitive challenges to strengthen your relationship bond
                </CardDescription>
              </div>
            </div>
            
            {/* Competition Dashboard */}
            {competitionStats && (
              <Card className="bg-white/70 border-purple-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">{competitionStats.totalGamesCompleted}</div>
                      <p className="text-xs text-purple-500">Games Won</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amber-600">{competitionStats.perfectScores}</div>
                      <p className="text-xs text-amber-500">Perfect Scores</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{competitionStats.currentStreak}</div>
                      <p className="text-xs text-green-500">Current Streak</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">#{competitionStats.weeklyRank}</div>
                      <p className="text-xs text-blue-500">Weekly Rank</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(categoryInfo).map(([key, info]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2 px-2 md:px-4">
              <info.icon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs md:text-sm">
                {info.title.split(' ')[0]} {info.title.split(' ')[1]}
              </span>
              <span className="sm:hidden text-xs">{info.title.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {getCompletedCount(key.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1))}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categoryInfo).map(([categoryKey, info]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
            {/* Enhanced Category Header */}
            <Card className={`${info.gradient} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`flex items-center gap-2 text-xl bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                      <info.icon className="h-6 w-6 text-purple-600" />
                      {info.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 mt-1">
                      {info.description}
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {getCompletedCount(categoryKey.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1))}
                    </div>
                    <p className="text-sm text-purple-500">Completed</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableGames[categoryKey]?.map((game) => {
                const isCompleted = sessions.some(s => s.gameType === game.id && s.completed);
                const session = sessions.find(s => s.gameType === game.id && s.completed);
                const highScore = session?.overallScore || 0;

                return (
                  <Card 
                    key={game.id} 
                    className={`relative transition-all duration-300 hover:shadow-lg ${
                      isCompleted ? 'bg-green-50 border-green-200' : 'hover:border-purple-300'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start justify-between">
                        <span className="flex-1">{game.title}</span>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 ml-2">
                            {highScore}/100
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {game.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
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
                        {game.timeBonus && (
                          <Badge variant="outline" className="flex items-center gap-1 text-amber-600">
                            <Zap className="h-3 w-3" />
                            Speed Bonus
                          </Badge>
                        )}
                        {game.requiresEvidence && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            Evidence
                          </Badge>
                        )}
                        {game.realWorldVerification && (
                          <Badge variant="outline" className="flex items-center gap-1 text-purple-600">
                            <Eye className="h-3 w-3" />
                            Real-World
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {isCompleted && session && (
                          <div className="p-3 bg-green-100 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                                <Crown className="h-4 w-4" />
                                Personal Best!
                              </span>
                              <span className="text-sm text-green-600 font-bold">
                                {session.pointsAwarded} points
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-green-600">
                              <div className="text-center">
                                <div className="font-medium">{session.creativityScore}</div>
                                <div>Creativity</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{session.effortScore}</div>
                                <div>Effort</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{session.followThroughScore}</div>
                                <div>Follow-Through</div>
                              </div>
                            </div>
                            <p className="text-xs text-green-600 mt-2 text-center">
                              Grade: {session.drMarcieGrade || 'A-'} | Time: {formatTime(session.timeSpent || 0)}
                            </p>
                          </div>
                        )}
                        
                        <Button
                          onClick={() => startGame(game)}
                          className={`w-full ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                          }`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isCompleted ? 'Play Again for Higher Score' : 'Start Challenge'}
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

      {/* Enhanced Progress Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Romance Redemption Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Category Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(categoryInfo).map(([key, info]) => {
                const completed = getCompletedCount(key.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1));
                const total = availableGames[key]?.length || 5;
                const percentage = (completed / total) * 100;

                return (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <info.icon className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">{info.title}</span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{completed}/{total}</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <p className="text-xs text-gray-500 text-center">{Math.round(percentage)}% Complete</p>
                  </div>
                );
              })}
            </div>

            {/* Overall Stats */}
            {competitionStats && (
              <Card className="bg-white border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600 flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {Math.round(competitionStats.averageScore)}
                      </div>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600 flex items-center justify-center gap-1">
                        <Flame className="h-4 w-4" />
                        {competitionStats.longestStreak}
                      </div>
                      <p className="text-sm text-gray-600">Best Streak</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
                        <Star className="h-4 w-4" />
                        {competitionStats.favoriteCategory}
                      </div>
                      <p className="text-sm text-gray-600">Favorite Category</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600 flex items-center justify-center gap-1">
                        <Medal className="h-4 w-4" />
                        #{competitionStats.monthlyRank}
                      </div>
                      <p className="text-sm text-gray-600">Monthly Rank</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getGameInstructions(gameId: string): string {
  const instructions: Record<string, string> = {
    how_well_know_me: "Test your knowledge with progressively harder questions about each other's preferences, dreams, and quirks. Be honest - Dr. Marcie's AI can detect guessing patterns! Bonus points for explaining your reasoning.",
    ten_things_adore: "Each partner lists 10 specific things you adore about the other. Generic answers like 'you're nice' won't cut it - get creative and personal! Include why each trait matters to you.",
    curiosity_conversations: "Take turns asking deep, meaningful questions about each other's inner worlds. Listen actively, ask follow-up questions, and avoid surface-level topics. Quality over quantity wins here!",
    memory_lane_championship: "Recall specific details from your relationship milestones - first date location, what you wore, exact conversations. The more specific and heartfelt, the higher your score. Photo evidence welcome!",
    future_dreams_alignment: "Share your individual dreams for the future, then work together to create a shared vision that excites both of you. Document your planning process and compromises made.",
    surprise_factor: "Plan and execute a genuine surprise for your partner within the next 24-48 hours. Document the planning process, execution, and their reaction. Creativity and thoughtfulness are key - no generic gifts!",
    love_note_olympics: "Write creative, heartfelt messages to each other in different formats - poems, letters, songs, visual art, or digital creations. Take risks and be vulnerable for maximum points!",
    date_night_design: "Collaboratively plan a perfect date within your budget constraints. Show your teamwork, compromise skills, and creativity. Include backup plans and consider each other's preferences equally.",
    compliment_combat: "Take turns giving genuine, specific compliments about each other. No repeats allowed! Keep going until someone runs out. Quality and specificity matter more than quantity.",
    touch_language_learning: "Explore each other's physical affection preferences through guided exercises and open communication. Respect boundaries and focus on understanding, not performing.",
    forgiveness_foundations: "Work through a specific past hurt using structured conversation techniques. This requires genuine vulnerability, active listening, and commitment to healing - not just saying sorry.",
    trust_rebuilding_blocks: "Make and keep small, specific commitments to each other over the next week. Start small and build consistency. Track your follow-through and celebrate each success together.",
    intimacy_ladders: "Gradually increase emotional and physical closeness through progressive activities designed for your comfort levels. Communication and consent are essential throughout this process.",
    gratitude_explosions: "Overwhelm each other with appreciation through multiple formats throughout an entire day - verbal compliments, written notes, acts of service, and surprise gestures. Go overboard with positivity!",
    new_tradition_creation: "Design a unique ritual or tradition that's meaningful to your specific relationship. Make it something you'll genuinely want to repeat and that reflects your shared values and interests."
  };

  return instructions[gameId] || "Follow Dr. Marcie's guidance to complete this relationship-strengthening challenge with authenticity and effort!";
}

function renderEnhancedGameContent(game: RomanceGame) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Your Specific Challenge:
        </h4>
        <p className="text-purple-700 leading-relaxed">
          {getGameInstructions(game.id)}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Success Criteria:
          </h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Authenticity and genuine effort</li>
            <li>• Specific details and personal touches</li>
            <li>• Active participation from both partners</li>
            <li>• Complete documentation of the process</li>
            {game.timeBonus && <li>• Complete within {game.estimatedTime} minutes for bonus</li>}
          </ul>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Point Opportunities:
          </h4>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Base score: Up to {game.maxPoints} points</li>
            <li>• Creativity bonus: +20 points (90+ score)</li>
            <li>• Evidence bonus: +10-15 points</li>
            <li>• Partner verification: +25 points</li>
            {game.timeBonus && <li>• Speed bonus: +30 points</li>}
            {game.realWorldVerification && <li>• Real-world completion: +30 points</li>}
          </ul>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
          <Smile className="h-4 w-4" />
          Dr. Marcie's Pro Tips:
        </h4>
        <div className="text-green-700 text-sm space-y-1">
          <p>🎯 Focus on emotional connection over perfection</p>
          <p>📸 Document the journey, not just the outcome</p>
          <p>💝 Personalize everything to your unique relationship</p>
          <p>⏰ Quality time and attention matter most</p>
          <p>🤝 Involve your partner in meaningful ways</p>
        </div>
      </div>
    </div>
  );
}