'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton } from '@/components/ui/primary-button';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { Confetti } from '@/components/ui/confetti';
import { HeartLoader } from '@/components/ui/heart-loader';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const steps = [
    {
      title: "Welcome to Love, Actually... The Game",
      subtitle: "A gloriously chaotic couples game from Dr. Marcie Liss, for partners who love each other enough to press start.",
      mood: "happy" as const,
      showHeart: true
    },
    {
      title: "Your Relationship's Favorite Game Night",
      subtitle: "You and your partner will co-create an Origin Story, take a brutally honest-yet-playful State of the Union, and unlock missions designed to turn 'ugh' moments into inside jokes.",
      mood: "sassy" as const,
      showHeart: false
    },
    {
      title: "Ready to Turn Chaos into Connection?",
      subtitle: "Zero scoring, maximum honesty. Designed by a real doctor, not an influencer. Play on your couch... or wherever.",
      mood: "excited" as const,
      showHeart: true
    }
  ];

  useEffect(() => {
    if (currentStep === steps.length - 1) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  const handleSkip = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const currentStepData = steps[currentStep];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <HeartLoader 
          text="Loading your relationship journey..."
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(255, 255, 255, 0.7) 0, rgba(255, 255, 255, 0.7) 6px, transparent 7px),
            radial-gradient(circle at 80px 60px, rgba(250, 31, 99, 0.35) 0, rgba(250, 31, 99, 0.35) 10px, transparent 11px)
          `,
          backgroundSize: '120px 120px'
        }} />
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti trigger={showConfetti} />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <GlassCard className="p-8 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  LA
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-purple-900">Love, Actually...</h1>
                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">The Game</span>
                </div>
              </div>
              <div className="text-sm text-purple-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-600' 
                      : index < currentStep
                      ? 'w-2 bg-purple-400'
                      : 'w-2 bg-purple-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="text-center mb-12">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Dr. Marcie Avatar */}
                <div className="flex justify-center">
                  <EnhancedDrMarcieAvatar
                    mood={currentStepData.mood}
                    size="large"
                    className="shadow-2xl"
                  />
                </div>

                {/* Heart Animation */}
                {currentStepData.showHeart && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3
                    }}
                    className="flex justify-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl shadow-xl">
                      💖
                    </div>
                  </motion.div>
                )}

                <h2 className="text-3xl md:text-4xl font-bold text-purple-900 leading-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-lg text-purple-700 max-w-2xl mx-auto leading-relaxed">
                  {currentStepData.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PrimaryButton
                onClick={handleSkip}
                variant="outline"
                size="lg"
                className="min-w-[160px]"
              >
                Skip intro
              </PrimaryButton>
              <PrimaryButton
                onClick={handleNext}
                variant="default"
                size="lg"
                className="min-w-[160px]"
              >
                {currentStep === steps.length - 1 ? 'Start Your Journey' : 'Next'}
              </PrimaryButton>
            </div>

            {/* Features */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                Zero scoring, maximum honesty
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Designed by a real doctor
              </span>
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Play on your couch
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
