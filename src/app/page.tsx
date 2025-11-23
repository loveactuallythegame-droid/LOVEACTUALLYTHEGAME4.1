'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '../components/landing-page2';
import Dashboard from '../components/dashboard';
import { DrMarciePersonality } from '../../dr-marcie-ai';

interface UserSession {
  email: string;
  name: string;
  personalityLevel: DrMarciePersonality;
}

export default function Home(): React.ReactElement {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = (): void => {
      try {
        const storedSession = localStorage.getItem('loveActuallySession');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed.email && parsed.name && parsed.personalityLevel) {
            setUserSession(parsed);
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('loveActuallySession');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleUserAuthenticated = (email: string, name: string, personalityLevel: number): void => {
    const session: UserSession = {
      email,
      name,
      personalityLevel: personalityLevel as DrMarciePersonality
    };
    
    setUserSession(session);
    
    // Store session in localStorage for persistence
    try {
      localStorage.setItem('loveActuallySession', JSON.stringify(session));
    } catch (error) {
      console.error('Error storing session:', error);
    }
  };

  const handleSignOut = (): void => {
    setUserSession(null);
    try {
      localStorage.removeItem('loveActuallySession');
    } catch (error) {
      console.error('Error removing session:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Love, Actually... The Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your relationship journey...
          </p>
        </div>
      </div>
    );
  }

  // Show Dashboard if user is authenticated
  if (userSession) {
    return (
      <div className="relative">
        {/* Sign Out Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleSignOut}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-all border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            Sign Out
          </button>
        </div>
        
        <Dashboard
          userEmail={userSession.email}
          userName={userSession.name}
          personalityLevel={userSession.personalityLevel}
        />
      </div>
    );
  }

  // Show Landing Page if user is not authenticated
  return (
    <LandingPage onUserAuthenticated={handleUserAuthenticated} />
  );
}
