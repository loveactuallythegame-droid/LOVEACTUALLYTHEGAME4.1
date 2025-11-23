'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Zap, 
  Trophy, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Volume2,
  Timer,
  Target
} from 'lucide-react';

interface LandingPageProps {
  onUserAuthenticated: (userEmail: string, userName: string, personalityLevel: number) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onUserAuthenticated }) => {
  const [isAuthMode, setIsAuthMode] = useState<boolean>(false);
  const [authType, setAuthType] = useState<'signin' | 'signup' | 'create-couple'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    partnerEmail: '',
    partnerName: '',
    originStory: '',
    relationshipGoals: '',
    drMarcieLevel: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: string, value: string | number): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, this would authenticate with a proper auth service
      // For demo purposes, we'll just pass the email through
      if (formData.email && formData.name) {
        onUserAuthenticated(formData.email, formData.name, formData.drMarcieLevel);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCouple = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/couples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user1Email: formData.email,
          user1Name: formData.name,
          user2Email: formData.partnerEmail,
          user2Name: formData.partnerName,
          originStory: formData.originStory,
          relationshipGoals: formData.relationshipGoals,
          drMarcieLevel: formData.drMarcieLevel,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUserAuthenticated(formData.email, formData.name, formData.drMarcieLevel);
      } else {
        console.error('Failed to create couple:', data.error);
      }
    } catch (error) {
      console.error('Create couple failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const personalityLevels = [
    {
      level: 1,
      title: 'Tough Love Rookie',
      description: 'Warm but blunt, like Berta from Two and a Half Men',
      color: 'from-green-500 to-emerald-500',
      icon: '😌'
    },
    {
      level: 2,
      title: 'Reality Check Specialist',
      description: 'Clinical and analytical, like Beverly Hofstadter',
      color: 'from-yellow-500 to-orange-500',
      icon: '🧠'
    },
    {
      level: 3,
      title: 'Radical Truth Wizard',
      description: 'Deep truths with no BS, like Robin Williams in Good Will Hunting',
      color: 'from-red-500 to-pink-500',
      icon: '🔥'
    }
  ];

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Relationship Games',
      description: '200+ interactive challenges designed by relationship experts',
      color: 'text-pink-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Therapist',
      description: 'Dr. Marcie Liss provides personalized guidance with voice synthesis',
      color: 'text-purple-500'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Progress Tracking',
      description: 'Vulnerability points, trust thermometer, and achievement system',
      color: 'text-yellow-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'SOS Fight Solver',
      description: 'Emergency conflict resolution available 24/7',
      color: 'text-red-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Real-time Scoring',
      description: 'Live competition and partner-to-partner comparisons',
      color: 'text-blue-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Mobile-first Design',
      description: 'Perfect for couples on the go with responsive interface',
      color: 'text-emerald-500'
    }
  ];

  if (isAuthMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => setIsAuthMode(false)}
            className="mb-4"
          >
            ← Back to Home
          </Button>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                  {authType === 'create-couple' ? 'Create Your Couple Account' : 
                   authType === 'signup' ? 'Join the Love Revolution' : 'Welcome Back!'}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {authType === 'create-couple' ? 'Set up your relationship journey together' :
                   authType === 'signup' ? 'Start your relationship transformation' : 'Continue your love story'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Auth Type Selector */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Button
                  variant={authType === 'signin' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAuthType('signin')}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button
                  variant={authType === 'signup' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAuthType('signup')}
                  className="flex-1"
                >
                  Sign Up
                </Button>
                <Button
                  variant={authType === 'create-couple' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAuthType('create-couple')}
                  className="flex-1"
                >
                  New Couple
                </Button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your first name"
                  />
                </div>
              </div>

              {/* Partner Info (for create-couple) */}
              {authType === 'create-couple' && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="partner-email">Partner's Email</Label>
                      <Input
                        id="partner-email"
                        type="email"
                        value={formData.partnerEmail}
                        onChange={(e) => handleInputChange('partnerEmail', e.target.value)}
                        placeholder="partner@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partner-name">Partner's Name</Label>
                      <Input
                        id="partner-name"
                        value={formData.partnerName}
                        onChange={(e) => handleInputChange('partnerName', e.target.value)}
                        placeholder="Partner's first name"
                      />
                    </div>
                  </div>

                  {/* Origin Story */}
                  <div className="space-y-2">
                    <Label htmlFor="origin-story">Your Love Story (Optional)</Label>
                    <Textarea
                      id="origin-story"
                      value={formData.originStory}
                      onChange={(e) => handleInputChange('originStory', e.target.value)}
                      placeholder="How did you meet? What makes your relationship special? This helps Dr. Marcie personalize her advice."
                      rows={3}
                    />
                  </div>

                  {/* Relationship Goals */}
                  <div className="space-y-2">
                    <Label htmlFor="goals">Relationship Goals (Optional)</Label>
                    <Textarea
                      id="goals"
                      value={formData.relationshipGoals}
                      onChange={(e) => handleInputChange('relationshipGoals', e.target.value)}
                      placeholder="What do you hope to achieve together? Better communication, more intimacy, stronger trust?"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Dr. Marcie Personality Level */}
              <div className="space-y-3">
                <Label>Choose Dr. Marcie's Personality Level</Label>
                <div className="grid grid-cols-1 gap-3">
                  {personalityLevels.map((personality) => (
                    <Card 
                      key={personality.level}
                      className={`cursor-pointer transition-all ${
                        formData.drMarcieLevel === personality.level 
                          ? 'ring-2 ring-pink-500 bg-pink-50 dark:bg-pink-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleInputChange('drMarcieLevel', personality.level)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${personality.color} flex items-center justify-center text-white text-xl`}>
                            {personality.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{personality.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{personality.description}</p>
                          </div>
                          {formData.drMarcieLevel === personality.level && (
                            <CheckCircle className="w-6 h-6 text-pink-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={authType === 'create-couple' ? handleCreateCouple : handleSignIn}
                disabled={isLoading || !formData.email || !formData.name}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating your journey...</span>
                  </div>
                ) : (
                  <>
                    {authType === 'create-couple' ? 'Start Our Journey Together' : 
                     authType === 'signup' ? 'Join the Love Revolution' : 'Continue Our Story'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            
            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate__animated animate__bounceIn">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate__animated animate__fadeInUp">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100">
                Love, Actually...
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block">
                  The Game
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
                How About We DON'T Break Up? 💕
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Transform relationship healing into an engaging, competitive experience with 
                <span className="font-semibold text-pink-600 dark:text-pink-400"> Dr. Marcie Liss</span>, 
                your sassy AI therapist who guides couples through interactive challenges with wit, wisdom, and voice synthesis.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate__animated animate__fadeInUp animate__delay-1s">
              <Button
                onClick={() => setIsAuthMode(true)}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Start Playing Together 💕
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-600 dark:text-pink-400 px-8 py-4 text-lg"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Meet Dr. Marcie
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate__animated animate__fadeInUp animate__delay-2s">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">200+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Therapy Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">🆘</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fight Solver</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Couples Love This Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed by relationship experts, powered by AI, and delivered with love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dr. Marcie Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <div className="w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-pink-500" />
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Meet Dr. Marcie Liss
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                Your AI-powered relationship therapist with a 1950s noir aesthetic and modern insights
              </p>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 backdrop-blur-sm">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                  "Listen up, lovebirds... relationships aren't about perfection, they're about showing up with authenticity and a willingness to grow. Now, shall we get started?"
                </blockquote>
                <div className="flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    3 Personality Levels
                  </div>
                  <div className="flex items-center">
                    <Volume2 className="w-4 h-4 mr-1 text-blue-500" />
                    Voice Synthesis
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1 text-green-500" />
                    Personalized Advice
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Save Your Relationship?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of couples who chose love over breaking up
          </p>
          <Button
            onClick={() => setIsAuthMode(true)}
            size="lg"
            className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            How About We DON'T Break Up? 💕
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This is an entertainment platform, not professional therapy. 
              For serious relationship issues, please consult a licensed therapist.
            </p>
            <p className="text-sm">
              Inspired by the Gottman Method and SEEN Method. Made with ❤️ for couples everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;