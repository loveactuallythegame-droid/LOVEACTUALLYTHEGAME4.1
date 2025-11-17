'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Sparkles, Heart, MessageCircle, Clipboard } from 'lucide-react';
import { DrMarcieAI, DrMarcieResponse, DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface EnhancedDrMarcieAvatarProps {
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onResponseReceived?: (response: DrMarcieResponse) => void;
  autoSpeak?: boolean;
  className?: string;
  hostingContext?: 'game_intro' | 'feedback' | 'fight_solver' | 'general' | 'challenge_grading' | 'intro' | 'playing' | 'waiting' | 'results' | 'complete' | 'dashboard';
  contextData?: any;
  initialMessage?: string;
  autoGreeting?: boolean;
  expression?: 'happy' | 'analytical' | 'concerned' | 'pleased' | 'serious' | 'surprised';
  showSpeechBubble?: boolean;
}

const EnhancedDrMarcieAvatar: React.FC<EnhancedDrMarcieAvatarProps> = ({
  personalityLevel,
  coupleBackstory = '',
  onResponseReceived,
  autoSpeak = true,
  className = '',
  hostingContext = 'general',
  contextData,
  initialMessage,
  autoGreeting = false,
  expression = 'happy',
  showSpeechBubble = true
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<DrMarcieResponse | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hasSpoken, setHasSpoken] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [drMarcie] = useState<DrMarcieAI>(() => new DrMarcieAI(personalityLevel, coupleBackstory));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    drMarcie.updatePersonality(personalityLevel);
    drMarcie.updateCoupleBackstory(coupleBackstory);
  }, [personalityLevel, coupleBackstory, drMarcie]);

  // Auto-greeting effect when Dr. Marcie appears
  useEffect(() => {
    if (autoGreeting && !hasSpoken) {
      const timer = setTimeout(() => {
        generateContextualGreeting();
      }, 1000); // 1 second delay to let the UI settle
      return () => clearTimeout(timer);
    }
  }, [autoGreeting, hasSpoken, hostingContext]);

  const getPersonalityBadge = (level: DrMarciePersonality): { label: string; color: string } => {
    switch (level) {
      case 1:
        return { label: 'Tough Love Rookie', color: 'bg-green-500' };
      case 2:
        return { label: 'Reality Check Specialist', color: 'bg-yellow-500' };
      case 3:
        return { label: 'Radical Truth Wizard', color: 'bg-red-500' };
      default:
        return { label: 'Therapist', color: 'bg-blue-500' };
    }
  };

  const playAudio = async (audioUrl: string): Promise<void> => {
    try {
      setAudioPlaying(true);
      setIsAnimating(true);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setAudioPlaying(false);
        setIsAnimating(false);
      };
      
      audio.onerror = () => {
        setAudioPlaying(false);
        setIsAnimating(false);
        console.error('Audio playback failed');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setAudioPlaying(false);
      setIsAnimating(false);
    }
  };

  const generateContextualGreeting = async (): Promise<void> => {
    const greetingPrompts = {
      game_intro: initialMessage || "Welcome to this relationship game! Let me introduce what you'll be doing together.",
      feedback: "Time for my expert analysis of your performance!",
      fight_solver: "Well, well, well... looks like someone needs my help sorting out a little disagreement.",
      challenge_grading: "Let me give you my professional assessment of how you did.",
      intro: initialMessage || "Welcome! I'm here to guide you through this activity step by step.",
      playing: initialMessage || "Great! Now let's dive into the questions. I'll be right here with you.",
      waiting: initialMessage || "Hang tight while your partner finishes up. I'm analyzing everything for you both.",
      results: initialMessage || "Fantastic work! Let me share your results and what they mean for your relationship.",
      complete: initialMessage || "Congratulations on completing this journey together! Here's what I observed.",
      dashboard: initialMessage || "Hello there, lovebirds! Dr. Marcie here, ready to help with your relationship journey.",
      general: initialMessage || "Hello there, lovebirds! Dr. Marcie here, ready to help with your relationship journey."
    };

    const prompt = greetingPrompts[hostingContext as keyof typeof greetingPrompts] || greetingPrompts.general;
    await generateResponse(prompt, hostingContext, contextData);
  };

  const generateResponse = async (
    prompt: string,
    contextType: DrMarcieResponse['contextType'] = 'general',
    additionalContext?: any
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await drMarcie.generateResponse(prompt, contextType, additionalContext);
      setCurrentResponse(response);
      setHasSpoken(true);
      
      if (onResponseReceived) {
        onResponseReceived(response);
      }

      if (autoSpeak && response.audioUrl) {
        await playAudio(response.audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate Dr. Marcie response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const personalityInfo = getPersonalityBadge(personalityLevel);

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 ${className}`}>
      <CardContent className="p-6">
        {/* Avatar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className="relative cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Dr. Marcie's Gorgeous Avatar Image */}
              <div 
                className={`w-20 h-20 rounded-full overflow-hidden border-4 border-gradient-to-br from-pink-400 to-purple-500 transition-all duration-500 ${
                  isAnimating ? 'animate-bounce shadow-2xl scale-110 animate__subtle-glow' : 
                  isHovering ? 'scale-105 shadow-xl animate__gentle-pulse' : 'animate__float shadow-lg animate__subtle-glow'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #f472b6, #a855f7)',
                  padding: '4px'
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {/* Generated Dr. Marcie Avatar Image */}
                  <img 
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/efd80c25-5b0e-4777-a757-13e03830fcba-5dZzAQYpcomryEQnd5LAMQ43cAKG5T"
                    alt="Dr. Marcie Liss - AI Therapist"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      audioPlaying ? 'scale-110 brightness-110' : ''
                    }`}
                    style={{
                      filter: audioPlaying ? 'drop-shadow(0 0 20px rgba(244, 114, 182, 0.8))' : 
                              expression === 'analytical' ? 'brightness(0.9) saturate(1.2)' :
                              expression === 'concerned' ? 'brightness(0.8) sepia(0.2)' :
                              expression === 'pleased' ? 'brightness(1.1) saturate(1.3)' :
                              expression === 'serious' ? 'brightness(0.85) contrast(1.1)' :
                              expression === 'surprised' ? 'brightness(1.2) saturate(1.4)' : ''
                    }}
                  />
                  
                  {/* Overlay Effects */}
                  {audioPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-500/20 animate-pulse rounded-full"></div>
                  )}
                  
                  {isHovering && !audioPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300/10 to-purple-400/10 rounded-full"></div>
                  )}
                </div>
              </div>
              
              {/* Digital Clipboard Prop */}
              <div className={`absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-300 ${
                isAnimating ? 'animate-spin scale-110' : isHovering ? 'scale-105' : 'animate-pulse'
              }`}>
                <Clipboard className="w-3 h-3 text-pink-500" />
              </div>
              
              {/* Loading Animation Ring */}
              {isLoading && (
                <div className="absolute -inset-2 rounded-full border-3 border-pink-400 border-t-transparent animate-spin opacity-80" />
              )}
              
              {/* Speaking Animation Rings */}
              {audioPlaying && (
                <>
                  <div className="absolute -inset-3 rounded-full border-2 border-purple-400 animate-ping opacity-60" />
                  <div className="absolute -inset-4 rounded-full border-2 border-pink-400 animate-ping opacity-40" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute -inset-5 rounded-full border-2 border-purple-300 animate-ping opacity-20" style={{ animationDelay: '0.4s' }} />
                </>
              )}
              
              {/* Floating Hearts when speaking */}
              {audioPlaying && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <Heart className="w-4 h-4 text-pink-500 animate-bounce" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                Dr. Marcie Liss
                {audioPlaying && (
                  <MessageCircle className="w-4 h-4 ml-2 text-purple-500 animate-bounce" />
                )}
              </h3>
              <Badge className={`${personalityInfo.color} text-white text-xs mb-1 transition-all duration-300 ${
                audioPlaying ? 'animate-pulse scale-105' : ''
              }`}>
                {personalityInfo.label}
              </Badge>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-pink-400" />
                Relationship Therapist • 1950s Noir Aesthetic
              </div>
            </div>
          </div>
          
          {/* Voice Controls */}
          <div className="flex flex-col items-end space-y-2">
            {currentResponse?.audioUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => currentResponse.audioUrl && playAudio(currentResponse.audioUrl)}
                disabled={audioPlaying}
                className={`text-pink-600 hover:text-pink-700 transition-all duration-300 ${
                  audioPlaying ? 'animate-pulse scale-110' : ''
                }`}
              >
                {audioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            )}
            
            {/* Context Badge */}
            {hostingContext !== 'general' && (
              <Badge variant="outline" className="text-xs text-purple-600 dark:text-purple-400 animate__animated animate__fadeInRight">
                {hostingContext.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>

        {/* Response Display */}
        {(currentResponse || initialMessage) && showSpeechBubble && (
          <div className="space-y-3 animate__animated animate__fadeInUp">
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-pink-200 dark:border-pink-800 relative transition-all duration-300 ${
              audioPlaying ? 'shadow-lg border-purple-300 dark:border-purple-700' : ''
            }`}>
              {/* Speech bubble tail */}
              <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-pink-200 dark:border-pink-800 transform rotate-45"></div>
              
              <p className={`text-gray-900 dark:text-gray-100 leading-relaxed italic transition-all duration-300 ${
                audioPlaying ? 'text-purple-800 dark:text-purple-200' : ''
              }`}>
                "{currentResponse?.text || initialMessage}"
              </p>
              
              {/* Hosting Context Indicator */}
              {hostingContext !== 'general' && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Hosting: {hostingContext.replace('_', ' ')}
                </div>
              )}
            </div>
            
            {/* Voice Indicator */}
            {audioPlaying && (
              <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400 animate__animated animate__pulse">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-7 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm font-medium">Dr. Marcie is speaking...</span>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 text-pink-600 dark:text-pink-400 py-4 animate__animated animate__fadeIn">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-sm">Dr. Marcie is formulating her response...</span>
          </div>
        )}

        {/* Initial State */}
        {!currentResponse && !isLoading && !autoGreeting && (
          <div className="text-center py-4 animate__animated animate__fadeIn">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
              <Sparkles className="w-5 h-5 text-purple-500 animate-bounce" />
              <Heart className="w-5 h-5 text-pink-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ready to provide relationship guidance with style! 💖
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              1950s noir meets modern therapy
            </p>
          </div>
        )}

        {/* Manual Trigger (for testing) */}
        {!currentResponse && !isLoading && !autoGreeting && (
          <div className="text-center mt-4">
            <Button
              onClick={() => generateContextualGreeting()}
              size="sm"
              variant="outline"
              className="text-pink-600 border-pink-300 hover:bg-pink-50 transition-all duration-300 hover:scale-105"
            >
              Say Hello! 👋
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDrMarcieAvatar;
export { EnhancedDrMarcieAvatar };
export type { EnhancedDrMarcieAvatarProps };