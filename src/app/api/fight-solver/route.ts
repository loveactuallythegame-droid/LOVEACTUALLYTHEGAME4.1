import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DrMarcieAI } from '@/lib/dr-marcie-ai';

// Simple in-memory storage for development
interface FightSolverSession {
  id: string;
  coupleId: string;
  conflictTopic: string;
  partner1Perspective: string;
  partner2Perspective: string;
  urgencyLevel: number;
  status: 'active' | 'resolved' | 'escalated';
  drMarcieAnalysis: string;
  suggestedResolution: string;
  followUpActions: string[];
  createdAt: Date;
  resolvedAt?: Date;
  feedback?: string;
  effectivenessRating?: number;
}

// In-memory storage
let fightSolverSessions: FightSolverSession[] = [];

// Validation schemas
const createFightSessionSchema = z.object({
  coupleId: z.string(),
  conflictTopic: z.string().min(1),
  partner1Perspective: z.string().min(1),
  partner2Perspective: z.string().min(1),
  urgencyLevel: z.number().min(1).max(5),
});

const updateFightSessionSchema = z.object({
  sessionId: z.string(),
  status: z.enum(['active', 'resolved', 'escalated']).optional(),
  feedback: z.string().optional(),
  effectivenessRating: z.number().min(1).max(5).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createFightSessionSchema.parse(body);

    // Create Dr. Marcie AI instance for analysis
    const drMarcie = new DrMarcieAI(2); // Use level 2 for analytical approach

    // Generate analysis and resolution suggestions
    const fightContext = {
      conflictTopic: validatedData.conflictTopic,
      partner1Perspective: validatedData.partner1Perspective,
      partner2Perspective: validatedData.partner2Perspective,
      urgencyLevel: validatedData.urgencyLevel,
    };

    const drMarcieResponse = await drMarcie.generateResponse(
      `Help resolve this conflict: ${validatedData.conflictTopic}`,
      'fight_solver',
      fightContext
    );

    const fightSession: FightSolverSession = {
      id: `fight_${Date.now()}`,
      coupleId: validatedData.coupleId,
      conflictTopic: validatedData.conflictTopic,
      partner1Perspective: validatedData.partner1Perspective,
      partner2Perspective: validatedData.partner2Perspective,
      urgencyLevel: validatedData.urgencyLevel,
      status: 'active',
      drMarcieAnalysis: drMarcieResponse.text,
      suggestedResolution: extractResolutionSuggestions(drMarcieResponse.text),
      followUpActions: extractFollowUpActions(drMarcieResponse.text),
      createdAt: new Date(),
    };

    fightSolverSessions.push(fightSession);

    return NextResponse.json({
      success: true,
      fightSession: {
        id: fightSession.id,
        conflictTopic: fightSession.conflictTopic,
        urgencyLevel: fightSession.urgencyLevel,
        status: fightSession.status,
        drMarcieAnalysis: fightSession.drMarcieAnalysis,
        suggestedResolution: fightSession.suggestedResolution,
        followUpActions: fightSession.followUpActions,
        createdAt: fightSession.createdAt,
        audioUrl: drMarcieResponse.audioUrl,
      },
    });
  } catch (error) {
    console.error('Error creating fight solver session:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create fight solver session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const coupleId = searchParams.get('coupleId');
    const status = searchParams.get('status');

    if (sessionId) {
      // Get specific fight session
      const session = fightSolverSessions.find(s => s.id === sessionId);
      
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Fight solver session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, fightSession: session });
    } else if (coupleId) {
      // Get fight sessions for a couple
      let sessions = fightSolverSessions
        .filter(s => s.coupleId === coupleId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Filter by status if provided
      if (status) {
        sessions = sessions.filter(s => s.status === status);
      }

      return NextResponse.json({ 
        success: true, 
        fightSessions: sessions.slice(0, 10) 
      });
    } else {
      // Get all active sessions (admin endpoint - limit this in production)
      const activeSessions = fightSolverSessions
        .filter(s => s.status === 'active')
        .slice(0, 20);

      return NextResponse.json({ 
        success: true, 
        activeSessions 
      });
    }
  } catch (error) {
    console.error('Error fetching fight solver data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fight solver data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateFightSessionSchema.parse(body);

    const sessionIndex = fightSolverSessions.findIndex(s => s.id === validatedData.sessionId);
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fight solver session not found' },
        { status: 404 }
      );
    }

    const session = fightSolverSessions[sessionIndex];
    
    // Update session data
    if (validatedData.status) {
      session.status = validatedData.status;
      if (validatedData.status === 'resolved') {
        session.resolvedAt = new Date();
      }
    }
    
    if (validatedData.feedback) {
      session.feedback = validatedData.feedback;
    }
    
    if (validatedData.effectivenessRating) {
      session.effectivenessRating = validatedData.effectivenessRating;
    }

    fightSolverSessions[sessionIndex] = session;

    return NextResponse.json({
      success: true,
      fightSession: session,
    });
  } catch (error) {
    console.error('Error updating fight solver session:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update fight solver session' },
      { status: 500 }
    );
  }
}

// Helper functions
function extractResolutionSuggestions(analysis: string): string {
  // Simple extraction - in a real implementation, you'd use more sophisticated NLP
  const sentences = analysis.split('.');
  const resolutionSentences = sentences.filter(sentence => 
    sentence.toLowerCase().includes('suggest') ||
    sentence.toLowerCase().includes('recommend') ||
    sentence.toLowerCase().includes('try') ||
    sentence.toLowerCase().includes('consider')
  );
  
  return resolutionSentences.length > 0 
    ? resolutionSentences.join('. ') + '.'
    : 'Based on Dr. Marcie\'s analysis, focus on open communication and active listening to resolve this conflict.';
}

function extractFollowUpActions(analysis: string): string[] {
  // Simple extraction of actionable items
  const actions: string[] = [];
  
  if (analysis.toLowerCase().includes('apologize')) {
    actions.push('Consider offering a sincere apology for your part in the conflict');
  }
  
  if (analysis.toLowerCase().includes('listen')) {
    actions.push('Practice active listening without interrupting');
  }
  
  if (analysis.toLowerCase().includes('communicate')) {
    actions.push('Schedule a calm time to discuss the issue further');
  }
  
  if (analysis.toLowerCase().includes('compromise')) {
    actions.push('Look for areas where you can compromise');
  }
  
  if (actions.length === 0) {
    actions.push(
      'Take some time to cool down before continuing the conversation',
      'Write down your thoughts to clarify what you want to express',
      'Focus on understanding your partner\'s perspective'
    );
  }
  
  return actions;
}

// Emergency escalation endpoint
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { sessionId, escalate = false } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const sessionIndex = fightSolverSessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fight solver session not found' },
        { status: 404 }
      );
    }

    if (escalate) {
      fightSolverSessions[sessionIndex].status = 'escalated';
      
      // Generate escalation response
      const escalationMessage = `This conflict has been escalated for additional support. Dr. Marcie recommends taking a break and revisiting this when emotions are calmer. Consider seeking professional help if needed.`;
      
      return NextResponse.json({
        success: true,
        message: escalationMessage,
        fightSession: fightSolverSessions[sessionIndex],
      });
    }

    return NextResponse.json({
      success: true,
      fightSession: fightSolverSessions[sessionIndex],
    });
  } catch (error) {
    console.error('Error escalating fight solver session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to escalate fight solver session' },
      { status: 500 }
    );
  }
}
