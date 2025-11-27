'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'romance', label: 'Romance', icon: '💞' },
    { id: 'healing', label: 'Healing', icon: '🩺' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const dailyChallenge = {
    title: "Three compliments, one outrageous",
    description: "Each of you shares 3 compliments: 2 sincere, 1 ridiculous. Guess which is which.",
    time: "5 min",
    category: "Connection",
    difficulty: "Low pressure"
  };

  const quickLinks = [
    {
      title: "Romance Hub",
      description: "Turn up the soft and spicy.",
      subtitle: "Mini games for affection, intimacy, and 'I see you' moments.",
      tags: ["Date prompts", "Love languages"],
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Healing Hospital", 
      description: "Triage the tricky stuff.",
      subtitle: "Guided repairs, apologies, and 'we need to talk but kindly' tools.",
      tags: ["Conflict resets", "Repair scripts"],
      color: "from-purple-500 to-indigo-500"
    }
  ];

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
                <p className="text-sm text-purple-600">The Game</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EnhancedDrMarcieAvatar mood="happy" size="sm" />
              <span className="text-sm text-purple-600">Today's vibe: Soft chaos, high trust</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trust Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                  82%
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-700 shadow-md">
                  Trust Meter
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <EnhancedDrMarcieAvatar mood="sassy" size="sm" />
                  <div>
                    <p className="text-purple-900 font-medium mb-1">Today's sass</p>
                    <p className="text-purple-700 text-sm">Your trust tank is looking lush. Great day for a tiny vulnerability share and a big inside joke.</p>
                    <p className="text-xs text-purple-500 mt-2">Calibrated from your last check-in · Updated 3h ago</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Daily Challenge</span>
                <h3 className="text-xl font-bold text-purple-900 mt-1">{dailyChallenge.title}</h3>
                <p className="text-purple-700 text-sm mt-2">{dailyChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">{dailyChallenge.time}</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{dailyChallenge.category}</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{dailyChallenge.difficulty}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <PrimaryButton size="lg" className="flex-1">
                Play Daily Challenge
              </PrimaryButton>
              <PrimaryButton variant="outline" size="lg" className="flex-1">
                See other missions
              </PrimaryButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {quickLinks.map((link, index) => (
            <GlassCard key={index} className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{link.title}</span>
                  <h3 className="text-lg font-bold text-purple-900 mt-1">{link.description}</h3>
                  <p className="text-purple-700 text-sm mt-2">{link.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${link.color} flex items-center justify-center text-white text-xl`}>
                  {link.title === 'Romance Hub' ? '💞' : '🩺'}
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                {link.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <PrimaryButton 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(link.title === 'Romance Hub' ? '/romance' : '/healing')}
              >
                Go to {link.title}
              </PrimaryButton>
            </GlassCard>
          ))}
        </motion.div>

        {/* Streak & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-purple-900">7 days of chaos care</h4>
                  <p className="text-sm text-purple-600">Miss a day? No shame, the counter resets but the work still counts.</p>
                </div>
              </div>
              <PrimaryButton variant="outline" size="sm">
                View full history
              </PrimaryButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-around">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
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