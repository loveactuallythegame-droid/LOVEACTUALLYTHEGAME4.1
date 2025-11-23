'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Trophy, Medal, Star, Crown, Target, Zap, TrendingUp, Award, Users, Calendar } from 'lucide-react';
import { EnhancedDrMarcieAvatar } from './enhanced-dr-marcie-avatar';
import { DrMarcieVoiceService } from './dr-marcie-voice-service';

interface LeaderboardEntry {
  rank: number;
  userId?: string;
  coupleId?: string;
  name?: string;
  partnerNames?: string;
  totalPoints: number;
  gamesCompleted: number;
  romanceGamesCompleted: number;
  achievementsUnlocked: number;
  relationshipHealth?: number;
  currentStreak?: number;
}

interface Achievement {
  id: string;
  achievementId: string;
  title: string;
  description: string;
  category: string;
  badgeIcon?: string;
  rarity: string;
  pointsAwarded: number;
  completed: boolean;
  currentProgress: number;
  requiredProgress: number;
  specialRecognition?: string;
}

interface CompetitionSeason {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  categories: string[];
  prizes: string[];
  specialEvents: string[];
}

interface CompetitionDashboardProps {
  userId: string;
  coupleId: string;
  userName: string;
}

export function CompetitionDashboard({ userId, coupleId, userName }: CompetitionDashboardProps) {
  const [individualLeaderboard, setIndividualLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [coupleLeaderboard, setCoupleLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRanking, setUserRanking] = useState<any>(null);
  const [coupleRanking, setCoupleRanking] = useState<any>(null);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [coupleAchievements, setCoupleAchievements] = useState<Achievement[]>([]);
  const [currentSeason, setCurrentSeason] = useState<CompetitionSeason | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedCategory, setSelectedCategory] = useState('individual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitionData();
  }, [userId, coupleId, selectedPeriod, selectedCategory]);

  const fetchCompetitionData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'all',
        userId,
        coupleId,
        period: selectedPeriod,
        category: selectedCategory,
      });

      const response = await fetch(`/api/competition?${params}`);
      const data = await response.json();
      
      if (data.success) {
        if (data.leaderboard) {
          if (data.leaderboard.category === 'individual') {
            setIndividualLeaderboard(data.leaderboard.data);
          } else {
            setCoupleLeaderboard(data.leaderboard.data);
          }
        }
        
        setUserRanking(data.userRanking);
        setCoupleRanking(data.coupleRanking);
        
        if (data.userAchievements) {
          setUserAchievements(data.userAchievements.achievements);
        }
        
        if (data.coupleAchievements) {
          setCoupleAchievements(data.coupleAchievements.achievements);
        }
        
        if (data.currentSeason) {
          setCurrentSeason(data.currentSeason);
        }
      }
    } catch (error) {
      console.error('Failed to fetch competition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return rank <= 10 ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' : 'bg-gray-100';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return "Top 10% - Outstanding! 🌟";
    if (percentile >= 75) return "Top 25% - Excellent! 🎉";
    if (percentile >= 50) return "Top 50% - Great job! 💪";
    if (percentile >= 25) return "Top 75% - Keep going! 📈";
    return "Room for improvement! 💕";
  };

  const playRankingCelebration = () => {
    if (userRanking && userRanking.rank <= 10) {
      const message = `Wow ${userName}! You're ranked #${userRanking.rank} out of ${userRanking.totalUsers} players! That puts you in the ${getPercentileMessage(userRanking.percentile)} Keep up the amazing work! 🏆`;
      DrMarcieVoiceService.speak(message, 'competition');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4">
            <EnhancedDrMarcieAvatar expression="happy" />
            <div>
              <CardTitle className="text-2xl text-amber-800">Competition Central</CardTitle>
              <CardDescription className="text-lg text-amber-600">
                Compete, achieve, and celebrate your relationship victories!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Season Info */}
      {currentSeason && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calendar className="h-5 w-5" />
              Current Season: {currentSeason.name}
            </CardTitle>
            <CardDescription className="text-purple-600">
              {currentSeason.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentSeason.categories.map((category) => (
                <Badge key={category} variant="outline" className="text-purple-700">
                  {category}
                </Badge>
              ))}
            </div>
            {currentSeason.specialEvents.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-purple-800 mb-1">Special Events:</p>
                <div className="flex flex-wrap gap-2">
                  {currentSeason.specialEvents.map((event, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Your Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Individual Ranking */}
        {userRanking && (
          <Card className={`${userRanking.rank <= 10 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Your Individual Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-purple-600">#{userRanking.rank}</div>
                <p className="text-sm text-gray-600">out of {userRanking.totalUsers} players</p>
                <Badge className={getRarityColor(userRanking.percentile >= 90 ? 'legendary' : userRanking.percentile >= 75 ? 'epic' : 'rare')}>
                  {getPercentileMessage(userRanking.percentile)}
                </Badge>
                <Button
                  onClick={playRankingCelebration}
                  size="sm"
                  variant="outline"
                  className="mt-2"
                >
                  🎉 Celebrate Ranking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Couple Ranking */}
        {coupleRanking && (
          <Card className={`${coupleRanking.rank <= 10 ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Couple Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-pink-600">#{coupleRanking.rank}</div>
                <p className="text-sm text-gray-600">out of {coupleRanking.totalCouples} couples</p>
                <Badge className={getRarityColor(coupleRanking.percentile >= 90 ? 'legendary' : coupleRanking.percentile >= 75 ? 'epic' : 'rare')}>
                  {getPercentileMessage(coupleRanking.percentile)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="leaderboards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboards" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboards
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Leaderboards Tab */}
        <TabsContent value="leaderboards" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'individual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('individual')}
              >
                Individual
              </Button>
              <Button
                variant={selectedCategory === 'couple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('couple')}
              >
                Couples
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('weekly')}
              >
                This Week
              </Button>
              <Button
                variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('monthly')}
              >
                This Month
              </Button>
              <Button
                variant={selectedPeriod === 'current' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('current')}
              >
                Season
              </Button>
            </div>
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {selectedCategory === 'individual' ? 'Individual' : 'Couple'} Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers for {selectedPeriod} period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(selectedCategory === 'individual' ? individualLeaderboard : coupleLeaderboard).map((entry, index) => (
                  <div
                    key={entry.userId || entry.coupleId}
                    className={`flex items-center gap-4 p-4 rounded-lg ${getRankColor(entry.rank)}`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {entry.name || entry.partnerNames}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm opacity-90">
                        <span>{entry.totalPoints} points</span>
                        <span>•</span>
                        <span>{entry.gamesCompleted} games</span>
                        {entry.romanceGamesCompleted > 0 && (
                          <>
                            <span>•</span>
                            <span>{entry.romanceGamesCompleted} romance</span>
                          </>
                        )}
                        {entry.currentStreak && (
                          <>
                            <span>•</span>
                            <span>{entry.currentStreak} streak</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{entry.achievementsUnlocked}</span>
                      </div>
                      {entry.relationshipHealth && (
                        <div className="text-xs opacity-75">
                          Health: {entry.relationshipHealth.toFixed(1)}/10
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Individual Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Personal Achievements
              </CardTitle>
              <CardDescription>
                {userAchievements.filter(a => a.completed).length} completed out of {userAchievements.length} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {achievement.badgeIcon || '🏆'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="outline">
                            {achievement.pointsAwarded} pts
                          </Badge>
                        </div>

                        {achievement.completed ? (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Completed
                          </Badge>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.currentProgress}/{achievement.requiredProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.currentProgress / achievement.requiredProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Couple Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Couple Achievements
              </CardTitle>
              <CardDescription>
                {coupleAchievements.filter(a => a.completed).length} completed out of {coupleAchievements.length} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupleAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.completed 
                        ? 'bg-purple-50 border-purple-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {achievement.badgeIcon || '💕'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="outline">
                            {achievement.pointsAwarded} pts
                          </Badge>
                        </div>

                        {achievement.completed ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            ✓ Completed
                          </Badge>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.currentProgress}/{achievement.requiredProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.currentProgress / achievement.requiredProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userRanking?.userData?.totalPoints || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Personal best this season
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Games Completed</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userRanking?.userData?.gamesCompleted || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Including {userRanking?.userData?.romanceGamesCompleted || 0} romance games
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAchievements.filter(a => a.completed).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAchievements.filter(a => a.rarity === 'legendary').length} legendary unlocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Couple Rank</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  #{coupleRanking?.rank || '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {coupleRanking?.percentile || 0}th percentile
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}