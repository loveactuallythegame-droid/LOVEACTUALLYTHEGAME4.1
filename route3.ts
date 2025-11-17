import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createFightSolverSchema = z.object({
  coupleId: z.string(),
  initiatorId: z.string(),
  conflictTopic: z.string().min(1),
  urgencyLevel: z.number().min(1).max(5),
  partner1Perspective: z.string().min(1),
  partner2Perspective: z.string().min(1),
});

const updateFightSolverSchema = z.object({
  sessionId: z.string(),
  aiAnalysis: z.string().optional(),
  whoIsRight: z.enum(['partner1', 'partner2', 'both', 'neither']).optional(),
  recommendations: z.array(z.string()).optional(),
  healingChallenges: z.array(z.string()).optional(),
  challengesCompleted: z.number().optional(),
  resolved: z.boolean().optional(),
  drMarcieVoiceUrl: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createFightSolverSchema.parse(body);

    // Verify that the couple exists and initiator belongs to it
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
    if (!userIds.includes(validatedData.initiatorId)) {
      return NextResponse.json(
        { success: false, error: 'Initiator must belong to the couple' },
        { status: 400 }
      );
    }

    // Create fight solver session
    const fightSolverSession = await prisma.fightSolverSession.create({
      data: {
        coupleId: validatedData.coupleId,
        initiatorId: validatedData.initiatorId,
        conflictTopic: validatedData.conflictTopic,
        urgencyLevel: validatedData.urgencyLevel,
        partner1Perspective: validatedData.partner1Perspective,
        partner2Perspective: validatedData.partner2Perspective,
      },
      include: {
        couple: true,
        initiator: true,
      },
    });

    // Generate AI analysis using Dr. Marcie's personality
    try {
      const { DrMarcieAI } = await import('@/lib/dr-marcie-ai');
      const drMarcie = new DrMarcieAI(1, couple.originStory || ''); // Use personality level 1 for fight resolution

      const analysisPrompt = `Help resolve this conflict: "${validatedData.conflictTopic}"`;
      const fightContext = {
        conflictTopic: validatedData.conflictTopic,
        partner1Perspective: validatedData.partner1Perspective,
        partner2Perspective: validatedData.partner2Perspective,
        urgencyLevel: validatedData.urgencyLevel,
      };

      const response = await drMarcie.generateResponse(
        analysisPrompt,
        'fight_solver',
        fightContext
      );

      // Generate basic analysis and recommendations
      const aiAnalysis = response.text;
      const recommendations = [
        'Take a 10-minute cooling-off period before continuing this discussion',
        'Practice active listening - repeat back what you heard before responding',
        'Focus on "I feel" statements rather than "You always" accusations',
        'Find one thing you can agree on as a starting point',
      ];

      const healingChallenges = [
        'Each person shares one thing they appreciate about the other right now',
        'Take turns explaining your perspective for 2 minutes without interruption',
        'Identify the underlying need or fear behind your position',
        'Create a compromise that addresses both partners\' core concerns',
      ];

      // Determine who's right (simplified logic)
      let whoIsRight: 'partner1' | 'partner2' | 'both' | 'neither' = 'both';
      if (validatedData.urgencyLevel <= 2) {
        whoIsRight = 'both';
      } else if (validatedData.partner1Perspective.length > validatedData.partner2Perspective.length) {
        whoIsRight = 'partner1';
      } else {
        whoIsRight = 'partner2';
      }

      // Update the session with AI analysis
      const updatedSession = await prisma.fightSolverSession.update({
        where: { id: fightSolverSession.id },
        data: {
          aiAnalysis,
          whoIsRight,
          recommendations,
          healingChallenges,
          drMarcieVoiceUrl: response.audioUrl,
        },
        include: {
          couple: true,
          initiator: true,
        },
      });

      return NextResponse.json({
        success: true,
        session: updatedSession,
        drMarcieResponse: response,
      });

    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Return session without AI analysis if it fails
      return NextResponse.json({
        success: true,
        session: fightSolverSession,
        warning: 'AI analysis temporarily unavailable',
      });
    }

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
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const coupleId = searchParams.get('coupleId');
    const resolved = searchParams.get('resolved');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (sessionId) {
      // Get specific fight solver session
      const session = await prisma.fightSolverSession.findUnique({
        where: { id: sessionId },
        include: {
          couple: {
            include: { users: true },
          },
          initiator: true,
        },
      });

      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Fight solver session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, session });

    } else if (coupleId) {
      // Get fight solver sessions for a couple
      const sessions = await prisma.fightSolverSession.findMany({
        where: {
          coupleId,
          ...(resolved !== null && { resolved: resolved === 'true' }),
        },
        include: {
          initiator: true,
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, sessions });

    } else {
      // Get recent fight solver sessions (admin/general endpoint)
      const sessions = await prisma.fightSolverSession.findMany({
        take: limit,
        include: {
          couple: true,
          initiator: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, sessions });
    }

  } catch (error) {
    console.error('Error fetching fight solver sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fight solver sessions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateFightSolverSchema.parse(body);

    const updatedSession = await prisma.fightSolverSession.update({
      where: { id: validatedData.sessionId },
      data: {
        aiAnalysis: validatedData.aiAnalysis,
        whoIsRight: validatedData.whoIsRight,
        recommendations: validatedData.recommendations,
        healingChallenges: validatedData.healingChallenges,
        challengesCompleted: validatedData.challengesCompleted,
        resolved: validatedData.resolved,
        drMarcieVoiceUrl: validatedData.drMarcieVoiceUrl,
      },
      include: {
        couple: {
          include: { users: true },
        },
        initiator: true,
      },
    });

    // If session is marked as resolved, update couple's trust thermometer
    if (validatedData.resolved && !updatedSession.resolved) {
      await prisma.couple.update({
        where: { id: updatedSession.coupleId },
        data: {
          trustThermometer: {
            increment: 5, // Small boost for resolving conflicts
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      session: updatedSession,
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
  } finally {
    await prisma.$disconnect();
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

    await prisma.fightSolverSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Fight solver session deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting fight solver session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete fight solver session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}