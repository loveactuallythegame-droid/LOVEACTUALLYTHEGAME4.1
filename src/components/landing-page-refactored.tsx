'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/ui/primary-button';
import GlassCard from '@/components/ui/glass-card';
import DrMarcieAvatar from '@/components/dr-marcie-avatar';
import Confetti from '@/components/ui/confetti';
import HeartLoader from '@/components/ui/heart-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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
  Target,
  Play,
  BookOpen,
  Activity,
  BarChart3,
  Settings
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
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [drMarcieMood, setDrMarcieMood] = useState<'happy' | 'sassy' | 'excited'>('happy');

  const router = useRouter();

  // Cycle through Dr. Marcie moods
  useEffect(() => {
    const moodInterval = setInterval(() => {
      const moods: ('happy' | 'sassy' | 'excited')[] = ['happy', 'sassy', 'excited'];
      setDrMarcieMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000);
    return () => clearInterval(moodInterval);
  }, []);

  const handleInputChange = (field: string, value: string | number): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (formData.email && formData.name) {
        // Show confetti on successful login
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
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
        // Show confetti on successful couple creation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        onUserAuthenticated(formData.email, formData.name, formData.drMarcieLevel);
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, var(--highlight) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 20%, var(--accent) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Confetti Animation */}
        <Confetti trigger={showConfetti} />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <GlassCard className="max-w-2xl w-full mx-auto">
            <div className="p-8 space-y-6">
              {/* Back Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PrimaryButton
                  variant="ghost"
                  onClick={() => setIsAuthMode(false)}
                  className="mb-4"
                >
                  ← Back to Home
                </PrimaryButton>
              </motion.div>

              {/* Header with Dr. Marcie */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <DrMarcieAvatar
                    mood={drMarcieMood}
                    size="lg"
                    showSpeechBubble={true}
                    speechText={authType === 'create-couple' 
                      ? "Let's get you two lovebirds set up!" 
                      : authType === 'signup' 
                      ? "Ready to start your transformation?"
                      : "Welcome back, gorgeous!"}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-3xl font-headers text-primary mb-2">
                    {authType === 'create-couple' ? 'Create Your Couple Account' : 
                     authType === 'signup' ? 'Join the Love Revolution' : 'Welcome Back!'}
                  </h2>
                  <p className="text-lg font-body text-primary/80">
                    {authType === 'create-couple' ? "Let's get you two lovebirds set up!" :
                     authType === 'signup' ? "Ready to start your transformation?" :
                     "Welcome back to the love laboratory!"}
                  </p>
                </motion.div>
              </div>

              {/* Auth Type Selector */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2 p-1 bg-white/20 rounded-full backdrop-blur-sm"
              >
                {['signin', 'signup', 'create-couple'].map((type, index) => (
                  <motion.button
                    key={type}
                    onClick={() => setAuthType(type as any)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-full font-body text-sm transition-all',
                      authType === type 
                        ? 'bg-gradient-main text-white shadow-lg' 
                        : 'text-primary/70 hover:text-primary hover:bg-white/10'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type === 'signin' ? 'Sign In' : 
                     type === 'signup' ? 'Sign Up' : 'New Couple'}
                  </motion.button>
                ))}
              </motion.div>

              {/* Form Fields */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-6"
              >
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-body text-primary">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white/20 border-white/30 text-primary placeholder:text-primary/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-body text-primary">Your Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your first name"
                      className="bg-white/20 border-white/30 text-primary placeholder:text-primary/60"
                    />
                  </div>
                </div>

                {/* Partner Info (for create-couple) */}
                {authType === 'create-couple' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Separator className="bg-white/20" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="partner-email" className="font-body text-primary">Partner's Email</Label>
                        <Input
                          id="partner-email"
                          type="email"
                          value={formData.partnerEmail}
                          onChange={(e) => handleInputChange('partnerEmail', e.target.value)}
                          placeholder="partner@example.com"
                          className="bg-white/20 border-white/30 text-primary placeholder:text-primary/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="partner-name" className="font-body text-primary">Partner's Name</Label>
                        <Input
                          id="partner-name"
                          value={formData.partnerName}
                          onChange={(e) => handleInputChange('partnerName', e.target.value)}
                          placeholder="Partner's first name"
                          className="bg-white/20 border-white/30 text-primary placeholder:text-primary/60"
                        />
                      </div>
                    </div>

                    {/* Origin Story */}
                    <div className="space-y-2">
                      <Label htmlFor="origin-story" className="font-body text-primary">Your Love Story (Optional)</Label>
                      <Textarea
                        id="origin-story"
                        value={formData.originStory}
                        onChange={(e) => handleInputChange('originStory', e.target.value)}
                        placeholder="How did you meet? What makes your relationship special?"
                        rows={3}
                        className="bg-white/20 border-white/30 text-primary placeholder:text-primary/60"
                      />
                    </div>

                    {/* Relationship Goals */}
                    <div className="space-y-2">
                      <Label htmlFor="goals" className="font-body text-primary">Relationship Goals (Optional)</Label>
                      <Textarea
                        id="goals"
                        value={formData.relationshipGoals}
                        onChange={(e) => handleInputChange('relationshipGoals', e.target.value)}
                        placeholder="What do you hope to achieve together?"
                        rows={3}
                        className="bg-white/20 border-white/30 text-primary placeholder:text-primary/60"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Dr. Marcie Personality Level */}
                <div className="space-y-4">
                  <Label className="font-body text-primary">Choose Dr. Marcie's Personality Level</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {personalityLevels.map((personality, index) => (
                      <motion.div
                        key={personality.level}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInputChange('drMarcieLevel', personality.level)}
                          className="cursor-pointer"
                        >
                          <GlassCard
                            className={cn(
                              'transition-all',
                              formData.drMarcieLevel === personality.level 
                                ? 'ring-2 ring-accent shadow-glow' 
                                : 'hover:scale-105'
                            )}
                            tilt={true}
                          >
                            <div className="p-4 flex items-center space-x-4">
                              <div className={cn(
                                'w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-xl',
                                personality.color
                              )}>
                                {personality.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-headers text-primary font-semibold">{personality.title}</h4>
                                <p className="font-body text-primary/80 text-sm">{personality.description}</p>
                              </div>
                              {formData.drMarcieLevel === personality.level && (
                                <CheckCircle className="w-6 h-6 text-accent" />
                              )}
                            </div>
                          </GlassCard>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <PrimaryButton
                    onClick={authType === 'create-couple' ? handleCreateCouple : handleSignIn}
                    disabled={isLoading || !formData.email || !formData.name}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <HeartLoader
                        size="sm"
                        text="Creating your journey..."
                        color="white"
                      />
                    ) : (
                      <>
                        {authType === 'create-couple' ? 'Start Our Journey Together' : 
                         authType === 'signup' ? 'Join the Love Revolution' : 'Continue Our Story'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </PrimaryButton>
                </motion.div>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background with Radial Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, var(--highlight) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, var(--accent) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Confetti for special moments */}
      <Confetti trigger={showConfetti} />

      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-6xl mx-auto text-center space-y-12"
          >
            {/* Animated Logo with Heart Beat */}
            <motion.div
              className="flex justify-center mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-glow">
                <Heart className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Main Heading with Gradient Text */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl md:text-8xl font-headers text-primary leading-tight"
              >
                Love, Actually...
                <span className="gradient-text block text-7xl md:text-9xl">
                  The Game
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-3xl md:text-4xl font-body text-primary/90"
              >
                How About We DON'T Break Up? 💕
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-xl md:text-2xl font-body text-primary/80 max-w-3xl mx-auto"
              >
                Transform relationship healing into an engaging, competitive experience with 
                <span className="font-semibold text-accent"> Dr. Marcie Liss</span>, 
                your glamorous AI therapist who guides couples through interactive challenges with wit, wisdom, and voice synthesis.
              </motion.p>
            </div>

            {/* CTA Buttons with Squishy Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <PrimaryButton
                onClick={() => setIsAuthMode(true)}
                size="lg"
                className="px-10 py-6 text-xl"
              >
                Start Playing Together 💕
                <ArrowRight className="w-6 h-6 ml-3" />
              </PrimaryButton>

              <PrimaryButton
                variant="outline"
                size="lg"
                className="px-10 py-6 text-xl border-accent text-accent hover:bg-accent/10"
              >
                <Volume2 className="w-6 h-6 mr-3" />
                Meet Dr. Marcie
              </PrimaryButton>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-16"
            >
              {[
                { value: '200+', label: 'Therapy Challenges', color: 'text-accent' },
                { value: '24/7', label: 'AI Support', color: 'text-primary' },
                { value: '🆘', label: 'Fight Solver', color: 'text-highlight' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.7 + index * 0.1, type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <div className={cn(
                    'text-4xl md:text-5xl font-headers font-bold mb-2',
                    stat.color
                  )}>
                    {stat.value}
                  </div>
                  <div className="font-body text-primary/70 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section with Glass Cards */}
        <section className="py-20 relative">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-headers text-primary mb-4">
                Why Couples Love This Platform
              </h2>
              <p className="text-xl font-body text-primary/80 max-w-2xl mx-auto">
                Designed by relationship experts, powered by AI, and delivered with love
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <GlassCard
                    className="h-full hover:scale-105 transition-transform"
                    tilt={true}
                    hover={true}
                  >
                    <div className="p-6 space-y-4">
                      <div className={cn(
                        'w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10',
                        'flex items-center justify-center backdrop-blur-sm',
                        feature.color
                      )}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-headers text-primary font-semibold">
                        {feature.title}
                      </h3>
                      <p className="font-body text-primary/80">
                        {feature.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dr. Marcie Section with Avatar */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex justify-center mb-8"
              >
                <DrMarcieAvatar
                  mood={drMarcieMood}
                  size="xl"
                  showSpeechBubble={true}
                  speechText="Listen up, lovebirds... relationships aren't about perfection, they're about showing up with authenticity and a willingness to grow!"
                />
              </motion.div>

              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-headers text-primary mb-6"
                >
                  Meet Dr. Marcie Liss
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-body text-primary/90 mb-8"
                >
                  Your AI-powered relationship therapist with a 1950s noir aesthetic and modern insights
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <GlassCard className="max-w-2xl mx-auto">
                    <div className="p-8 space-y-6">
                      <blockquote className="text-xl font-marcie text-primary italic text-center">
                        "Listen up, lovebirds... relationships aren't about perfection, they're about showing up with authenticity and a willingness to grow. Now, shall we get started?"
                      </blockquote>
                      <div className="flex justify-center space-x-8 text-sm">
                        <div className="flex items-center font-body">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          3 Personality Levels
                        </div>
                        <div className="flex items-center font-body">
                          <Volume2 className="w-4 h-4 mr-2 text-blue-500" />
                          Voice Synthesis
                        </div>
                        <div className="flex items-center font-body">
                          <Target className="w-4 h-4 mr-2 text-green-500" />
                          Personalized Advice
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 shadow-glow"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-headers text-white mb-6"
              >
                Ready to Save Your Relationship?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl text-white/90 mb-8 font-body"
              >
                Join thousands of couples who chose love over breaking up
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              >
                <PrimaryButton
                  onClick={() => setIsAuthMode(true)}
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100 px-12 py-6 text-2xl font-headers"
                >
                  How About We DON'T Break Up? 💕
                  <ArrowRight className="w-6 h-6 ml-3" />
                </PrimaryButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 relative">
          <div className="max-w-6xl mx-auto px-4">
            <GlassCard className="text-center">
              <div className="p-6 space-y-4">
                <p className="font-body text-primary/80 text-sm">
                  <strong>Disclaimer:</strong> This is an entertainment platform, not professional therapy. 
                  For serious relationship issues, please consult a licensed therapist.
                </p>
                <p className="font-body text-primary/60 text-xs">
                  Inspired by the Gottman Method and SEEN Method. Made with ❤️ for couples everywhere.
                </p>
              </div>
            </GlassCard>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;