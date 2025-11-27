'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { useRouter } from 'next/navigation';

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const categories = [
    { id: 'all', label: 'All Games', icon: '🎮' },
    { id: 'romance', label: 'Romance', icon: '💞' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'intimacy', label: 'Intimacy', icon: '🔥' },
    { id: 'conflict', label: 'Conflict', icon: '🛠️' },
    { id: 'fun', label: 'Just for Fun', icon: '✨' }
  ];

  const featuredGames = [
    {
      id: 1,
      title: "Date Night Roulette",
      description: "Spin for tonight's plot twist. You set the vibe and budget, we serve chaos in cute packaging.",
      category: "romance",
      duration: "10-90 min",
      difficulty: "Low planning",
      color: "from-pink-500 to-rose-500",
      icon: "🎲",
      featured: true
    },
    {
      id: 2,
      title: "Bedroom Bingo",
      description: "A playful intimacy checklist. You two co-design the board with consent-first squares.",
      category: "intimacy",
      duration: "Flexible",
      difficulty: "Customizable",
      color: "from-purple-500 to-indigo-500",
      icon: "🧩",
      featured: true
    },
    {
      id: 3,
      title: "Windows & Walls Workshop",
      description: "Sort what you want to share vs. what you need to protect. Based on Worthen's method.",
      category: "communication",
      duration: "20-30 min",
      difficulty: "Structured",
      color: "from-blue-500 to-cyan-500",
      icon: "🪟",
      featured: false
    },
    {
      id: 4,
      title: "Fight Solver",
      description: "Guided scripts that turn blame into repair attempts. For when you're mid-argument.",
      category: "conflict",
      duration: "10-20 min",
      difficulty: "Emergency",
      color: "from-red-500 to-pink-500",
      icon: "🛠️",
      featured: true
    },
    {
      id: 5,
      title: "Love Language Showdown",
      description: "Rank these from 'feed me daily' to 'cute but optional.' Find your overlap + blind spots.",
      category: "communication",
      duration: "15 min",
      difficulty: "Easy",
      color: "from-green-500 to-teal-500",
      icon: "🏆",
      featured: false
    },
    {
      id: 6,
      title: "Six-Second Kiss Sync",
      description: "Hold down together to start the timer. A neuroscience-backed bonding moment.",
      category: "intimacy",
      duration: "6 seconds",
      difficulty: "Instant",
      color: "from-orange-500 to-red-500",
      icon: "💋",
      featured: false
    }
  ];

  const filteredGames = selectedCategory === 'all' 
    ? featuredGames 
    : featuredGames.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                LA
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-900">Love, Actually...</h1>
                <p className="text-sm text-purple-600">Games & Activities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EnhancedDrMarcieAvatar mood="excited" size="sm" />
              <span className="text-sm text-purple-600">Ready to play?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-purple-900 mb-4">
            Your Relationship Playground
          </h2>
          <p className="text-xl text-purple-700 max-w-3xl mx-auto">
            1,400+ science-backed games, exercises, and adventures designed by Dr. Marcie Liss 
            to turn your shared chaos into connection, laughter, and lasting intimacy.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Featured Games Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <GlassCard className="p-6 h-full flex flex-col hover:shadow-2xl transition-all duration-300">
                {/* Game Icon & Featured Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {game.icon}
                  </div>
                  {game.featured && (
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Game Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">{game.title}</h3>
                  <p className="text-purple-700 text-sm mb-4 leading-relaxed">{game.description}</p>
                  
                  {/* Game Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-1 text-xs text-purple-600">
                      <span>⏱</span>
                      <span>{game.duration}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-purple-600">
                      <span>📊</span>
                      <span>{game.difficulty}</span>
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <PrimaryButton 
                  className="w-full mt-auto"
                  onClick={() => router.push(`/games/${game.id}`)}
                >
                  Play Now
                </PrimaryButton>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-900 mb-2">1,400+</div>
            <div className="text-sm text-purple-600">Games & Exercises</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">15+</div>
            <div className="text-sm text-purple-600">Game Mechanics</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">50k+</div>
            <div className="text-sm text-purple-600">Couples Playing</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
            <div className="text-sm text-purple-600">Feel More Connected</div>
          </GlassCard>
        </motion.div>

        {/* Dr. Marcie Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-start gap-6">
              <EnhancedDrMarcieAvatar mood="sassy" size="md" />
              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Dr. Marcie Recommends</span>
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">
                  Start with Connection Games
                </h3>
                <p className="text-purple-700 mb-4 leading-relaxed">
                  Before diving into the spicy stuff, build your foundation with communication and trust games. 
                  They're like emotional warm-ups before the main workout. Plus, they're ridiculously fun and 
                  you'll learn things about each other that surprise you—even after years together.
                </p>
                <div className="flex gap-3">
                  <PrimaryButton>
                    Try "Love Language Showdown"
                  </PrimaryButton>
                  <PrimaryButton variant="outline">
                    Browse Communication Games
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-around">
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'games', label: 'Games', icon: '🎮' },
              { id: 'romance', label: 'Romance', icon: '💞' },
              { id: 'healing', label: 'Healing', icon: '🩺' },
              { id: 'profile', label: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => router.push(`/${tab.id === 'home' ? 'dashboard' : tab.id}`)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  tab.id === 'games'
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                    : 'text-purple-600 hover:bg-purple-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Padding for Fixed Nav */}
      <div className="h-20" />
    </div>
  );
}