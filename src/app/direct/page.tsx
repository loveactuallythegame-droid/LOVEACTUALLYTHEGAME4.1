'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameBrowser from '@/components/game-browser';
import { getRandomGames } from '@/lib/game-library';
import { Heart, Sparkles, Play } from 'lucide-react';

export default function DirectPage() {
  const [showGames, setShowGames] = useState(false);
  
  // Sample games to show immediately
  const sampleGames = getRandomGames(6);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800"
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 50%, #ec4899 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #a855f7 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, #ec4899 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
        
        <div className="relative z-10 text-center py-16 px-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-pink-500/50">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4"
          >
            Love, Actually... The Game
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-purple-700 dark:text-purple-300 mb-8"
          >
            Your 1,400+ Disney-quality relationship games are ready!
          </motion.p>
          
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGames(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            <span>Start Playing Now!</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Game Preview */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-4">
            ✨ Try These Magical Games ✨
          </h2>
          <p className="text-xl text-purple-600 dark:text-purple-400">
            Interactive experiences designed to deepen your connection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sampleGames.slice(0, 6).map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:border-pink-300 transition-all cursor-pointer group"
            >
              <div className="text-center space-y-4">
                <div className="text-4xl mb-4">{['💕', '🎭', '🎯', '✨', '🎲', '🌟'][index]}</div>
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                  {game.title}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 text-sm">
                  {game.description}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full">
                    Level {game.difficulty}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                    {game.estimatedTime} min
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Game Browser */}
        {showGames && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <GameBrowser
              coupleId="demo-couple-123"
              userId="demo-user-456"
              personalityLevel={2}
              onGameComplete={(results) => {
                console.log('Game completed:', results);
                alert(`🎉 Amazing! You completed the game and earned ${results.rewards.points} points!`);
              }}
            />
          </motion.div>
        )}

        {/* Quick Navigation */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-lg text-purple-600 dark:text-purple-400">
            Want to explore everything?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/games"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Browse All Games</span>
            </a>
            <a
              href="/test"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Full Experience</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-purple-600 dark:text-purple-400">
        <p className="text-lg">
          Made with ❤️ for couples who choose love over breaking up
        </p>
      </div>
    </motion.div>
  );
}