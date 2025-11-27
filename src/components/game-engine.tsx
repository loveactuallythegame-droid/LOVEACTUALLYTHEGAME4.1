'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import PrimaryButton from '@/components/ui/primary-button';
import DrMarcieAvatar from '@/components/dr-marcie-avatar';
import Confetti from '@/components/ui/confetti';
import { cn } from '@/lib/utils';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Upload,
  Camera,
  Heart,
  Star,
  Trophy,
  Volume2,
  Target,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw as RotateIcon,
  Clock as Timer
} from 'lucide-react';

// Game Types and Mechanics
export type GameMechanic =
  | 'audio-response'
  | 'ranking-reorder'
  | 'pin-on-image'
  | 'video-response'
  | 'word-cloud'
  | 'face-detection'
  | 'swipe-left-right'
  | 'labeling-passage'
  | 'slider'
  | 'checkbox'
  | 'drawing-canvas'
  | 'file-upload'
  | 'fill-blanks'
  | 'drag-drop'
  | 'matrix'
  | 'xy-plot'
  | 'multi-select'
  | 'true-false'
  | 'dropdown-nested'
  | 'number-pad'
  | 'wheel-spin'
  | 'poll-elimination';

export interface GameSession {
  id: string;
  title: string;
  category: string;
  mechanic: GameMechanic;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
  description: string;
  instructions: string[];
  questions: GameQuestion[];
  rewards: {
    points: number;
    badge?: string;
    unlock?: string;
  };
}

export interface GameQuestion {
  id: string;
  type: string;
  prompt: string;
  description?: string;
  mechanic?: GameMechanic;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: any;
  timeLimit?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface GameEngineProps {
  session: GameSession;
  coupleId: string;
  userId: string;
  personalityLevel: 1 | 2 | 3;
  onComplete: (results: any) => void;
  onCancel: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  session,
  coupleId,
  userId,
  personalityLevel,
  onComplete,
  onCancel,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [drMarcieMood, setDrMarcieMood] = useState<'happy' | 'sassy' | 'serious' | 'excited' | 'concerned'>('happy');
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentQuestion = session.questions[currentQuestionIndex];

  // Game-specific state
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [drawingData, setDrawingData] = useState<string>('');
  const [rankedItems, setRankedItems] = useState<string[]>([]);
  const [selectedPin, setSelectedPin] = useState<{x: number, y: number} | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [wordCloud, setWordCloud] = useState<string[]>([]);
  const [eyeContactActive, setEyeContactActive] = useState(false);
  const [eyeContactTimer, setEyeContactTimer] = useState(0);

  // Timer management
  useEffect(() => {
    if (currentQuestion?.timeLimit && timeRemaining === null) {
      setTimeRemaining(currentQuestion.timeLimit);
    }
  }, [currentQuestion, timeRemaining]);

  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
  }, [timeRemaining]);

  // Eye contact detection simulation
  useEffect(() => {
    if (eyeContactActive && currentQuestion?.mechanic === 'face-detection') {
      const interval = setInterval(() => {
        setEyeContactTimer(prev => prev + 1);
        // Simulate random eye contact breaks
        if (Math.random() < 0.1) {
          setEyeContactTimer(0);
          setDrMarcieMood('concerned');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [eyeContactActive, currentQuestion]);

  const handleTimeUp = () => {
    setDrMarcieMood('sassy');
    nextQuestion();
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Update score based on answer quality
    if (answer && answer !== '') {
      setScore(prev => prev + 10);
      setDrMarcieMood('happy');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(currentQuestion?.timeLimit || null);
      setDrMarcieMood('happy');
    } else {
      showResults();
    }
  };

  const showResults = () => {
    setGamePhase('results');
    setDrMarcieMood(score > 70 ? 'excited' : 'serious');
    
    // Calculate final score and rewards
    const finalScore = score + (Object.keys(userAnswers).length * 5);
    const results = {
      sessionId: session.id,
      score: finalScore,
      answers: userAnswers,
      completedAt: new Date().toISOString(),
      rewards: {
        points: finalScore,
        badge: finalScore > 80 ? 'Relationship Master' : finalScore > 60 ? 'Love Learner' : 'Work in Progress',
        unlock: finalScore > 90 ? 'Premium Games' : null,
      },
    };
    
    onComplete(results);
  };

  const renderGameMechanic = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.mechanic) {
      case 'audio-response':
        return <AudioResponseGame
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
        />;

      case 'ranking-reorder':
        return <RankingGame
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />;

      case 'pin-on-image':
        return <PinOnImageGame
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />;

      case 'video-response':
        return <div className="text-center">
          <p className="font-body text-primary/80">Video Response Game - Coming Soon!</p>
        </div>;

      case 'word-cloud':
        return <WordCloudGame
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />;

      case 'face-detection':
        return <EyeContactChallenge
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          isActive={eyeContactActive}
          timer={eyeContactTimer}
          onActiveChange={setEyeContactActive}
        />;

      case 'swipe-left-right':
        return <div className="text-center">
          <p className="font-body text-primary/80">Swipe Game - Coming Soon!</p>
        </div>;

      case 'slider':
        return <SliderGame
          question={currentQuestion}
          value={sliderValue}
          onValueChange={setSliderValue}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />;

      case 'checkbox':
        return <div className="text-center">
          <p className="font-body text-primary/80">Checkbox Game - Coming Soon!</p>
        </div>;

      case 'drawing-canvas':
        return <div className="text-center">
          <p className="font-body text-primary/80">Drawing Game - Coming Soon!</p>
        </div>;

      case 'wheel-spin':
        return <div className="text-center">
          <p className="font-body text-primary/80">Wheel Spin Game - Coming Soon!</p>
        </div>;

      default:
        return <DefaultGameMechanic
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
        />;
    }
  };

  if (gamePhase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <GlassCard className="max-w-2xl mx-auto text-center">
          <div className="p-8 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <DrMarcieAvatar
                mood={drMarcieMood}
                size="lg"
                showSpeechBubble={true}
                speechText={`Welcome to ${session.title}! Let's make this relationship extraordinary.`}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-headers text-primary mb-4">
                {session.title}
              </h2>
              <p className="text-lg font-body text-primary/80 mb-6">
                {session.description}
              </p>
              <div className="space-y-2 text-sm font-body text-primary/70">
                {session.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    • {instruction}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 justify-center"
            >
              <PrimaryButton
                onClick={() => setGamePhase('playing')}
                size="lg"
              >
                Start Game
                <Play className="w-5 h-5 ml-2" />
              </PrimaryButton>
              <PrimaryButton
                variant="outline"
                onClick={onCancel}
                size="lg"
              >
                Cancel
              </PrimaryButton>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  if (gamePhase === 'playing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, var(--highlight) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, var(--accent) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Confetti for achievements */}
        <Confetti trigger={showConfetti} />

        <div className="relative z-10 min-h-screen p-4">
          {/* Game Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <GlassCard className="mb-4">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <DrMarcieAvatar
                    mood={drMarcieMood}
                    size="sm"
                    className="animate-pulse"
                  />
                  <div>
                    <h3 className="font-headers text-primary text-lg">
                      {session.title}
                    </h3>
                    <p className="font-body text-primary/70 text-sm">
                      Question {currentQuestionIndex + 1} of {session.questions.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {timeRemaining && (
                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-accent" />
                      <span className="font-body text-accent font-semibold">
                        {timeRemaining}s
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-body text-primary">
                      {score} pts
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
              <motion.div
                className="bg-gradient-main h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <GlassCard className="mb-8">
                <div className="p-8 space-y-6">
                  {/* Question Header */}
                  <div className="text-center space-y-4">
                    <h4 className="text-2xl font-headers text-primary">
                      {currentQuestion.prompt}
                    </h4>
                    {currentQuestion.description && (
                      <p className="font-body text-primary/80">
                        {currentQuestion.description}
                      </p>
                    )}
                  </div>

                  {/* Game Mechanic */}
                  <div className="min-h-[300px] flex items-center justify-center">
                    {renderGameMechanic()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <PrimaryButton
                      onClick={nextQuestion}
                      disabled={!userAnswers[currentQuestion.id]}
                      size="lg"
                    >
                      {currentQuestionIndex === session.questions.length - 1 ? 'Finish' : 'Next'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </PrimaryButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return null;
};

// Individual Game Components
const AudioResponseGame: React.FC<{
  question: GameQuestion;
  onAnswer: (answer: any) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}> = ({ question, onAnswer, isRecording, onRecordingChange }) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onAnswer({ audio: blob, duration: chunks.length * 0.1 });
      };
      
      mediaRecorder.start();
      onRecordingChange(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🎤</div>
        <p className="font-body text-primary/80">
          Hold the mic button and record your voice note. Speak from the heart!
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl',
            'transition-all duration-300',
            isRecording 
              ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
              : 'bg-gradient-main shadow-lg'
          )}
        >
          {isRecording ? <MicOff /> : <Mic />}
        </motion.button>

        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </motion.div>
        )}

        <div className="text-center">
          <p className="font-body text-primary/70 text-sm">
            {isRecording ? 'Recording... Speak your truth!' : 'Tap to start recording'}
          </p>
        </div>
      </div>
    </div>
  );
};

const RankingGame: React.FC<{
  question: GameQuestion;
  onAnswer: (answer: any) => void;
}> = ({ question, onAnswer }) => {
  const [items, setItems] = useState<string[]>(question.options || []);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = items.indexOf(draggedItem);
    if (draggedIndex === targetIndex) return;

    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
    setDraggedItem(null);
    onAnswer(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="font-body text-primary/80">
          Drag and drop to rank these from most important (top) to least important (bottom)
        </p>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        {items.map((item, index) => (
          <motion.div
            key={item}
            onClick={() => {
              // Simple reorder by clicking - move to top
              const newItems = items.filter(i => i !== item);
              newItems.unshift(item);
              setItems(newItems);
              onAnswer(newItems);
            }}
            whileHover={{ scale: 1.02 }}
            whileDrag={{ scale: 1.05, rotate: 5 }}
            className={cn(
              'p-4 rounded-xl cursor-move transition-all',
              'bg-white/20 border border-white/30 backdrop-blur-sm',
              'hover:bg-white/30 hover:border-accent',
              'flex items-center justify-between'
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <span className="font-body text-primary">{item}</span>
            </div>
            <div className="text-accent">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="font-body text-primary/70 text-sm">
          {items.length} items ranked • Drag to reorder
        </p>
      </div>
    </div>
  );
};

const PinOnImageGame: React.FC<{
  question: GameQuestion;
  onAnswer: (answer: any) => void;
}> = ({ question, onAnswer }) => {
  const [pins, setPins] = useState<Array<{x: number, y: number, id: string}>>([]);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin = { x, y, id: Date.now().toString() };
    setPins([newPin]);
    onAnswer({ x, y });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="font-body text-primary/80">
          {question.prompt}
        </p>
        <p className="font-body text-primary/60 text-sm">
          Click on the image to drop your pin
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          ref={imageRef}
          onClick={handleImageClick}
          className="relative w-full h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl cursor-crosshair overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          {/* Placeholder image content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">🗺️</div>
          </div>

          {/* Existing pins */}
          <AnimatePresence>
            {pins.map((pin) => (
              <motion.div
                key={pin.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-6 h-6 bg-accent rounded-full border-4 border-white shadow-lg"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute inset-0 bg-accent rounded-full animate-ping" />
                <div className="absolute inset-1 bg-white rounded-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {pins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-body text-accent font-semibold">
            Pin dropped at ({pins[0].x.toFixed(1)}%, {pins[0].y.toFixed(1)}%)
          </p>
        </motion.div>
      )}
    </div>
  );
};

const EyeContactChallenge: React.FC<{
  question: GameQuestion;
  onAnswer: (answer: any) => void;
  isActive: boolean;
  timer: number;
  onActiveChange: (active: boolean) => void;
}> = ({ question, onAnswer, isActive, timer, onActiveChange }) => {
  const [finalTime, setFinalTime] = useState(0);

  const startChallenge = () => {
    onActiveChange(true);
  };

  const stopChallenge = () => {
    onActiveChange(false);
    setFinalTime(timer);
    onAnswer({ duration: timer, completed: timer >= 60 });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="font-body text-primary/80">
          {question.prompt}
        </p>
        <p className="font-body text-primary/60 text-sm">
          Look into each other's eyes for 60 seconds without breaking contact
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Camera Preview Placeholder */}
        <motion.div
          className="relative w-64 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl overflow-hidden"
          animate={isActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl opacity-20">👀</div>
          </div>
          
          {isActive && (
            <motion.div
              className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full font-bold"
              animate={{ scale: timer % 10 === 0 ? [1, 1.2, 1] : 1 }}
            >
              {timer}s
            </motion.div>
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isActive ? stopChallenge : startChallenge}
          className={cn(
            'px-8 py-4 rounded-full font-bold text-lg transition-all',
            isActive 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gradient-main text-white hover:shadow-lg'
          )}
        >
          {isActive ? 'Break Eye Contact' : 'Start Eye Contact Challenge'}
        </motion.button>

        {finalTime > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2"
          >
            <p className="font-headers text-accent text-xl">
              Eye Contact Held: {finalTime} seconds
            </p>
            <p className="font-body text-primary/70">
              {finalTime >= 60 ? 'Amazing connection! 💕' : 'Good effort! Keep practicing!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const WordCloudGame: React.FC<{
  question: GameQuestion;
  onAnswer: (answer: any) => void;
}> = ({ question, onAnswer }) => {
  const [words, setWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onAnswer({ words, count: words.length });
    }
  }, [timeLeft, words, onAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && words.length < 20) {
      setWords([...words, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="font-body text-primary/80">
          {question.prompt}
        </p>
        <p className="font-body text-accent font-semibold text-lg">
          Time remaining: {timeLeft}s • Words: {words.length}/20
        </p>
      </div>

      {/* Word Cloud Display */}
      <div className="relative min-h-[200px] bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-wrap justify-center items-center gap-2">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                'px-3 py-1 rounded-full font-marcie text-primary',
                'bg-gradient-to-r from-pink-400 to-purple-400',
                'text-sm md:text-base',
                'shadow-lg hover:shadow-xl transition-all'
              )}
              style={{
                fontSize: `${Math.min(16 + (words.length - index) * 2, 24)}px`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a word and press Enter"
          className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-xl font-body text-primary placeholder:text-primary/60 focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={timeLeft === 0 || words.length >= 20}
        />
        <PrimaryButton
          onClick={() => handleSubmit(new Event('submit') as any)}
          disabled={timeLeft === 0 || words.length >= 20 || !inputValue.trim()}
        >
          Add Word
        </PrimaryButton>
      </form>
    </div>
  );
};

const SliderGame: React.FC<{
  question: GameQuestion;
  value: number;
  onValueChange: (value: number) => void;
  onAnswer: (answer: any) => void;
}> = ({ question, value, onValueChange, onAnswer }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="font-body text-primary/80">
          {question.prompt}
        </p>
        <p className="font-body text-accent font-semibold text-xl">
          Current: {value}%
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value))}
            onMouseUp={() => onAnswer(value)}
            onTouchEnd={() => onAnswer(value)}
            className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider-neon"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${value}%, rgba(255,255,255,0.2) ${value}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <div className="flex justify-between text-sm font-body text-primary/70 mt-2">
            <span>0% - Not at all</span>
            <span>100% - Extremely</span>
          </div>
        </motion.div>

        <div className="text-center">
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
            animate={{ scale: value > 80 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-4 h-4 text-accent" />
            <span className="font-body text-primary">
              {value > 80 ? 'High intensity!' : value > 50 ? 'Moderate' : 'Low'}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DefaultGameMechanic: React.FC<{
  question: GameQuestion;
  onAnswer: (answer: any) => void;
}> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="font-body text-primary/80">
          {question.prompt}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full h-32 p-4 bg-white/20 border border-white/30 rounded-xl resize-none font-body text-primary placeholder:text-primary/60 focus:ring-2 focus:ring-accent focus:border-transparent"
          onBlur={() => onAnswer(answer)}
        />
      </div>

      <div className="text-center">
        <p className="font-body text-primary/70 text-sm">
          {answer.length}/500 characters
        </p>
      </div>
    </div>
  );
};

export default GameEngine;