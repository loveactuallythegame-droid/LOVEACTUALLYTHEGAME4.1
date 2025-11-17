import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createCoupleSchema = z.object({
  user1Email: z.string().email(),
  user1Name: z.string().min(1),
  user2Email: z.string().email(),
  user2Name: z.string().min(1),
  originStory: z.string().optional(),
  relationshipGoals: z.string().optional(),
  drMarcieLevel: z.number().min(1).max(3).optional(),
});

const updateCoupleSchema = z.object({
  coupleId: z.string(),
  originStory: z.string().optional(),
  relationshipGoals: z.string().optional(),
  vulnerabilityPoints: z.number().optional(),
  trustThermometer: z.number().min(0).max(100).optional(),
  currentStreak: z.number().optional(),
  subscriptionActive: z.boolean().optional(),
  subscriptionTier: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createCoupleSchema.parse(body);

    // Create or find users
    const user1 = await prisma.user.upsert({
      where: { email: validatedData.user1Email },
      update: { name: validatedData.user1Name },
      create: {
        email: validatedData.user1Email,
        name: validatedData.user1Name,
        drMarcieLevel: validatedData.drMarcieLevel || 1,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: validatedData.user2Email },
      update: { name: validatedData.user2Name },
      create: {
        email: validatedData.user2Email,
        name: validatedData.user2Name,
        drMarcieLevel: validatedData.drMarcieLevel || 1,
      },
    });

    // Create couple
    const couple = await prisma.couple.create({
      data: {
        originStory: validatedData.originStory,
        relationshipGoals: validatedData.relationshipGoals,
        users: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
      },
      include: {
        users: true,
        _count: {
          select: {
            gameSessions: true,
            milestones: true,
          },
        },
      },
    });

    // Update users with couple ID
    await prisma.user.updateMany({
      where: { id: { in: [user1.id, user2.id] } },
      data: { coupleId: couple.id },
    });

    return NextResponse.json({
      success: true,
      couple: couple,
    });
  } catch (error) {
    console.error('Error creating couple:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create couple' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const userEmail = searchParams.get('userEmail');

    if (coupleId) {
      // Get specific couple
      const couple = await prisma.couple.findUnique({
        where: { id: coupleId },
        include: {
          users: true,
          gameSessions: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              player1: true,
              player2: true,
            },
          },
          milestones: {
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              gameSessions: true,
              fightSolverSessions: true,
            },
          },
        },
      });

      if (!couple) {
        return NextResponse.json(
          { success: false, error: 'Couple not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, couple });
    } else if (userEmail) {
      // Get couple by user email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          couple: {
            include: {
              users: true,
              gameSessions: {
                take: 5,
                orderBy: { createdAt: 'desc' },
              },
              milestones: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      });

      if (!user || !user.couple) {
        return NextResponse.json(
          { success: false, error: 'User or couple not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, couple: user.couple, user });
    } else {
      // Get all couples (admin endpoint - limit this in production)
      const couples = await prisma.couple.findMany({
        take: 20,
        include: {
          users: true,
          _count: {
            select: {
              gameSessions: true,
              milestones: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, couples });
    }
  } catch (error) {
    console.error('Error fetching couple(s):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch couple data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateCoupleSchema.parse(body);

    const updatedCouple = await prisma.couple.update({
      where: { id: validatedData.coupleId },
      data: {
        originStory: validatedData.originStory,
        relationshipGoals: validatedData.relationshipGoals,
        vulnerabilityPoints: validatedData.vulnerabilityPoints,
        trustThermometer: validatedData.trustThermometer,
        currentStreak: validatedData.currentStreak,
        subscriptionActive: validatedData.subscriptionActive,
        subscriptionTier: validatedData.subscriptionTier,
        ...(validatedData.currentStreak !== undefined && validatedData.currentStreak > 0 ? {
          longestStreak: {
            set: Math.max(validatedData.currentStreak, 0)
          }
        } : {})
      },
      include: {
        users: true,
        _count: {
          select: {
            gameSessions: true,
            milestones: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      couple: updatedCouple,
    });
  } catch (error) {
    console.error('Error updating couple:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update couple' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');

    if (!coupleId) {
      return NextResponse.json(
        { success: false, error: 'Couple ID is required' },
        { status: 400 }
      );
    }

    // Delete in correct order due to foreign key constraints
    await prisma.coupleMilestone.deleteMany({
      where: { coupleId },
    });

    await prisma.fightSolverSession.deleteMany({
      where: { coupleId },
    });

    await prisma.gameSession.deleteMany({
      where: { coupleId },
    });

    // Update users to remove couple association
    await prisma.user.updateMany({
      where: { coupleId },
      data: { coupleId: null },
    });

    // Delete the couple
    await prisma.couple.delete({
      where: { id: coupleId },
    });

    return NextResponse.json({
      success: true,
      message: 'Couple deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting couple:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete couple' },
      { status: 500 }