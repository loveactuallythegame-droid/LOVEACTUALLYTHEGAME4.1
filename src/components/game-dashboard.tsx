'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import PrimaryButton from '@/components/ui/primary-button';
import DrMarcieAvatar from '@/components/dr-marcie-avatar';
import GameBrowser from '@/components/game-browser';
import { getRecommendedGames, getRandomGames } from '@/lib/game-library';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Trophy, 
  Target, 
  Heart, 
  Star, 
  TrendingUp,
  Clock,
  Award,
  Zap,
  Users,
  Gamepad2
} from 'lucide-react';

interface GameDashboardProps {
  coupleId: string;
  userId: string;
  personalityLevel: 1 | 2 | 3;
  relationshipStage: 'new' | 'established' | 'struggling' | 'strong';
  onNavigate: (section: string) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  coupleId,
  userId,
  personalityLevel,
  relationshipStage,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'browser'>('dashboard');
  const [userStats, setUserStats] = useState({
    totalGamesPlayed: 47,
    totalPoints: 2340,
    currentStreak: 12,
    badgesEarned: 8,
    favoriteCategory: 'Emotional Connection',
    timeSpent: 156 // minutes
  });
  const [recommendedGames, setRecommendedGames] = useState<any[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [drMarcieMood, setDrMarcieMood] = useState<'happy' | 'sassy' | 'excited'>('happy');

  useEffect(() => {
    // Load recommended games based on relationship stage
    const recommended = getRecommendedGames(relationshipStage).slice(0, 3);
    setRecommendedGames(recommended);

    // Load recent achievements
    setRecentAchievements([
      {
        id: '1',
        title: 'Communication Champion',
        description: 'Completed 5 emotional connection games',
        icon: '💬',
        date: '2 days ago',
        points: 100
      },
      {
        id: '2',
        title: 'Conflict Resolver',
        description: 'Successfully navigated 3 conflict resolution games',
        icon: '🕊️',
        date: '1 week ago',
        points: 150
      },
      {
        id: '3',
        title: 'Romance Rekindler',
        description: 'Sparked connection with romantic games',
        icon: '💕',
        date: '3 days ago',
        points: 120
      }
    ]);
  }, [relationshipStage]);

  const handleGameComplete = (results: any) => {
    // Update stats
    setUserStats(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalPoints: prev.totalPoints + results.rewards.points,
      currentStreak: prev.currentStreak + 1
    }));

    // Show achievement if badge earned
    if (results.rewards.badge) {
      setRecentAchievements(prev => [{
        id: Date.now().toString(),
        title: results.rewards.badge,
        description: 'Earned from completing a game',
        icon: '🏆',
        date: 'Just now',
        points: results.rewards.points
      }, ...prev]);
    }

    setDrMarcieMood('excited');
    setTimeout(() => setDrMarcieMood('happy'), 3000);
  };

  const getStageColor = () => {
    switch (relationshipStage) {
      case 'new': return 'text-green-500 bg-green-500/20';
      case 'established': return 'text-blue-500 bg-blue-500/20';
      case 'struggling': return 'text-orange-500 bg-orange-500/20';
      case 'strong': return 'text-purple-500 bg-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getStageAdvice = () => {
    switch (relationshipStage) {
      case 'new':
        return 'Focus on building emotional connection and discovering each other\'s love languages!';
      case 'established':
        return 'Great time to deepen intimacy and work on communication skills!';
      case 'struggling':
        return 'Let\'s work through conflicts together and rebuild that spark!';
      case 'strong':
        return 'Your relationship is thriving! Time for advanced challenges and creative play!';
      default:
        return 'Every relationship is unique - let\'s find the perfect games for you!';
    }
  };

  if (activeSection === 'browser') {
    return (
      <GameBrowser
        coupleId={coupleId}
        userId={userId}
        personalityLevel={personalityLevel}
        onGameComplete={handleGameComplete}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, var(--highlight) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, var(--accent) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Welcome Card */}
            <GlassCard className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <DrMarcieAvatar
                    mood={drMarcieMood}
                    size="lg"
                    showSpeechBubble={true}
                    speechText={getStageAdvice()}
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-headers text-primary mb-2">
                      Welcome back, Lovebirds! 💕
                    </h1>
                    <p className="font-body text-primary/80 mb-4">
                      Your relationship stage: <span className={cn(
                        'px-2 py-1 rounded-full text-sm font-semibold',
                        getStageColor()
                      )}>
                        {relationshipStage.charAt(0).toUpperCase() + relationshipStage.slice(1)}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <PrimaryButton
                        onClick={() => setActiveSection('browser')}
                        size="sm"
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Browse All Games
                      </PrimaryButton>
                      <PrimaryButton
                        variant="outline"
                        onClick={() => onNavigate('dashboard')}
                        size="sm"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        View Progress
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard>
              <div className="p-6 h-full">
                <h3 className="text-xl font-headers text-primary mb-4">Your Journey</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-body text-primary/80">Games Played</span>
                    </div>
                    <span className="font-headers text-primary text-xl">{userStats.totalGamesPlayed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-accent" />
                      <span className="font-body text-primary/80">Total Points</span>
                    </div>
                    <span className="font-headers text-primary text-xl">{userStats.totalPoints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <span className="font-body text-primary/80">Current Streak</span>
                    </div>
                    <span className="font-headers text-primary text-xl">{userStats.currentStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span className="font-body text-primary/80">Badges Earned</span>
                    </div>
                    <span className="font-headers text-primary text-xl">{userStats.badgesEarned}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recommended Games */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-headers text-primary flex items-center space-x-2">
                    <Heart className="w-6 h-6 text-accent" />
                    <span>Recommended for You</span>
                  </h2>
                  <PrimaryButton
                    onClick={() => setActiveSection('browser')}
                    size="sm"
                    variant="outline"
                  >
                    View All
                  </PrimaryButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-white/10 rounded-xl border border-white/20 cursor-pointer"
                      onClick={() => {
                        // This would normally navigate to the game
                        console.log('Starting game:', game.title);
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-headers text-primary text-lg">{game.title}</h3>
                        <div className={cn(
                          'px-2 py-1 rounded-full text-xs font-body',
                          game.difficulty === 1 ? 'text-green-500 bg-green-500/20' :
                          game.difficulty === 2 ? 'text-yellow-500 bg-yellow-500/20' :
                          'text-orange-500 bg-orange-500/20'
                        )}>
                          Lv.{game.difficulty}
                        </div>
                      </div>
                      <p className="font-body text-primary/80 text-sm mb-4">
                        {game.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary/60" />
                          <span className="font-body text-primary/60 text-sm">
                            {game.estimatedTime} min
                          </span>
                        </div>
                        <PrimaryButton size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </PrimaryButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-headers text-primary mb-6 flex items-center space-x-2">
                  <Award className="w-6 h-6 text-accent" />
                  <span>Recent Achievements</span>
                </h2>

                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-headers text-primary">{achievement.title}</h3>
                        <p className="font-body text-primary/70 text-sm">{achievement.description}</p>
                        <p className="font-body text-primary/60 text-xs mt-1">{achievement.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-headers text-accent text-lg">+{achievement.points}</div>
                        <div className="font-body text-primary/60 text-xs">points</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-headers text-primary mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <PrimaryButton
                    onClick={() => {
                      const randomGame = getRandomGames(1)[0];
                      console.log('Starting random game:', randomGame.title);
                    }}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 py-4"
                  >
                    <Zap className="w-6 h-6" />
                    <span className="font-body text-sm">Random Game</span>
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={() => onNavigate('daily-challenge')}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 py-4"
                  >
                    <Target className="w-6 h-6" />
                    <span className="font-body text-sm">Daily Challenge</span>
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={() => onNavigate('couples-mode')}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 py-4"
                  >
                    <Users className="w-6 h-6" />
                    <span className="font-body text-sm">Couples Mode</span>
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={() => onNavigate('achievements')}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 py-4"
                  >
                    <Trophy className="w-6 h-6" />
                    <span className="font-body text-sm">All Badges</span>
                  </PrimaryButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameDashboard;