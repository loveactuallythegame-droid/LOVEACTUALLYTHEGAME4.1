'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Brain, 
  Play, 
  Check, 
  Clock, 
  Volume2, 
  VolumeX,
  Zap,
  Star,
  Target,
  MessageCircle,
  Award,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import type { DrMarciePersonality } from '@/lib/dr-marcie-ai';
// Fallback types for missing module
interface ComprehensiveActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  type?: string;
  estimatedTime?: number;
  pointValue?: number;
  questions?: ComprehensiveActivityQuestion[];
}

interface ComprehensiveActivityQuestion {
  id: string;
  type: string;
  prompt: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  pointValue?: number;
  timeLimit?: number;
}

// Original import - commented out for now
// import type { ComprehensiveActivity, ComprehensiveActivityQuestion } from '@/lib/omnipresent-dr-marcie';

interface OmnipresentActivityInterfaceProps {
  coupleId: string;
  userId: string;
  personalityLevel: DrMarciePersonality;
  activity: ComprehensiveActivity;
  coupleBackstory?: string;
  onActivityComplete: (results: ActivityResults) => void;
  onPointsEarned: (points: number) => void;
}

interface ActivityResults {
  activityId: string;
  completed: boolean;
  totalScore: number;
  maxPossible: number;
  timeSpent: number;
  insights: string[];
  drMarcieGrade: string;
}

interface ActivityState {
  phase: 'intro' | 'playing' | 'waiting' | 'results' | 'complete';
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  scores: { [questionId: string]: number };
  drMarcieResponses: { [questionId: string]: string };
  hostingSessionId?: string;
  partnerStatus: 'waiting' | 'active' | 'completed';
  timeStarted: number;
}

const OmnipresentActivityInterface: React.FC<OmnipresentActivityInterfaceProps> = ({
  coupleId,
  userId,
  personalityLevel,
  activity,
  coupleBackstory,
  onActivityComplete,
  onPointsEarned
}) => {
  const [state, setState] = useState<ActivityState>({
    phase: 'intro',
    currentQuestionIndex: 0,
    answers: {},
    scores: {},
    drMarcieResponses: {},
    partnerStatus: 'waiting',
    timeStarted: Date.now()
  });

  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [drMarcieIntro, setDrMarcieIntro] = useState<any>(null);
  const [currentQuestionDelivery, setCurrentQuestionDelivery] = useState<any>(null);
  const [realtimeResponse, setRealtimeResponse] = useState<any>(null);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [sessionId] = useState<string>(`activity_${Date.now()}_${userId}`);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize activity hosting on mount
  useEffect(() => {
    initializeActivityHosting();
  }, []);

  // Auto-play Dr. Marcie's voice when new messages arrive
  useEffect(() => {
    if (audioEnabled && audioRef.current && (drMarcieIntro?.audioUrl || currentQuestionDelivery?.audioUrl || realtimeResponse?.audioUrl || finalResults?.audioUrl)) {
      const audioUrl = drMarcieIntro?.audioUrl || currentQuestionDelivery?.audioUrl || realtimeResponse?.audioUrl || finalResults?.audioUrl;
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(console.error);
    }
  }, [drMarcieIntro, currentQuestionDelivery, realtimeResponse, finalResults, audioEnabled]);

  const initializeActivityHosting = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/omnipresent-hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_activity_hosting',
          sessionId,
          coupleId,
          userId,
          personalityLevel,
          activityId: activity.id,
          coupleBackstory
        }),
      });

      const data = await response.json();
      if (data.success) {
        setDrMarcieIntro(data.introduction);
        setState(prev => ({
          ...prev,
          hostingSessionId: data.hostingSession?.id
        }));
      }
    } catch (error) {
      console.error('Error initializing activity hosting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startActivity = async (): Promise<void> => {
    setState(prev => ({ ...prev, phase: 'playing' }));
    await deliverNextQuestion();
  };

  const deliverNextQuestion = async (): Promise<void> => {
    if (state.currentQuestionIndex >= activity.questions.length) {
      await completeActivity();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/omnipresent-hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deliver_question',
          sessionId,
          coupleId,
          userId,
          personalityLevel,
          activityId: activity.id,
          questionIndex: state.currentQuestionIndex,
          hostingSessionId: state.hostingSessionId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentQuestionDelivery(data.questionDelivery);
        setRealtimeResponse(null);
      }
    } catch (error) {
      console.error('Error delivering question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (): Promise<void> => {
    if (!currentAnswer.trim()) return;

    const currentQuestion = activity.questions[state.currentQuestionIndex];
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/omnipresent-hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_response',
          sessionId,
          coupleId,
          userId,
          personalityLevel,
          activityId: activity.id,
          questionId: currentQuestion.id,
          userAnswer: currentAnswer,
          hostingSessionId: state.hostingSessionId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRealtimeResponse(data.realTimeResponse);
        
        // Update state with answer and score
        setState(prev => ({
          ...prev,
          answers: { ...prev.answers, [currentQuestion.id]: currentAnswer },
          scores: { ...prev.scores, [currentQuestion.id]: data.pointsEarned },
          drMarcieResponses: { ...prev.drMarcieResponses, [currentQuestion.id]: data.realTimeResponse.text }
        }));

        // Notify parent of points earned
        onPointsEarned(data.pointsEarned);

        // Clear current answer and move to next question after brief delay
        setCurrentAnswer('');
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1
          }));
          deliverNextQuestion();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeActivity = async (): Promise<void> => {
    const totalScore = Object.values(state.scores).reduce((sum, score) => sum + score, 0);
    const maxPossible = activity.questions.reduce((sum, q) => sum + q.pointValue, 0);

    setIsLoading(true);
    try {
      const response = await fetch('/api/omnipresent-hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deliver_results',
          sessionId,
          coupleId,
          personalityLevel,
          finalScores: { partner1: totalScore, partner2: 0 }, // Single player for now
          totalPossible: maxPossible,
          activityId: activity.id,
          hostingSessionId: state.hostingSessionId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFinalResults(data.resultsResponse);
        setState(prev => ({ ...prev, phase: 'results' }));

        // Calculate results
        const timeSpent = Math.floor((Date.now() - state.timeStarted) / 1000);
        const results: ActivityResults = {
          activityId: activity.id,
          completed: true,
          totalScore,
          maxPossible,
          timeSpent,
          insights: data.insights ? [data.insights] : [],
          drMarcieGrade: data.insights?.performanceLevel || 'good'
        };

        // Notify parent component
        setTimeout(() => {
          onActivityComplete(results);
        }, 3000);
      }
    } catch (error) {
      console.error('Error completing activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionInput = (question: ComprehensiveActivityQuestion): React.ReactNode => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={currentAnswer === option ? "default" : "outline"}
                className="w-full text-left justify-start p-4 h-auto"
                onClick={() => setCurrentAnswer(option)}
              >
                <span className="mr-3 text-purple-500">•</span>
                {option}
              </Button>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={currentAnswer === 'true' ? "default" : "outline"}
              className="p-6 h-auto"
              onClick={() => setCurrentAnswer('true')}
            >
              <Check className="w-5 h-5 mr-2" />
              True
            </Button>
            <Button
              variant={currentAnswer === 'false' ? "default" : "outline"}
              className="p-6 h-auto"
              onClick={() => setCurrentAnswer('false')}
            >
              <span className="w-5 h-5 mr-2 text-red-500">✕</span>
              False
            </Button>
          </div>
        );

      case 'likert_scale':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(value => (
                <Button
                  key={value}
                  variant={currentAnswer === value.toString() ? "default" : "outline"}
                  className="aspect-square p-2"
                  onClick={() => setCurrentAnswer(value.toString())}
                >
                  {value}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        );

      case 'essay':
        return (
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Share your thoughts openly and honestly..."
            className="min-h-[120px] resize-none"
            rows={6}
          />
        );

      case 'numerical':
        return (
          <Input
            type="number"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter a number..."
            className="text-center text-lg"
          />
        );

      default:
        return (
          <Input
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="text-lg"
          />
        );
    }
  };

  const getDifficultyColor = (difficulty: number): string => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-blue-500',
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getDifficultyLabel = (difficulty: number): string => {
    const labels = {
      1: 'Beginner',
      2: 'Easy',
      3: 'Moderate',
      4: 'Challenging',
      5: 'Advanced'
    };
    return labels[difficulty as keyof typeof labels];
  };

  const currentQuestion = activity.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex) / activity.questions.length) * 100;
  const totalScore = Object.values(state.scores).reduce((sum, score) => sum + score, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Hidden audio element for Dr. Marcie's voice */}
        <audio ref={audioRef} style={{ display: 'none' }} />
        
        {/* Header with Activity Info */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                  {activity.type === 'quiz' && <Brain className="w-6 h-6" />}
                  {activity.type === 'game' && <Target className="w-6 h-6" />}
                  {activity.type === 'challenge' && <Zap className="w-6 h-6" />}
                  {activity.type === 'reflection' && <Heart className="w-6 h-6" />}
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                    {activity.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge className={`${getDifficultyColor(activity.difficulty)} text-white`}>
                      {getDifficultyLabel(activity.difficulty)}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.estimatedTime} min
                    </Badge>
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      {activity.pointValue} points
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                {state.phase !== 'intro' && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Score</div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {totalScore} pts
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Bar */}
        {state.phase !== 'intro' && (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress: Question {state.currentQuestionIndex} of {activity.questions.length}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Dr. Marcie Omnipresent Hosting */}
        <div className="space-y-6">
          <EnhancedDrMarcieAvatar
            personalityLevel={personalityLevel}
            coupleBackstory={coupleBackstory}
            className="animate__animated animate__fadeIn"
            hostingContext={state.phase}
            autoGreeting={false}
            initialMessage={
              drMarcieIntro?.text || 
              currentQuestionDelivery?.text || 
              realtimeResponse?.text || 
              finalResults?.text ||
              "Welcome! I'm here to guide you through this activity."
            }
            expression={
              state.phase === 'intro' ? 'happy' :
              state.phase === 'playing' ? 'analytical' :
              state.phase === 'results' ? 'pleased' : 'happy'
            }
            showSpeechBubble={true}
          />

          {/* Introduction Phase */}
          {state.phase === 'intro' && (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate__animated animate__fadeInUp">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="text-6xl">✨</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Ready to Begin?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="font-semibold">Dr. Marcie Hosting</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        I'll guide you through every question
                      </div>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                      <div className="font-semibold">Real-time Feedback</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Get immediate insights on your responses
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <Award className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <div className="font-semibold">Growth-Focused</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Every answer helps strengthen your bond
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={startActivity}
                    disabled={isLoading}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Activity
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Playing Phase */}
          {state.phase === 'playing' && currentQuestion && (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate__animated animate__fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    {state.currentQuestionIndex + 1}
                  </span>
                  Question {state.currentQuestionIndex + 1}
                  <Badge className="ml-3 bg-purple-100 text-purple-800">
                    {currentQuestion.pointValue} points
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Question Text */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {currentQuestion.text}
                  </h3>
                  {currentQuestion.timeLimit && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      Time limit: {currentQuestion.timeLimit} seconds
                    </div>
                  )}
                </div>

                {/* Answer Input */}
                <div className="space-y-4">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    Your Response:
                  </Label>
                  {renderQuestionInput(currentQuestion)}
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    onClick={submitAnswer}
                    disabled={isLoading || !currentAnswer.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </div>

                {/* Real-time Dr. Marcie Response */}
                {realtimeResponse && (
                  <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <AlertDescription className="text-purple-700 dark:text-purple-300">
                      <strong>Dr. Marcie:</strong> {realtimeResponse.text}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results Phase */}
          {state.phase === 'results' && (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate__animated animate__fadeInUp">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Activity Complete!
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
                    </div>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {activity.questions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Questions Completed</div>
                    </div>
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        <TrendingUp className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Relationship Growth</div>
                    </div>
                  </div>

                  {finalResults && (
                    <Alert className="border-pink-200 bg-pink-50 dark:bg-pink-900/20">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <AlertDescription className="text-pink-700 dark:text-pink-300">
                        <strong>Dr. Marcie's Final Thoughts:</strong> {finalResults.text}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OmnipresentActivityInterface;