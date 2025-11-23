'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { DrMarcieAI, DrMarcieResponse, DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface DrMarcieVoiceContextType {
  speakMessage: (
    message: string,
    personalityLevel: DrMarciePersonality,
    contextType?: DrMarcieResponse['contextType'],
    contextData?: any,
    coupleBackstory?: string
  ) => Promise<void>;
  isLoading: boolean;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  currentMessage: string | null;
}

const DrMarcieVoiceContext = createContext<DrMarcieVoiceContextType | undefined>(undefined);

export const useDrMarcieVoice = (): DrMarcieVoiceContextType => {
  const context = useContext(DrMarcieVoiceContext);
  if (!context) {
    throw new Error('useDrMarcieVoice must be used within a DrMarcieVoiceProvider');
  }
  return context;
};

interface DrMarcieVoiceProviderProps {
  children: React.ReactNode;
}

export const DrMarcieVoiceProvider: React.FC<DrMarcieVoiceProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const drMarcieRef = useRef<DrMarcieAI | null>(null);

  const speakMessage = useCallback(async (
    message: string,
    personalityLevel: DrMarciePersonality,
    contextType: DrMarcieResponse['contextType'] = 'general',
    contextData?: any,
    coupleBackstory?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setCurrentMessage(message);

      // Initialize or update Dr. Marcie AI instance
      if (!drMarcieRef.current) {
        drMarcieRef.current = new DrMarcieAI(personalityLevel, coupleBackstory || '');
      } else {
        drMarcieRef.current.updatePersonality(personalityLevel);
        drMarcieRef.current.updateCoupleBackstory(coupleBackstory || '');
      }

      // Generate AI response with voice
      const response = await drMarcieRef.current.generateResponse(message, contextType, contextData);

      if (response.audioUrl) {
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Play new audio
        const audio = new Audio(response.audioUrl);
        audioRef.current = audio;

        audio.onloadstart = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentMessage(null);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setCurrentMessage(null);
          console.error('Audio playback failed');
        };

        await audio.play();
      }
    } catch (error) {
      console.error('Dr. Marcie voice error:', error);
      setCurrentMessage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopSpeaking = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setCurrentMessage(null);
  }, []);

  const contextValue: DrMarcieVoiceContextType = {
    speakMessage,
    isLoading,
    isSpeaking,
    stopSpeaking,
    currentMessage
  };

  return (
    <DrMarcieVoiceContext.Provider value={contextValue}>
      {children}
    </DrMarcieVoiceContext.Provider>
  );
};

export default DrMarcieVoiceProvider;