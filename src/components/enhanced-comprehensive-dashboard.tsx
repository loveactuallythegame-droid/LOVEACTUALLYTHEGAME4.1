'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Brain, 
  Target, 
  Zap, 
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Settings,
  Play,
  Shield,
  Sparkles,
  Award,
  BarChart3,
  FileText,
  Activity,
  Gamepad2,
  BookOpen,
  CheckCircle,
  Timer,
  Flame
} from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { CompetitionDashboard } from '@/components/competition-dashboard';
import { DailyMetricsDashboard } from '@/components/daily-metrics-dashboard';
import { RomanceRedemptionGames } from '@/components/romance-redemption-games2';
import EnhancedSOSFightSolver from '@/components/enhanced-sos-fight-solver';
import AdvancedSettingsPanel from '@/components/advanced-settings-panel';
import OmnipresentActivityInterface from '@/components/omnipresent-activity-interface';
import ComprehensiveActivityBrowser from '@/components/comprehensive-activity-browser';
import type { DrMarciePersonality } from '@/lib/dr-marcie-ai';

// Temporary type definitions for missing modules
interface ComprehensiveActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
}

// Mock manager for missing module
class Comprehensive1400Manager {
  static getRandomActivity(options: { category?: string }): ComprehensiveActivity | null {
    return {
      id: 'mock-activity',
      title: 'Sample Activity',
      description: 'A sample relationship activity',
      category: options.category || 'emotional_connection',
      difficulty: 2
    };
  }
}

interface EnhancedComprehensiveDashboardProps {
  userEmail: string;
  userName: string;
  coupleId: string;
  userId: string;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
}

interface DashboardStats {
  totalActivitiesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  trustLevel: number;
  vulnerabilityPoints: number;
  totalPoints: number;
  favoriteCategoryStats: {
    category: string;
    completedCount: number;
    averageScore: number;
  };
  recentAchievements: Achievement[];
  upcomingChallenges: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CategoryOverview {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  completedActivities: number;
  totalActivities: number;
  averageScore: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
  tags: string[];
}

const EnhancedComprehensiveDashboard: React.FC<EnhancedComprehensiveDashboardProps> = ({
  userEmail,
  userName,
  coupleId,
  userId,
  personalityLevel,
  coupleBackstory
}) => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedActivity, setSelectedActivity] = useState<ComprehensiveActivity | null>(null);
  const [showActivityInterface, setShowActivityInterface] = useState<boolean>(false);
  const [drMarcieGreeting, setDrMarcieGreeting] = useState<string>('');

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
    generateDrMarcieGreeting();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate loading comprehensive dashboard data
      // In real implementation, this would fetch from your APIs
      const mockStats: DashboardStats = {
        totalActivitiesCompleted: 47,
        currentStreak: 12,
        longestStreak: 23,
        trustLevel: 78,
        vulnerabilityPoints: 340,
        totalPoints: 1890,
        favoriteCategoryStats: {
          category: 'Emotional Connection',
          completedCount: 15,
          averageScore: 87
        },
        recentAchievements: [
          {
            id: 'trust_builder',
            title: 'Trust Builder',
            description: 'Completed 10 trust-building activities',
            icon: '🛡️',
            earnedAt: '2024-01-15',
            category: 'emotional_connection',
            rarity: 'rare'
          },
          {
            id: 'streak_master',
            title: 'Streak Master',
            description: 'Maintained 7-day activity streak',
            icon: '🔥',
            earnedAt: '2024-01-12',
            category: 'consistency',
            rarity: 'epic'
          }
        ],
        upcomingChallenges: [
          'Complete 5 vulnerability exercises',
          'Try a Level 4 difficulty activity',
          'Explore the Intimacy & Romance category'
        ]
      };

      setDashboardStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDrMarcieGreeting = (): void => {
    const greetings = [
      `Hey there, ${userName}! Ready to level up your relationship game today?`,
      `Well hello, gorgeous! I've got some exciting activities lined up for you two.`,
      `Good to see you back, ${userName}! Your relationship growth is looking fantastic.`,
      `Welcome back to the love laboratory! Dr. Marcie has some relationship magic waiting for you.`,
      `Hey lovebird! I can see you're committed to making this relationship extraordinary.`
    ];
    
    setDrMarcieGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  };

  const categoryOverviews: CategoryOverview[] = [
    {
      id: 'emotional_connection',
      name: 'Emotional Connection',
      description: 'Deep vulnerability and bonding challenges based on the SEEN method',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-red-500',
      completedActivities: 15,
      totalActivities: 200,
      averageScore: 87,
      difficulty: 3,
      estimatedTime: 18,
      tags: ['SEEN Method', 'Vulnerability', 'Safety', 'Trust']
    },
    {
      id: 'psychology_games',
      name: 'Psychology Games',
      description: 'Science-backed relationship exercises based on research',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-blue-500',
      completedActivities: 8,
      totalActivities: 200,
      averageScore: 92,
      difficulty: 4,
      estimatedTime: 22,
      tags: ['Gottman Method', 'Attachment', 'Love Languages', 'Psychology']
    },
    {
      id: 'creative_chaos',
      name: 'Creative Chaos',
      description: 'Fun, silly, and playful activities to spark joy and connection',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      completedActivities: 12,
      totalActivities: 200,
      averageScore: 94,
      difficulty: 2,
      estimatedTime: 15,
      tags: ['Fun', 'Creativity', 'Playfulness', 'Joy']
    },
    {
      id: 'infidelity_recovery',
      name: 'Infidelity Recovery',
      description: 'Specialized track for couples healing from betrayal and infidelity',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      completedActivities: 0,
      totalActivities: 200,
      averageScore: 0,
      difficulty: 5,
      estimatedTime: 27,
      tags: ['Healing', 'Trust Rebuilding', 'Transparency', 'Recovery']
    },
    {
      id: 'communication_mastery',
      name: 'Communication Mastery',
      description: 'Advanced communication skills for deeper connection',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500',
      completedActivities: 6,
      totalActivities: 200,
      averageScore: 89,
      difficulty: 3,
      estimatedTime: 19,
      tags: ['Communication', 'Active Listening', 'Conflict Resolution']
    },
    {
      id: 'intimacy_romance',
      name: 'Intimacy & Romance',
      description: 'Building physical, emotional, and spiritual intimacy',
      icon: <Star className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-500',
      completedActivities: 4,
      totalActivities: 200,
      averageScore: 91,
      difficulty: 3,
      estimatedTime: 20,
      tags: ['Intimacy', 'Romance', 'Physical Connection', 'Passion']
    },
    {
      id: 'life_partnership',
      name: 'Life Partnership',
      description: 'Building a strong partnership for all of life\'s challenges',
      icon: <Users className="w-6 h-6" />,
      color: 'from-teal-500 to-cyan-500',
      completedActivities: 2,
      totalActivities: 200,
      averageScore: 85,
      difficulty: 4,
      estimatedTime: 23,
      tags: ['Partnership', 'Life Goals', 'Support', 'Growth']
    }
  ];

  const handleActivitySelect = (activity: ComprehensiveActivity): void => {
    setSelectedActivity(activity);
    setShowActivityInterface(true);
  };

  const handleActivityComplete = (results: any): void => {
    setShowActivityInterface(false);
    setSelectedActivity(null);
    loadDashboardData(); // Refresh stats
  };

  const handlePointsEarned = (points: number): void => {
    // Update local stats immediately for responsive UI
    if (dashboardStats) {
      setDashboardStats(prev => prev ? {
        ...prev,
        totalPoints: prev.totalPoints + points,
        vulnerabilityPoints: prev.vulnerabilityPoints + Math.floor(points * 0.3)
      } : null);
    }
  };

  const getDifficultyColor = (difficulty: number): string => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-blue-500', 
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getRarityColor = (rarity: string): string => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  if (showActivityInterface && selectedActivity) {
    return (
      <OmnipresentActivityInterface
        coupleId={coupleId}
        userId={userId}
        personalityLevel={personalityLevel}
        activity={selectedActivity}
        coupleBackstory={coupleBackstory}
        onActivityComplete={handleActivityComplete}
        onPointsEarned={handlePointsEarned}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Dr. Marcie */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
                  Love, Actually... The Game
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  How About We DON'T Break Up? - Interactive Couples Gaming Platform
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{userName}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Dr. Marcie Omnipresent Greeting */}
        <div className="flex justify-center">
          <EnhancedDrMarcieAvatar
            personalityLevel={personalityLevel}
            coupleBackstory={coupleBackstory}
            className="animate__animated animate__fadeIn"
            hostingContext="dashboard"
            autoGreeting={true}
            initialMessage={drMarcieGreeting}
            showSpeechBubble={true}
          />
        </div>

        {/* Quick Stats Overview */}
        {dashboardStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dashboardStats.totalPoints}</div>
                <div className="text-sm opacity-90">Total Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dashboardStats.trustLevel}%</div>
                <div className="text-sm opacity-90">Trust Level</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dashboardStats.currentStreak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dashboardStats.totalActivitiesCompleted}</div>
                <div className="text-sm opacity-90">Activities</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dashboardStats.vulnerabilityPoints}</div>
                <div className="text-sm opacity-90">Vulnerability</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dashboardStats.recentAchievements.length}</div>
                <div className="text-sm opacity-90">Achievements</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="overview" className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden lg:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center space-x-1">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden lg:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="browser" className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Browse</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center space-x-1">
              <Activity className="w-4 h-4" />
              <span className="hidden lg:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="romance" className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="hidden lg:inline">Romance</span>
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span className="hidden lg:inline">Compete</span>
            </TabsTrigger>
            <TabsTrigger value="sos" className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span className="hidden lg:inline">SOS</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-1">
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            
            {/* Recent Achievements */}
            {dashboardStats && dashboardStats.recentAchievements.length > 0 && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Award className="w-5 h-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardStats.recentAchievements.map((achievement) => (
                      <Card key={achievement.id} className={`border-2 ${getRarityColor(achievement.rarity)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {achievement.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {achievement.description}
                              </p>
                              <Badge className={`mt-1 capitalize text-xs`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Challenges */}
            {dashboardStats && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Target className="w-5 h-5 mr-2" />
                    Upcoming Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardStats.upcomingChallenges.map((challenge, index) => (
                      <div key={index} className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 mr-3 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Activity Browser Tab */}
          <TabsContent value="browser">
            <ComprehensiveActivityBrowser
              personalityLevel={personalityLevel}
              coupleBackstory={coupleBackstory}
              onActivitySelect={(activity) => handleActivitySelect(activity as unknown as ComprehensiveActivity)}
            />
          </TabsContent>

          {/* Comprehensive Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                1,400 Comprehensive Activities
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                7 Categories × 10 Subcategories × 20 Activities - Dr. Marcie hosts every single one!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryOverviews.map((category) => (
                <Card key={category.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className={`bg-gradient-to-r ${category.color} text-white rounded-t-lg`}>
                    <CardTitle className="flex items-center text-lg">
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{category.completedActivities}/{category.totalActivities}</span>
                      </div>
                      <Progress 
                        value={(category.completedActivities / category.totalActivities) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getDifficultyColor(category.difficulty)} text-white text-xs`}>
                          Level {category.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {category.estimatedTime}m
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {category.averageScore > 0 ? `${category.averageScore}% avg` : 'Not started'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {category.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          const randomActivity = Comprehensive1400Manager.getRandomActivity({
                            category: category.id
                          });
                          if (randomActivity) {
                            handleActivitySelect(randomActivity);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Random Activity
                      </Button>
                      <Button
                        onClick={() => setCurrentTab('browser')}
                        variant="outline"
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse All 200 Activities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Daily Metrics Tab */}
          <TabsContent value="metrics">
            <DailyMetricsDashboard
              userId={userId}
              coupleId={coupleId}
              userName={userName}
            />
          </TabsContent>

          {/* Romance Redemption Tab */}
          <TabsContent value="romance">
            <RomanceRedemptionGames
              userId={userId}
              coupleId={coupleId}
              userName={userName}
              partnerName="Partner" // Default partner name
            />
          </TabsContent>

          {/* Competition Tab */}
          <TabsContent value="competition">
            <CompetitionDashboard
              userId={userId}
              coupleId={coupleId}
              userName={userName}
            />
          </TabsContent>

          {/* SOS Fight Solver Tab */}
          <TabsContent value="sos">
            <EnhancedSOSFightSolver
              coupleId={coupleId}
              userId={userId}
              personalityLevel={personalityLevel}
              coupleBackstory={coupleBackstory}
            />
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="settings">
            <AdvancedSettingsPanel
              userEmail={userEmail}
              userName={userName}
              personalityLevel={personalityLevel}
              coupleBackstory={coupleBackstory}
              onPersonalityChange={(level) => {
                // Handle personality change
                console.log('Personality level changed to:', level);
              }}
              onSettingsChange={(settings) => {
                // Handle settings change
                console.log('Settings updated:', settings);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedComprehensiveDashboard;