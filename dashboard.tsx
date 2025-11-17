'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Flame, 
  Trophy, 
  Zap, 
  Users, 
  TrendingUp, 
  Calendar, 
  Shield,
  Star,
  Clock,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import GameInterface from '@/components/game-interface';
import { EnhancedGameInterface } from '@/components/enhanced-game-interface';
import FightSolver from '@/components/fight-solver';
import EnhancedSOSFightSolver from '@/components/enhanced-sos-fight-solver';
import AdvancedSettingsPanel from '@/components/advanced-settings-panel';
import { ComprehensiveActivityManager } from '@/lib/comprehensive-activity-system';
import { DailyMetricsDashboard } from '@/components/daily-metrics-dashboard';
import { EnhancedRomanceRedemption } from '@/components/enhanced-romance-redemption';
import { CompetitionDashboard } from '@/components/competition-dashboard';
import { DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface DashboardProps {
  userEmail: string;
  userName: string;
  personalityLevel: DrMarciePersonality;
}

interface CoupleData {
  id: string;
  vulnerabilityPoints: number;
  trustThermometer: number;
  currentStreak: number;
  longestStreak: number;
  subscriptionActive: boolean;
  subscriptionTier?: string;
  originStory?: string;
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  gameSessions: Array<{
    id: string;
    gameTitle: string;
    completed: boolean;
    player1Score: number;
    player2Score: number;
    createdAt: string;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    achieved: boolean;
    createdAt: string;
  }>;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  drMarcieLevel: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  userEmail,
  userName,
  personalityLevel
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'game' | 'fight-solver' | 'settings'>('dashboard');
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedGameType, setSelectedGameType] = useState<'emotional_connection' | 'psych_based' | 'creative_chaos'>('emotional_connection');

  useEffect(() => {
    fetchCoupleData();
  }, [userEmail]);

  const fetchCoupleData = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/couples?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setCoupleData(data.couple);
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching couple data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = (gameType: 'emotional_connection' | 'psych_based' | 'creative_chaos'): void => {
    setSelectedGameType(gameType);
    setCurrentView('game');
  };

  const onGameComplete = async (scores: { player1Score: number; player2Score: number; feedback: string }): Promise<void> => {
    // Game completion logic would go here
    console.log('Game completed:', scores);
    setCurrentView('dashboard');
    await fetchCoupleData(); // Refresh data
  };

  const gameTypes = [
    {
      type: 'emotional_connection' as const,
      title: 'Emotional Connection',
      description: 'Deep vulnerability and bonding challenges',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-red-500',
      estimatedTime: 15,
      challenges: ['Vulnerability Share', 'Gratitude Focus', 'Future Dreams']
    },
    {
      type: 'psych_based' as const,
      title: 'Psychology Games',
      description: 'Science-backed relationship exercises',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-purple-500 to-blue-500',
      estimatedTime: 20,
      challenges: ['Love Language Quiz', 'Conflict Style Analysis', 'Attachment Dance']
    },
    {
      type: 'creative_chaos' as const,
      title: 'Creative Chaos',
      description: 'Fun, silly, and playful activities',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      estimatedTime: 12,
      challenges: ['Movie Trailer', 'Partner Portrait', 'Silly Love Song']
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading your love journey...</p>
        </div>
      </div>
    );
  }

  // Daily Metrics View
  if (currentView === 'daily-metrics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="p-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <DailyMetricsDashboard
            userId={userData?.id || ''}
            coupleId={coupleData.id}
            userName={userName}
          />
        </div>
      </div>
    );
  }

  // Romance Redemption View
  if (currentView === 'romance-redemption') {
    const partnerName = coupleData.users.find(u => u.email !== userEmail)?.name || 'your partner';
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="p-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <RomanceRedemptionGames
            userId={userData?.id || ''}
            coupleId={coupleData.id}
            userName={userName}
            partnerName={partnerName}
          />
        </div>
      </div>
    );
  }

  // Competition View
  if (currentView === 'competition') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="p-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <CompetitionDashboard
            userId={userData?.id || ''}
            coupleId={coupleData.id}
            userName={userName}
          />
        </div>
      </div>
    );
  }

  if (!coupleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Couple Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be part of a couple to access the relationship games. Please link with your partner first.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game Interface View
  if (currentView === 'game') {
    const gameInfo = gameTypes.find(g => g.type === selectedGameType);
    return (
      <GameInterface
        gameType={selectedGameType}
        gameTitle={gameInfo?.title || 'Relationship Challenge'}
        description={gameInfo?.description || 'Strengthen your bond together'}
        estimatedTime={gameInfo?.estimatedTime || 15}
        maxPoints={100}
        personalityLevel={personalityLevel}
        coupleBackstory={coupleData.originStory}
        onGameComplete={onGameComplete}
      />
    );
  }

  // Fight Solver View
  if (currentView === 'fight-solver') {
    return (
      <EnhancedSOSFightSolver
        coupleId={coupleData.id}
        userId={userData?.id || ''}
        personalityLevel={personalityLevel}
        coupleBackstory={coupleData.originStory}
        onResolutionComplete={() => {
          setCurrentView('dashboard');
          fetchCoupleData();
        }}
      />
    );
  }

  // Settings View
  if (currentView === 'settings') {
    return (
      <AdvancedSettingsPanel
        userEmail={userEmail}
        userName={userName}
        personalityLevel={personalityLevel}
        coupleBackstory={coupleData.originStory}
        onPersonalityChange={(level) => {
          // Handle personality level change
          console.log('Personality level changed to:', level);
          fetchCoupleData();
        }}
        onSettingsChange={(settings) => {
          // Handle settings change
          console.log('Settings changed:', settings);
        }}
      />
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Love, Actually... The Game
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How About We DON'T Break Up? 💕
          </p>
        </div>

        {/* Welcome & Partner Info */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Welcome back, {userName}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Playing with {coupleData.users.find(u => u.email !== userEmail)?.name || 'your partner'}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-pink-500 text-white mb-2">
                  Dr. Marcie Level {personalityLevel}
                </Badge>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {coupleData.subscriptionActive ? '✨ Premium' : '🆓 Free'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{coupleData.vulnerabilityPoints}</div>
              <div className="text-sm opacity-90">Vulnerability Points</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6 text-center">
              <div className="relative mb-2">
                <div className="w-8 h-8 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{coupleData.trustThermometer}°</span>
                </div>
              </div>
              <div className="text-2xl font-bold">{coupleData.trustThermometer}%</div>
              <div className="text-sm opacity-90">Trust Thermometer</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{coupleData.currentStreak}</div>
              <div className="text-sm opacity-90">Current Streak</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{coupleData.longestStreak}</div>
              <div className="text-sm opacity-90">Best Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency SOS Button */}
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="w-12 h-12" />
                <div>
                  <h3 className="text-xl font-bold">Having a Fight? Need Help NOW?</h3>
                  <p className="text-red-100">Emergency relationship intervention available 24/7</p>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentView('fight-solver')}
                size="lg"
                className="bg-white text-red-500 hover:bg-red-50 font-bold"
              >
                🆘 FIX THIS MESS!
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Daily Games</span>
              <span className="sm:hidden">Games</span>
            </TabsTrigger>
            <TabsTrigger value="romance" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Romance</span>
              <span className="sm:hidden">💕</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Metrics</span>
              <span className="sm:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Compete</span>
              <span className="sm:hidden">🏆</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
              <span className="sm:hidden">📈</span>
            </TabsTrigger>
            <TabsTrigger value="marcie" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Dr. Marcie</span>
              <span className="sm:hidden">⭐</span>
            </TabsTrigger>
          </TabsList>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Button
              onClick={() => setCurrentView('daily-metrics')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 h-auto flex-col space-y-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm font-medium">Daily Check-in</span>
            </Button>
            <Button
              onClick={() => setCurrentView('romance-redemption')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-6 h-auto flex-col space-y-2"
            >
              <Heart className="w-6 h-6" />
              <span className="text-sm font-medium">Romance Games</span>
            </Button>
            <Button
              onClick={() => setCurrentView('competition')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-6 h-auto flex-col space-y-2"
            >
              <Award className="w-6 h-6" />
              <span className="text-sm font-medium">Leaderboards</span>
            </Button>
            <Button
              onClick={() => setCurrentView('fight-solver')}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-6 h-auto flex-col space-y-2"
            >
              <Shield className="w-6 h-6" />
              <span className="text-sm font-medium">SOS Help</span>
            </Button>
          </div>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gameTypes.map((game) => (
                <Card key={game.type} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${game.color} text-white flex items-center justify-center mb-3`}>
                      {game.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{game.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{game.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {game.estimatedTime} min
                        </span>
                        <Badge variant="outline">
                          {game.challenges.length} challenges
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {game.challenges.map((challenge, index) => (
                          <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
                            • {challenge}
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => startGame(game.type)}
                        className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white`}
                      >
                        Start Playing! 💕
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Romance Redemption Tab */}
          <TabsContent value="romance" className="space-y-6">
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-pink-500" />
                <h3 className="text-xl font-bold text-pink-800 mb-2">Romance Redemption Games</h3>
                <p className="text-pink-600 mb-4">15 amazing challenges to strengthen your relationship bond</p>
                <Button
                  onClick={() => setCurrentView('romance-redemption')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Start Romance Challenge! 💕
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Connection Depth</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deep knowledge and emotional bonding</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>• How Well Do You REALLY Know Me?</div>
                    <div>• 10 Things I Adore</div>
                    <div>• Curiosity Conversations</div>
                    <div>• Memory Lane Championship</div>
                    <div>• Future Dreams Alignment</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Romance Revival</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reignite the spark with creativity</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>• Surprise Factor</div>
                    <div>• Love Note Olympics</div>
                    <div>• Date Night Design</div>
                    <div>• Compliment Combat</div>
                    <div>• Touch Language Learning</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Repair & Reconnection</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Healing and strengthening bonds</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>• Forgiveness Foundations</div>
                    <div>• Trust Rebuilding Blocks</div>
                    <div>• Intimacy Ladders</div>
                    <div>• Gratitude Explosions</div>
                    <div>• New Tradition Creation</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Daily Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Daily Love Dashboard</h3>
                <p className="text-blue-600 mb-4">Track your trust, love, and connection levels daily</p>
                <Button
                  onClick={() => setCurrentView('daily-metrics')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  Check In Today! 📊
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Trust Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Daily 1-10 scale rating with context notes and trend analysis</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-pink-600">Love Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">How loved you felt with love language breakdown and moments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600">Connection Gauge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Emotional closeness with quality assessments and insights</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competition Tab */}
          <TabsContent value="competition" className="space-y-6">
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Competition Central</h3>
                <p className="text-yellow-600 mb-4">Compete, achieve, and celebrate your relationship victories!</p>
                <Button
                  onClick={() => setCurrentView('competition')}
                  className="bg-gradient-to-r from-yellow-500 to-amber-500"
                >
                  View Leaderboards! 🏆
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Individual & Couple Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">See how you rank against other players and couples</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Competitions</span>
                      <Badge variant="outline">Live</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Tournaments</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seasonal Championships</span>
                      <Badge className="bg-yellow-500 text-white">Current</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="w-5 h-5" />
                    Achievements & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Unlock badges and earn recognition</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Common Achievements</span>
                      <span className="text-gray-500">🥉 Bronze</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rare Achievements</span>
                      <span className="text-blue-500">🥈 Silver</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Legendary Achievements</span>
                      <span className="text-yellow-500">🥇 Gold</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Relationship Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Trust Level</span>
                      <span className="text-sm font-medium">{coupleData.trustThermometer}%</span>
                    </div>
                    <Progress value={coupleData.trustThermometer} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Vulnerability Points</span>
                      <span className="text-sm font-medium">{coupleData.vulnerabilityPoints}/1000</span>
                    </div>
                    <Progress value={(coupleData.vulnerabilityPoints / 1000) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{coupleData.gameSessions.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Games Played</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{coupleData.milestones.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Milestones</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                    <Calendar className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {coupleData.gameSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{session.gameTitle}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {session.player1Score + session.player2Score} pts
                          </div>
                          {session.completed && (
                            <Badge className="bg-green-500 text-white text-xs">Completed</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dr. Marcie Tab */}
          <TabsContent value="marcie">
            <EnhancedDrMarcieAvatar
              personalityLevel={personalityLevel}
              coupleBackstory={coupleData.originStory}
              className="animate__animated animate__fadeIn"
              hostingContext="general"
              autoGreeting={true}
              initialMessage={`Hello there, lovebirds! Dr. Marcie here. I see you've been making progress on your relationship journey. What can I help you work on today?`}
            />
          </TabsContent>
        </Tabs>