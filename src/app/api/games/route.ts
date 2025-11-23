import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Simple in-memory storage for development
interface GameSession {
  id: string;
  coupleId: string;
  gameType: string;
  gameTitle: string;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  totalScore: number;
  difficulty: number;
  category: string;
  status: 'active' | 'completed' | 'abandoned';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  responses: any[];
  feedback?: string;
  achievements: string[];
}

interface GameTemplate {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
  minPlayers: number;
  maxPlayers: number;
  tags: string[];
  instructions: string[];
  questions: any[];
}

// In-memory storage
let gameSessions: GameSession[] = [];
let gameTemplates: GameTemplate[] = [
  {
    id: 'trust-building-1',
    type: 'trust_building',
    title: 'Trust Fall Questions',
    description: 'Build trust through vulnerable questions and active listening',
    category: 'emotional_connection',
    difficulty: 2,
    estimatedTime: 15,
    minPlayers: 2,
    maxPlayers: 2,
    tags: ['trust', 'vulnerability', 'communication'],
    instructions: [
      'Take turns asking each other these questions',
      'Listen actively without interrupting',
      'Be honest and vulnerable in your responses',
      'Thank your partner for their honesty'
    ],
    questions: [
      {
        id: 'q1',
        text: 'What\'s one thing you\'re afraid to tell me, but want me to know?',
        type: 'vulnerability',
        timeLimit: 180
      },
      {
        id: 'q2',
        text: 'When do you feel most safe with me?',
        type: 'safety',
        timeLimit: 120
      },
      {
        id: 'q3',
        text: 'What\'s something I do that makes you feel loved?',
        type: 'appreciation',
        timeLimit: 120
      }
    ]
  },
  {
    id: 'communication-1',
    type: 'communication',
    title: 'Active Listening Challenge',
    description: 'Practice deep listening and reflection skills',
    category: 'communication_mastery',
    difficulty: 3,
    estimatedTime: 20,
    minPlayers: 2,
    maxPlayers: 2,
    tags: ['communication', 'listening', 'empathy'],
    instructions: [
      'One person speaks for 2 minutes about a topic',
      'The listener must paraphrase what they heard',
      'Speaker confirms if reflection was accurate',
      'Switch roles and repeat'
    ],
    questions: [
      {
        id: 'comm1',
        text: 'Share something that\'s been on your mind lately',
        type: 'sharing',
        timeLimit: 120
      },
      {
        id: 'comm2',
        text: 'What\'s something you wish I understood better about you?',
        type: 'understanding',
        timeLimit: 120
      }
    ]
  }
];

// Validation schemas
const createGameSessionSchema = z.object({
  coupleId: z.string(),
  gameTemplateId: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  difficulty: z.number().min(1).max(5).optional(),
});

const updateGameSessionSchema = z.object({
  sessionId: z.string(),
  player1Score: z.number().optional(),
  player2Score: z.number().optional(),
  responses: z.array(z.any()).optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
  feedback: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createGameSessionSchema.parse(body);

    const template = gameTemplates.find(t => t.id === validatedData.gameTemplateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Game template not found' },
        { status: 404 }
      );
    }

    const gameSession: GameSession = {
      id: `game_${Date.now()}`,
      coupleId: validatedData.coupleId,
      gameType: template.type,
      gameTitle: template.title,
      player1Id: validatedData.player1Id,
      player2Id: validatedData.player2Id,
      player1Score: 0,
      player2Score: 0,
      totalScore: 0,
      difficulty: validatedData.difficulty || template.difficulty,
      category: template.category,
      status: 'active',
      startTime: new Date(),
      responses: [],
      achievements: [],
    };

    gameSessions.push(gameSession);

    return NextResponse.json({
      success: true,
      gameSession: {
        id: gameSession.id,
        gameType: gameSession.gameType,
        gameTitle: gameSession.gameTitle,
        difficulty: gameSession.difficulty,
        category: gameSession.category,
        status: gameSession.status,
        startTime: gameSession.startTime,
        template: {
          instructions: template.instructions,
          questions: template.questions,
          estimatedTime: template.estimatedTime,
        }
      },
    });
  } catch (error) {
    console.error('Error creating game session:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create game session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const coupleId = searchParams.get('coupleId');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    if (sessionId) {
      // Get specific game session
      const session = gameSessions.find(s => s.id === sessionId);
      
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Game session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, gameSession: session });
    } else if (coupleId) {
      // Get game sessions for a couple
      const sessions = gameSessions
        .filter(s => s.coupleId === coupleId)
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        .slice(0, 10);

      return NextResponse.json({ success: true, gameSessions: sessions });
    } else if (category || difficulty) {
      // Get game templates filtered by category or difficulty
      let filteredTemplates = gameTemplates;

      if (category) {
        filteredTemplates = filteredTemplates.filter(t => t.category === category);
      }

      if (difficulty) {
        const diffLevel = parseInt(difficulty);
        filteredTemplates = filteredTemplates.filter(t => t.difficulty === diffLevel);
      }

      return NextResponse.json({ success: true, gameTemplates: filteredTemplates });
    } else {
      // Get all game templates
      return NextResponse.json({ success: true, gameTemplates });
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateGameSessionSchema.parse(body);

    const sessionIndex = gameSessions.findIndex(s => s.id === validatedData.sessionId);
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Game session not found' },
        { status: 404 }
      );
    }

    const session = gameSessions[sessionIndex];
    
    // Update session data
    if (validatedData.player1Score !== undefined) {
      session.player1Score = validatedData.player1Score;
    }
    
    if (validatedData.player2Score !== undefined) {
      session.player2Score = validatedData.player2Score;
    }
    
    if (validatedData.responses) {
      session.responses = validatedData.responses;
    }
    
    if (validatedData.status) {
      session.status = validatedData.status;
      if (validatedData.status === 'completed') {
        session.endTime = new Date();
        session.duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000);
        session.totalScore = session.player1Score + session.player2Score;
      }
    }
    
    if (validatedData.feedback) {
      session.feedback = validatedData.feedback;
    }

    gameSessions[sessionIndex] = session;

    return NextResponse.json({
      success: true,
      gameSession: session,
    });
  } catch (error) {
    console.error('Error updating game session:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update game session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const sessionIndex = gameSessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Game session not found' },
        { status: 404 }
      );
    }

    gameSessions.splice(sessionIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Game session deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting game session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete game session' },
      { status: 500 }
    );
  }
}
