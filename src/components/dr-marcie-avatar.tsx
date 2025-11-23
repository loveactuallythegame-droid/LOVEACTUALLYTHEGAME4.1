'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { DrMarcieAI, DrMarcieResponse, DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface DrMarcieAvatarProps {
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onResponseReceived?: (response: DrMarcieResponse) => void;
  autoSpeak?: boolean;
  className?: string;
}

const DrMarcieAvatar: React.FC<DrMarcieAvatarProps> = ({
  personalityLevel,
  coupleBackstory = '',
  onResponseReceived,
  autoSpeak = true,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<DrMarcieResponse | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [drMarcie] = useState<DrMarcieAI>(() => new DrMarcieAI(personalityLevel, coupleBackstory));

  useEffect(() => {
    drMarcie.updatePersonality(personalityLevel);
    drMarcie.updateCoupleBackstory(coupleBackstory);
  }, [personalityLevel, coupleBackstory, drMarcie]);

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
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => setAudioPlaying(false);
      
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setAudioPlaying(false);
    }
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
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Dr. Marcie Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/efd80c25-5b0e-4777-a757-13e03830fcba-5dZzAQYpcomryEQnd5LAMQ43cAKG5T"
                    alt="Dr. Marcie Liss - AI Therapist"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {isLoading && (
                <div className="absolute -inset-1 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Dr. Marcie Liss</h3>
              <Badge className={`${personalityInfo.color} text-white text-xs`}>
                {personalityInfo.label}
              </Badge>
            </div>
          </div>
          
          {currentResponse?.audioUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentResponse.audioUrl && playAudio(currentResponse.audioUrl)}
              disabled={audioPlaying}
              className="text-pink-600 hover:text-pink-700"
            >
              {audioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* Response Display */}
        {currentResponse && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-pink-200 dark:border-pink-800">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {currentResponse.text}
              </p>
            </div>
            
            {currentResponse.contextType && (
              <div className="flex justify-end">
                <Badge variant="outline" className="text-xs text-pink-600 dark:text-pink-400">
                  {currentResponse.contextType.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-pink-600 dark:text-pink-400">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="text-sm">Dr. Marcie is thinking...</span>
          </div>
        )}

        {/* Initial State */}
        {!currentResponse && !isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ready to help with your relationship journey! 💖
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};