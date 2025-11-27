'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Minimize2, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Settings,
  Heart,
  Brain,
  Sparkles,
  Mic,
  MicOff,
  Camera,
  CameraOff
} from 'lucide-react';
import { EnhancedDrMarcieAvatar } from './enhanced-dr-marcie-avatar';
import { DrMarciePersonality } from '@/lib/dr-marcie-ai';
// Fallback for missing module
class AdvancedAnalyticsEngine {
  constructor(config?: any) {
    console.log('AdvancedAnalyticsEngine initialized with:', config);
  }
  
  static trackEvent(event: string, data: any) {
    console.log('Analytics event:', event, data);
  }
  
  static getUserEngagement() {
    return { score: 75, level: 'engaged' };
  }
  
  adaptRealTime(session: any) {
    console.log('Adapting real-time:', session);
    return { suggestions: ['Keep being authentic', 'Try deeper vulnerability'] };
  }
  
  recognizePatterns() {
    console.log('Recognizing patterns');
    return { patterns: ['High engagement', 'Consistent vulnerability'] };
  }
  
  analyzeEmotionalIntelligence() {
    console.log('Analyzing emotional intelligence');
    return { eqScore: 85, strengths: ['Empathy', 'Communication'] };
  }
  
  generateContextualResponse(context: any) {
    console.log('Generating contextual response:', context);
    return {
      response: "I can see you're making great progress in your relationship journey. Keep being authentic and vulnerable with each other.",
      tone: "encouraging",
      suggestions: ["Try the 'Truth or Trust' game next", "Consider exploring your love languages"]
    };
  }
  
  persistMemory(memory: any) {
    console.log('Persisting memory:', memory);
    return { success: true };
  }
}

// Original import - commented out for now
// import { AdvancedAnalyticsEngine } from '@/lib/advanced-analytics-engine';

interface PersistentAvatarOverlayProps {
  userId: string;
  coupleId: string;
  userName: string;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  isVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
}

export function PersistentAvatarOverlay({
  userId,
  coupleId,
  userName,
  personalityLevel,
  coupleBackstory,
  isVisible = true,
  onToggleVisibility
}: PersistentAvatarOverlayProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentContext, setCurrentContext] = useState<string>('dashboard');
  const [realtimeAdaptations, setRealtimeAdaptations] = useState<any>(null);
  const [behavioralPatterns, setBehavioralPatterns] = useState<any[]>([]);
  const [emotionalIntelligence, setEmotionalIntelligence] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  
  const analyticsEngine = useRef<AdvancedAnalyticsEngine | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize advanced analytics engine
    analyticsEngine.current = new AdvancedAnalyticsEngine();

    // Start continuous pattern recognition
    startContinuousAnalysis();

    // Set up speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setupSpeechRecognition();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [userId, coupleId]);

  useEffect(() => {
    // Real-time adaptation based on user interaction patterns
    const adaptationInterval = setInterval(async () => {
      if (analyticsEngine.current) {
        const currentSession = {
          userId,
          startTime: sessionStartTime,
          interactionCount,
          currentContext,
          duration: Date.now() - sessionStartTime.getTime()
        };

        const adaptations = await analyticsEngine.current.adaptRealTime(currentSession);
        setRealtimeAdaptations(adaptations);
      }
    }, 30000); // Adapt every 30 seconds

    return () => clearInterval(adaptationInterval);
  }, [interactionCount, currentContext]);

  const startContinuousAnalysis = async () => {
    if (!analyticsEngine.current) return;

    try {
      setIsAnalyzing(true);

      // Recognize behavioral patterns
      const patterns = await analyticsEngine.current.recognizePatterns();
      setBehavioralPatterns(patterns.patterns || []);

      // Analyze emotional intelligence
      const emotionalProfile = await analyticsEngine.current.analyzeEmotionalIntelligence();
      setEmotionalIntelligence(emotionalProfile);

    } catch (error) {
      console.error('Error in continuous analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      await handleVoiceInput(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    setInteractionCount(prev => prev + 1);
    
    if (analyticsEngine.current) {
      // Generate contextual response with real-time adaptation
      const response = await analyticsEngine.current.generateContextualResponse({
        userMessage: transcript,
        contextType: currentContext,
        recentHistory: [], // Would be populated from actual history
        relationshipData: { coupleBackstory },
        emotionalState: emotionalIntelligence
      });

      // Persist interaction for continuous learning
      await analyticsEngine.current.persistMemory({
        contextType: currentContext,
        userMessage: transcript,
        response: response.response,
        personalityLevel,
        conversationId: `session_${sessionStartTime.getTime()}`,
        emotionalSignificance: 0.85
      });
    }
  };

  const handleContextChange = (newContext: string) => {
    setCurrentContext(newContext);
    setInteractionCount(prev => prev + 1);
  };

  const getAdaptationIndicator = () => {
    if (!realtimeAdaptations) return null;

    const { difficultyAdjustment, paceAdjustment } = realtimeAdaptations;
    if (difficultyAdjustment > 0.1) return { type: 'increase', color: 'bg-orange-500' };
    if (difficultyAdjustment < -0.1) return { type: 'decrease', color: 'bg-green-500' };
    if (paceAdjustment > 1.1) return { type: 'faster', color: 'bg-blue-500' };
    if (paceAdjustment < 0.9) return { type: 'slower', color: 'bg-purple-500' };
    return null;
  };

  const getEmotionalIntelligenceIndicator = () => {
    if (!emotionalIntelligence) return 'Analyzing...';
    
    const avgScore = (
      emotionalIntelligence.empathyScore +
      emotionalIntelligence.emotionalRegulation +
      emotionalIntelligence.communicationEfficiency
    ) / 3;

    if (avgScore >= 8) return 'High EQ 🌟';
    if (avgScore >= 6) return 'Good EQ 💚';
    return 'Developing EQ 📈';
  };

  const getBehavioralPatternSummary = () => {
    if (behavioralPatterns.length === 0) return 'Learning patterns...';
    
    const strongPatterns = behavioralPatterns.filter(p => p.strength > 0.7);
    if (strongPatterns.length === 0) return 'Subtle patterns detected';
    
    return `${strongPatterns.length} strong patterns identified`;
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-80 max-w-sm'
    }`}>
      <Card className="bg-gradient-to-br from-pink-50/95 to-purple-50/95 dark:from-pink-950/95 dark:to-purple-950/95 backdrop-blur-md border-pink-200/50 dark:border-pink-800/50 shadow-2xl">
        <CardContent className={`${isMinimized ? 'p-2' : 'p-4'} space-y-3`}>
          
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            {!isMinimized && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Dr. Marcie Online
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              {!isMinimized && (
                <>
                  {/* Voice Recognition Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleListening}
                    className={`h-6 w-6 p-0 ${
                      isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'
                    }`}
                  >
                    {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  </Button>

                  {/* Voice Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`h-6 w-6 p-0 ${
                      isVoiceEnabled ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {isVoiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                  </Button>
                </>
              )}

              {/* Minimize/Maximize Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Dr. Marcie Avatar */}
              <div className="relative">
                <EnhancedDrMarcieAvatar
                  personalityLevel={personalityLevel}
                  coupleBackstory={coupleBackstory}
                  autoSpeak={isVoiceEnabled}
                  className="w-full"
                  hostingContext={currentContext as any}
                  autoGreeting={false}
                  showSpeechBubble={true}
                />

                {/* Real-time Adaptation Indicator */}
                {getAdaptationIndicator() && (
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getAdaptationIndicator()?.color} animate-pulse`}></div>
                )}
              </div>

              {/* Advanced Analytics Display */}
              <div className="space-y-2">
                {/* Behavioral Patterns */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Brain className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-600 dark:text-gray-400">Patterns:</span>
                  </div>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    {getBehavioralPatternSummary()}
                  </span>
                </div>

                {/* Emotional Intelligence */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-pink-500" />
                    <span className="text-gray-600 dark:text-gray-400">EQ:</span>
                  </div>
                  <span className="text-pink-600 dark:text-pink-400 font-medium">
                    {getEmotionalIntelligenceIndicator()}
                  </span>
                </div>

                {/* Session Analytics */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Session:</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {interactionCount} interactions
                  </span>
                </div>
              </div>

              {/* Context Indicators */}
              <div className="flex flex-wrap gap-1">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                >
                  {currentContext}
                </Badge>
                
                {isAnalyzing && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse"
                  >
                    Analyzing...
                  </Badge>
                )}
                
                {isListening && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse"
                  >
                    Listening
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContextChange('daily_metrics')}
                  className="h-8 px-3 text-xs"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Metrics
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContextChange('fight_solver')}
                  className="h-8 px-3 text-xs"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Resolve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContextChange('romance_redemption')}
                  className="h-8 px-3 text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Romance
                </Button>
              </div>
            </>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/efd80c25-5b0e-4777-a757-13e03830fcba-5dZzAQYpcomryEQnd5LAMQ43cAKG5T"
                      alt="Dr. Marcie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Activity Indicator */}
                {isAnalyzing && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="h-2 w-2 text-white animate-pulse" />
                  </div>
                )}
                
                {isListening && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Mic className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PersistentAvatarOverlay;