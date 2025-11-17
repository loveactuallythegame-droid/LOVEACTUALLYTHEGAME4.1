'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Heart, MessageSquare, CheckCircle, Clock, Shield } from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface FightSolverProps {
  coupleId: string;
  userId: string;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onResolutionComplete?: (sessionId: string) => void;
}

interface FightSolverSession {
  id: string;
  conflictTopic: string;
  urgencyLevel: number;
  partner1Perspective: string;
  partner2Perspective: string;
  aiAnalysis?: string;
  whoIsRight?: 'partner1' | 'partner2' | 'both' | 'neither';
  recommendations?: string[];
  healingChallenges?: string[];
  challengesCompleted: number;
  resolved: boolean;
  drMarcieVoiceUrl?: string;
}

const FightSolver: React.FC<FightSolverProps> = ({
  coupleId,
  userId,
  personalityLevel,
  coupleBackstory,
  onResolutionComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState<'input' | 'analysis' | 'resolution' | 'complete'>('input');
  const [conflictTopic, setConflictTopic] = useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = useState<number>(3);
  const [partner1Perspective, setPartner1Perspective] = useState<string>('');
  const [partner2Perspective, setPartner2Perspective] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [session, setSession] = useState<FightSolverSession | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<number>(0);

  const urgencyLabels = {
    1: { label: 'Mild Disagreement', color: 'bg-green-500', icon: '😌' },
    2: { label: 'Minor Tension', color: 'bg-yellow-500', icon: '😐' },
    3: { label: 'Heated Discussion', color: 'bg-orange-500', icon: '😤' },
    4: { label: 'Major Conflict', color: 'bg-red-500', icon: '😠' },
    5: { label: 'Emergency!', color: 'bg-red-700', icon: '🚨' },
  };

  const submitConflict = async (): Promise<void> => {
    if (!conflictTopic.trim() || !partner1Perspective.trim() || !partner2Perspective.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/fight-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupleId,
          initiatorId: userId,
          conflictTopic,
          urgencyLevel,
          partner1Perspective,
          partner2Perspective,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.session);
        setCurrentPhase('analysis');
      } else {
        console.error('Failed to create fight solver session:', data.error);
      }
    } catch (error) {
      console.error('Error submitting conflict:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeChallenge = async (challengeIndex: number): Promise<void> => {
    if (!session) return;

    const newCompleted = completedChallenges + 1;
    setCompletedChallenges(newCompleted);

    try {
      await fetch('/api/fight-solver', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          challengesCompleted: newCompleted,
          resolved: newCompleted >= (session.healingChallenges?.length || 0),
        }),
      });

      if (newCompleted >= (session.healingChallenges?.length || 0)) {
        setCurrentPhase('complete');
        if (onResolutionComplete) {
          onResolutionComplete(session.id);
        }
      }
    } catch (error) {
      console.error('Error updating challenge completion:', error);
    }
  };

  const resetFightSolver = (): void => {
    setCurrentPhase('input');
    setConflictTopic('');
    setUrgencyLevel(3);
    setPartner1Perspective('');
    setPartner2Perspective('');
    setSession(null);
    setCompletedChallenges(0);
  };

  const urgencyInfo = urgencyLabels[urgencyLevel as keyof typeof urgencyLabels];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500 text-white rounded-full">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 flex items-center">
                    SOS Fight Solver
                    <Badge className="ml-3 bg-red-500 text-white">Emergency Tool</Badge>
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    How About We DON'T Break Up? Let Dr. Marcie help resolve this conflict.
                  </p>
                </div>
              </div>
              <div className="text-4xl">{urgencyInfo.icon}</div>
            </div>
          </CardHeader>
        </Card>

        {/* Input Phase */}
        {currentPhase === 'input' && (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate__animated animate__fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                <MessageSquare className="w-5 h-5 mr-2" />
                Tell Dr. Marcie What's Happening
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Conflict Topic */}
              <div className="space-y-2">
                <Label htmlFor="conflict-topic" className="text-gray-700 dark:text-gray-300">
                  What's this fight about? (Be specific)
                </Label>
                <Input
                  id="conflict-topic"
                  value={conflictTopic}
                  onChange={(e) => setConflictTopic(e.target.value)}
                  placeholder="e.g., Who should do the dishes, money management, in-laws..."
                  className="w-full"
                />
              </div>

              {/* Urgency Level */}
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300">
                  How urgent is this? (1 = mild, 5 = emergency)
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const info = urgencyLabels[level as keyof typeof urgencyLabels];
                    return (
                      <Button
                        key={level}
                        variant={urgencyLevel === level ? "default" : "outline"}
                        className={`p-4 h-auto flex flex-col items-center ${
                          urgencyLevel === level ? info.color + ' text-white' : ''
                        }`}
                        onClick={() => setUrgencyLevel(level)}
                      >
                        <span className="text-2xl mb-1">{info.icon}</span>
                        <span className="text-xs text-center">{info.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Writing Booths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="partner1" className="text-gray-700 dark:text-gray-300 flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-pink-500" />
                    Partner 1's Perspective
                  </Label>
                  <Textarea
                    id="partner1"
                    value={partner1Perspective}
                    onChange={(e) => setPartner1Perspective(e.target.value)}
                    placeholder="Write your side of the story. What happened? How do you feel? What do you need?"
                    className="min-h-[120px] resize-none"
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="partner2" className="text-gray-700 dark:text-gray-300 flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-purple-500" />
                    Partner 2's Perspective
                  </Label>
                  <Textarea
                    id="partner2"
                    value={partner2Perspective}
                    onChange={(e) => setPartner2Perspective(e.target.value)}
                    placeholder="Write your side of the story. What happened? How do you feel? What do you need?"
                    className="min-h-[120px] resize-none"
                    rows={6}
                  />
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={submitConflict}
                  disabled={isLoading || !conflictTopic.trim() || !partner1Perspective.trim() || !partner2Perspective.trim()}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white px-8"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Dr. Marcie is analyzing...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      FIX THIS MESS! 🆘
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Phase */}
        {currentPhase === 'analysis' && session && (
          <div className="space-y-6 animate__animated animate__fadeIn">
            <EnhancedDrMarcieAvatar
              personalityLevel={personalityLevel}
              coupleBackstory={coupleBackstory}
              hostingContext="fight_solver"
              expression="analytical"
              contextData={{
                conflictTopic: session.conflictTopic,
                partner1Perspective: session.partner1Perspective,
                partner2Perspective: session.partner2Perspective,
                urgencyLevel: session.urgencyLevel
              }}
              autoGreeting={true}
              initialMessage={`Well, well, well... looks like someone needs my help sorting out a little disagreement about "${session.conflictTopic}". Let me analyze what's really going on here.`}
            />
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  Dr. Marcie's Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Conflict Summary */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Conflict: {session.conflictTopic}</h4>
                  <Badge className={`${urgencyInfo.color} text-white`}>
                    {urgencyInfo.label} {urgencyInfo.icon}
                  </Badge>
                </div>

                {/* AI Analysis */}
                {session.aiAnalysis && (
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Dr. Marcie's Take:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{session.aiAnalysis}</p>
                  </div>
                )}

                {/* Who's Right */}
                {session.whoIsRight && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">The Verdict:</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {session.whoIsRight === 'both' && "You're both right (and both wrong). It's complicated."}
                      {session.whoIsRight === 'neither' && "Nobody's right here. Time to find a new approach."}
                      {session.whoIsRight === 'partner1' && "Partner 1 has the stronger point this time."}
                      {session.whoIsRight === 'partner2' && "Partner 2 has the stronger point this time."}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    onClick={() => setCurrentPhase('resolution')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Show Me How to Fix This! 💪
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resolution Phase */}
        {currentPhase === 'resolution' && session && (
          <div className="space-y-6 animate__animated animate__fadeIn">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  Healing Challenges - Work Together!
                </CardTitle>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{completedChallenges} / {session.healingChallenges?.length || 0}</span>
                  </div>
                  <Progress 
                    value={((completedChallenges) / (session.healingChallenges?.length || 1)) * 100} 
                    className="h-2"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Recommendations */}
                {session.recommendations && session.recommendations.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Dr. Marcie's Recommendations:</h4>
                    <ul className="space-y-2">
                      {session.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Healing Challenges */}
                {session.healingChallenges && session.healingChallenges.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Complete These Together:</h4>
                    {session.healingChallenges.map((challenge, index) => (
                      <Card key={index} className={`border-2 ${
                        index < completedChallenges 
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                          : index === completedChallenges 
                            ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' 
                            : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  Challenge {index + 1}
                                </span>
                                {index < completedChallenges && (
                                  <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                                )}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{challenge}</p>
                            </div>
                            {index === completedChallenges && (
                              <Button
                                onClick={() => completeChallenge(index)}
                                size="sm"
                                className="ml-4 bg-green-500 hover:bg-green-600 text-white"
                              >
                                Done! ✅
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Complete Phase */}
        {currentPhase === 'complete' && (
          <div className="text-center space-y-6 animate__animated animate__fadeIn">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Conflict Resolved!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  You both worked through this together. Dr. Marcie is proud of you! 💕
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Trust Boost</h3>
                    <p className="text-green-600 dark:text-green-400">+5 Trust Points</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Challenges Completed</h3>
                    <p className="text-blue-600 dark:text-blue-400">{completedChallenges}</p>
                  </div>
                </div>
                <Button
                  onClick={resetFightSolver}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  Start Fresh 🌟
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );