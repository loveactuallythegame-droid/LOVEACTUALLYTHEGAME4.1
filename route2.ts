import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createGameSessionSchema = z.object({
  coupleId: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  gameType: z.enum(['emotional_connection', 'psych_based', 'creative_chaos']),
  gameTitle: z.string().min(1),
  duration: z.number().optional(),
});

const updateGameSessionSchema = z.object({
  gameSessionId: z.string(),
  player1Score: z.number().optional(),
  player2Score: z.number().optional(),
  bonusPoints: z.number().optional(),
  completed: z.boolean().optional(),
  drMarcieVoiceUrl: z.string().optional(),
  drMarcieFeedback: z.string().optional(),
  drMarcieGrade: z.string().optional(),
});

const createChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['emotional_connection', 'psych_based', 'creative_chaos']),
  difficulty: z.number().min(1).max(5),
  estimatedTime: z.number().min(1),
  instructions: z.string().min(1),
  drMarcieIntro: z.string().optional(),
  drMarciePrompts: z.array(z.string()).optional(),
  maxPoints: z.number().default(100),
  gameSessionId: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'session') {
      const validatedData = createGameSessionSchema.parse(body);

      // Verify that the couple exists and players belong to it
      const couple = await prisma.couple.findUnique({
        where: { id: validatedData.coupleId },
        include: { users: true },
      });

      if (!couple) {
        return NextResponse.json(
          { success: false, error: 'Couple not found' },
          { status: 404 }
        );
      }

      const userIds = couple.users.map(user => user.id);
      if (!userIds.includes(validatedData.player1Id) || !userIds.includes(validatedData.player2Id)) {
        return NextResponse.json(
          { success: false, error: 'Players must belong to the couple' },
          { status: 400 }
        );
      }

      const gameSession = await prisma.gameSession.create({
        data: {
          coupleId: validatedData.coupleId,
          player1Id: validatedData.player1Id,
          player2Id: validatedData.player2Id,
          gameType: validatedData.gameType,
          gameTitle: validatedData.gameTitle,
          duration: validatedData.duration,
        },
        include: {
          couple: true,
          player1: true,
          player2: true,
          challenges: true,
        },
      });

      return NextResponse.json({
        success: true,
        gameSession,
      });

    } else if (type === 'challenge') {
      const validatedData = createChallengeSchema.parse(body);

      const challenge = await prisma.gameChallenge.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
          difficulty: validatedData.difficulty,
          estimatedTime: validatedData.estimatedTime,
          instructions: validatedData.instructions,
          drMarcieIntro: validatedData.drMarcieIntro,
          drMarciePrompts: validatedData.drMarciePrompts || [],
          maxPoints: validatedData.maxPoints,
          gameSessionId: validatedData.gameSessionId,
        },
      });

      return NextResponse.json({
        success: true,
        challenge,
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be "session" or "challenge"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error creating game data:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create game data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const gameSessionId = searchParams.get('gameSessionId');
    const coupleId = searchParams.get('coupleId');
    const type = searchParams.get('type') || 'sessions';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (gameSessionId) {
      // Get specific game session
      const gameSession = await prisma.gameSession.findUnique({
        where: { id: gameSessionId },
        include: {
          couple: true,
          player1: true,
          player2: true,
          challenges: true,
        },
      });

      if (!gameSession) {
        return NextResponse.json(
          { success: false, error: 'Game session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, gameSession });

    } else if (type === 'challenges') {
      // Get challenges
      const category = searchParams.get('category') as 'emotional_connection' | 'psych_based' | 'creative_chaos' | null;
      const difficulty = searchParams.get('difficulty');
      
      const challenges = await prisma.gameChallenge.findMany({
        where: {
          ...(category && { category }),
          ...(difficulty && { difficulty: parseInt(difficulty) }),
        },
        take: limit,
        orderBy: [
          { timesPlayed: 'desc' },
          { averageRating: 'desc' },
        ],
      });

      return NextResponse.json({ success: true, challenges });

    } else if (coupleId) {
      // Get game sessions for a couple
      const completed = searchParams.get('completed');
      
      const gameSessions = await prisma.gameSession.findMany({
        where: {
          coupleId,
          ...(completed !== null && { completed: completed === 'true' }),
        },
        include: {
          player1: true,
          player2: true,
          challenges: true,
          _count: {
            select: {
              challenges: true,
            },
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, gameSessions });

    } else {
      // Get recent game sessions (general endpoint)
      const gameSessions = await prisma.gameSession.findMany({
        take: limit,
        include: {
          couple: true,
          player1: true,
          player2: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, gameSessions });
    }

  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateGameSessionSchema.parse(body);

    const updatedGameSession = await prisma.gameSession.update({
      where: { id: validatedData.gameSessionId },
      data: {
        player1Score: validatedData.player1Score,
        player2Score: validatedData.player2Score,
        bonusPoints: validatedData.bonusPoints,
        completed: validatedData.completed,
        drMarcieVoiceUrl: validatedData.drMarcieVoiceUrl,
        drMarcieFeedback: validatedData.drMarcieFeedback,
        drMarcieGrade: validatedData.drMarcieGrade,
        ...(validatedData.completed && { updatedAt: new Date() }),
      },
      include: {
        couple: true,
        player1: true,
        player2: true,
        challenges: true,
      },
    });

    // If game is completed, update couple's progress
    if (validatedData.completed) {
      const totalScore = (validatedData.player1Score || 0) + (validatedData.player2Score || 0);
      const vulnerabilityPointsGained = Math.floor(totalScore / 10);

      await prisma.couple.update({
        where: { id: updatedGameSession.coupleId },
        data: {
          vulnerabilityPoints: {
            increment: vulnerabilityPointsGained,
          },
          currentStreak: {
            increment: 1,
          },
        },
      });

      // Update the longest streak if current streak is longer
      const couple = await prisma.couple.findUnique({
        where: { id: updatedGameSession.coupleId },
        select: { currentStreak: true, longestStreak: true },
      });

      if (couple && couple.currentStreak > couple.longestStreak) {
        await prisma.couple.update({
          where: { id: updatedGameSession.coupleId },
          data: { longestStreak: couple.currentStreak },
        });
      }
    }

    return NextResponse.json({
      success: true,
      gameSession: updatedGameSession,
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
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const gameSessionId = searchParams.get('gameSessionId');
    const challengeId = searchParams.get('challengeId');

    if (gameSessionId) {
      // Delete game session and its challenges
      await prisma.gameChallenge.deleteMany({
        where: { gameSessionId },
      });

      await prisma.gameSession.delete({
        where: { id: gameSessionId },
      });

      return NextResponse.json({
        success: true,
        message: 'Game session deleted successfully',
      });

    } else if (challengeId) {
      // Delete specific challenge
      await prisma.gameChallenge.delete({
        where: { id: challengeId },
      });

      return NextResponse.json({
        success: true,
        message: 'Challenge deleted successfully',
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Game session ID or challenge ID is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error deleting game data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete game data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}