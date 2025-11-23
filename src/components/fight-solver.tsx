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

export const FightSolver: React.FC<FightSolverProps> = ({
  coupleId,
  userId,
  personalityLevel,
  coupleBackstory,
  onResolutionComplete,
}) => {
  const [currentPhase, setCurrentPhase] = useState<"input" | "analysis" | "resolution" | "complete">("input");
  const [conflictTopic, setConflictTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitConflict = async () => {
    if (!conflictTopic.trim()) return;
    setIsLoading(true);
    try {
      // Minimal placeholder behavior for build-time correctness
      // In production this would POST to /api/fight-solver
      setTimeout(() => {
        setCurrentPhase("analysis");
        setIsLoading(false);
      }, 200);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 text-white rounded-full">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>SOS Fight Solver</CardTitle>
                <p className="text-sm text-gray-600">Quick help from Dr. Marcie</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {currentPhase === "input" && (
          <Card>
            <CardContent>
              <Label htmlFor="conflict-topic">What's this fight about?</Label>
              <Input id="conflict-topic" value={conflictTopic} onChange={(e) => setConflictTopic(e.target.value)} />
              <div className="mt-4 text-right">
                <Button onClick={submitConflict} disabled={isLoading || !conflictTopic.trim()}>
                  {isLoading ? "Analyzing..." : "Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === "analysis" && (
          <Card>
            <CardContent>
              <h3 className="font-semibold">Dr. Marcie is analyzing...</h3>
              <p className="text-sm text-gray-600">(placeholder analysis)</p>
              <div className="mt-4">
                <Button onClick={() => setCurrentPhase("resolution")}>Show Resolution</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === "resolution" && (
          <Card>
            <CardContent>
              <h3 className="font-semibold">Resolution</h3>
              <p className="text-sm text-gray-600">(placeholder resolution steps)</p>
              <div className="mt-4">
                <Button onClick={() => setCurrentPhase("complete")}>Complete</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === "complete" && (
          <Card>
            <CardContent>
              <h3 className="font-semibold">Conflict Resolved!</h3>
              <p className="text-sm text-gray-600">Great job working through this together.</p>
              <div className="mt-4">
                <Button onClick={() => setCurrentPhase("input")}>Start New</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FightSolver;