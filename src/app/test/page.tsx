'use client';

import React from 'react';
import GameBrowser from '@/components/game-browser';
import GameDashboard from '@/components/game-dashboard';

export default function TestPage() {
  const mockUserData = {
    coupleId: 'test-couple-123',
    userId: 'test-user-456',
    personalityLevel: 2 as 1 | 2 | 3,
    relationshipStage: 'established' as const
  };

  const handleGameComplete = (results: any) => {
    console.log('Game completed:', results);
  };

  const handleNavigate = (section: string) => {
    console.log('Navigating to:', section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          🎮 Test Your Disney-Quality Games!
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Game Dashboard</h2>
            <GameDashboard
              coupleId={mockUserData.coupleId}
              userId={mockUserData.userId}
              personalityLevel={mockUserData.personalityLevel}
              relationshipStage={mockUserData.relationshipStage}
              onNavigate={handleNavigate}
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Game Browser</h2>
            <GameBrowser
              coupleId={mockUserData.coupleId}
              userId={mockUserData.userId}
              personalityLevel={mockUserData.personalityLevel}
              onGameComplete={handleGameComplete}
            />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            ← Back to Main App
          </a>
        </div>
      </div>
    </div>
  );
}