'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import PrimaryButton from '@/components/ui/primary-button';
import DrMarcieAvatar from '@/components/dr-marcie-avatar';
import Confetti from '@/components/ui/confetti';
import { GameEngine, GameSession } from '@/components/game-engine';
import { gameLibrary, gameCategories, getGamesByCategory, getRandomGames } from '@/lib/game-library';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Trophy, 
  Clock, 
  Heart, 
  Star, 
  Filter,
  Shuffle,
  TrendingUp,
  Sparkles,
  Gamepad2,
  Users,
  Zap,
  Target
} from 'lucide-react';

interface GameBrowserProps {
  coupleId: string;
  userId: string;
  personalityLevel: 1 | 2 | 3;
  onGameComplete: (results: any) => void;
}

export const GameBrowser: React.FC<GameBrowserProps> = ({
  coupleId,
  userId,
  personalityLevel,
  onGameComplete,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Games');
  const [selectedGame, setSelectedGame] = useState<GameSession | null>(null);
  const [filteredGames, setFilteredGames] = useState<GameSession[]>(gameLibrary);
  const [showConfetti, setShowConfetti] = useState(false);
  const [drMarcieMood, setDrMarcieMood] = useState<'happy' | 'sassy' | 'excited'>('happy');
  const [dailyPicks, setDailyPicks] = useState<GameSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'difficulty' | 'time' | 'category'>('difficulty');

  useEffect(() => {
    // Set daily picks on component mount
    setDailyPicks(getRandomGames(3));
  }, []);

  useEffect(() => {
    // Filter games based on category and search term
    let games = selectedCategory === 'All Games' 
      ? gameLibrary 
      : getGamesByCategory(selectedCategory);

    if (searchTerm) {
      games = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort games
    games.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          return a.difficulty - b.difficulty;
        case 'time':
          return a.estimatedTime - b.estimatedTime;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredGames(games);
  }, [selectedCategory, searchTerm, sortBy]);

  const handleGameSelect = (game: GameSession) => {
    setSelectedGame(game);
    setDrMarcieMood('excited');
  };

  const handleGameComplete = (results: any) => {
    setShowConfetti(true);
    setDrMarcieMood('happy');
    setSelectedGame(null);
    onGameComplete(results);
    
    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleGameCancel = () => {
    setSelectedGame(null);
    setDrMarcieMood('happy');
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-500 bg-green-500/20';
      case 2: return 'text-yellow-500 bg-yellow-500/20';
      case 3: return 'text-orange-500 bg-orange-500/20';
      case 4: return 'text-red-500 bg-red-500/20';
      case 5: return 'text-purple-500 bg-purple-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emotional Connection': return <Heart className="w-4 h-4" />;
      case 'Conflict Resolution': return <Target className="w-4 h-4" />;
      case 'Romance & Spark': return <Sparkles className="w-4 h-4" />;
      case 'Game Show': return <Gamepad2 className="w-4 h-4" />;
      case 'Creative Chaos': return <Zap className="w-4 h-4" />;
      case 'Deep Healing': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (selectedGame) {
    return (
      <GameEngine
        session={selectedGame}
        coupleId={coupleId}
        userId={userId}
        personalityLevel={personalityLevel}
        onComplete={handleGameComplete}
        onCancel={handleGameCancel}
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
      {/* Confetti for achievements */}
      <Confetti trigger={showConfetti} />

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
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <GlassCard className="mb-6">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DrMarcieAvatar
                  mood={drMarcieMood}
                  size="md"
                  showSpeechBubble={true}
                  speechText="Ready to play some amazing games together? Let's strengthen your bond!"
                />
                <div>
                  <h1 className="text-3xl font-headers text-primary">
                    Game Library
                  </h1>
                  <p className="font-body text-primary/70">
                    1,400+ games to deepen your connection
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl"
              >
                🎮
              </motion.div>
            </div>
          </GlassCard>

          {/* Search and Filter Bar */}
          <GlassCard>
            <div className="p-4 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl font-body text-primary placeholder:text-primary/60 focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {gameCategories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-4 py-2 rounded-full font-body text-sm transition-all',
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-primary hover:bg-white/30'
                    )}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <span className="font-body text-primary/70">Sort by:</span>
                <div className="flex space-x-2">
                  {(['difficulty', 'time', 'category'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={cn(
                        'px-3 py-1 rounded-full font-body text-sm capitalize',
                        sortBy === option
                          ? 'bg-accent text-white'
                          : 'bg-white/20 text-primary hover:bg-white/30'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Daily Picks Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-headers text-primary flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <span>Today's Picks</span>
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDailyPicks(getRandomGames(3))}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Shuffle className="w-5 h-5 text-primary" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyPicks.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white/10 rounded-xl border border-white/20 cursor-pointer"
                    onClick={() => handleGameSelect(game)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-headers text-primary text-lg">{game.title}</h3>
                      {getCategoryIcon(game.category)}
                    </div>
                    <p className="font-body text-primary/70 text-sm mb-3">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary/60" />
                        <span className="font-body text-primary/60 text-sm">{game.estimatedTime} min</span>
                      </div>
                      <div className={cn(
                        'px-2 py-1 rounded-full text-xs font-body',
                        getDifficultyColor(game.difficulty)
                      )}>
                        Level {game.difficulty}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headers text-primary">
                  {selectedCategory === 'All Games' ? 'All Games' : selectedCategory}
                </h2>
                <span className="font-body text-primary/70">
                  {filteredGames.length} games
                </span>
              </div>

              <AnimatePresence mode="wait">
                {filteredGames.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-headers text-primary mb-2">No games found</h3>
                    <p className="font-body text-primary/70">Try adjusting your search or filters</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredGames.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="relative"
                      >
                        <GlassCard className="h-full hover:shadow-2xl transition-all duration-300">
                          <div className="p-6 flex flex-col h-full">
                            {/* Game Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-headers text-primary mb-2">
                                  {game.title}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  {getCategoryIcon(game.category)}
                                  <span className="font-body text-primary/70 text-sm">
                                    {game.category}
                                  </span>
                                </div>
                              </div>
                              <div className={cn(
                                'px-2 py-1 rounded-full text-xs font-body',
                                getDifficultyColor(game.difficulty)
                              )}>
                                Lv.{game.difficulty}
                              </div>
                            </div>

                            {/* Description */}
                            <p className="font-body text-primary/80 text-sm mb-4 flex-1">
                              {game.description}
                            </p>

                            {/* Game Stats */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-primary/60" />
                                  <span className="font-body text-primary/60 text-sm">
                                    {game.estimatedTime}m
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Trophy className="w-4 h-4 text-yellow-500" />
                                  <span className="font-body text-primary/60 text-sm">
                                    {game.rewards.points} pts
                                  </span>
                                </div>
                              </div>
                              {game.rewards.badge && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-accent" />
                                  <span className="font-body text-accent text-xs">
                                    {game.rewards.badge}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Play Button */}
                            <PrimaryButton
                              onClick={() => handleGameSelect(game)}
                              className="w-full"
                              size="sm"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Play Now
                            </PrimaryButton>
                          </div>
                        </GlassCard>

                        {/* Hover Effect Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent rounded-2xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-7xl mx-auto mt-8"
        >
          <GlassCard>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-headers text-accent mb-2">1,400+</div>
                  <div className="font-body text-primary/70">Total Games</div>
                </div>
                <div>
                  <div className="text-3xl font-headers text-accent mb-2">6</div>
                  <div className="font-body text-primary/70">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-headers text-accent mb-2">∞</div>
                  <div className="font-body text-primary/70">Fun Moments</div>
                </div>
                <div>
                  <div className="text-3xl font-headers text-accent mb-2">24/7</div>
                  <div className="font-body text-primary/70">Available</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameBrowser;