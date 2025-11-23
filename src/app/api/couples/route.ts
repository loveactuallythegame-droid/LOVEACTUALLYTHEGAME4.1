import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Simple in-memory storage for development
// In production, replace with actual database
interface User {
  id: string;
  email: string;
  name: string;
  drMarcieLevel: number;
  coupleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Couple {
  id: string;
  originStory?: string;
  relationshipGoals?: string;
  vulnerabilityPoints: number;
  trustThermometer: number;
  currentStreak: number;
  longestStreak: number;
  subscriptionActive: boolean;
  subscriptionTier: string;
  users: User[];
  gameSessions: any[];
  milestones: any[];
  fightSolverSessions: any[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
let users: User[] = [];
let couples: Couple[] = [];

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
    let user1 = users.find(u => u.email === validatedData.user1Email);
    if (!user1) {
      user1 = {
        id: `user_${Date.now()}_1`,
        email: validatedData.user1Email,
        name: validatedData.user1Name,
        drMarcieLevel: validatedData.drMarcieLevel || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user1);
    } else {
      user1.name = validatedData.user1Name;
      user1.drMarcieLevel = validatedData.drMarcieLevel || 1;
      user1.updatedAt = new Date();
    }

    let user2 = users.find(u => u.email === validatedData.user2Email);
    if (!user2) {
      user2 = {
        id: `user_${Date.now()}_2`,
        email: validatedData.user2Email,
        name: validatedData.user2Name,
        drMarcieLevel: validatedData.drMarcieLevel || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user2);
    } else {
      user2.name = validatedData.user2Name;
      user2.drMarcieLevel = validatedData.drMarcieLevel || 1;
      user2.updatedAt = new Date();
    }

    // Create couple
    const couple: Couple = {
      id: `couple_${Date.now()}`,
      originStory: validatedData.originStory,
      relationshipGoals: validatedData.relationshipGoals,
      vulnerabilityPoints: 0,
      trustThermometer: 50,
      currentStreak: 0,
      longestStreak: 0,
      subscriptionActive: true,
      subscriptionTier: 'free',
      users: [user1, user2],
      gameSessions: [],
      milestones: [],
      fightSolverSessions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    couples.push(couple);

    // Update users with couple ID
    user1.coupleId = couple.id;
    user2.coupleId = couple.id;

    return NextResponse.json({
      success: true,
      couple: {
        id: couple.id,
        originStory: couple.originStory,
        relationshipGoals: couple.relationshipGoals,
        users: couple.users,
        _count: {
          gameSessions: couple.gameSessions.length,
          milestones: couple.milestones.length,
        },
      },
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
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('coupleId');
    const userEmail = searchParams.get('userEmail');

    if (coupleId) {
      // Get specific couple
      const couple = couples.find(c => c.id === coupleId);
      
      if (!couple) {
        return NextResponse.json(
          { success: false, error: 'Couple not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        couple: {
          ...couple,
          _count: {
            gameSessions: couple.gameSessions.length,
            fightSolverSessions: couple.fightSolverSessions.length,
          },
        }
      });
    } else if (userEmail) {
      // Get couple by user email
      const user = users.find(u => u.email === userEmail);
      
      if (!user || !user.coupleId) {
        return NextResponse.json(
          { success: false, error: 'User or couple not found' },
          { status: 404 }
        );
      }

      const couple = couples.find(c => c.id === user.coupleId);
      if (!couple) {
        return NextResponse.json(
          { success: false, error: 'Couple not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        couple: {
          ...couple,
          users: couple.users,
          gameSessions: couple.gameSessions.slice(0, 5),
          milestones: couple.milestones,
        },
        user 
      });
    } else {
      // Get all couples (admin endpoint - limit this in production)
      const limitedCouples = couples.slice(0, 20).map(couple => ({
        ...couple,
        _count: {
          gameSessions: couple.gameSessions.length,
          milestones: couple.milestones.length,
        },
      }));

      return NextResponse.json({ success: true, couples: limitedCouples });
    }
  } catch (error) {
    console.error('Error fetching couple(s):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch couple data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateCoupleSchema.parse(body);

    const coupleIndex = couples.findIndex(c => c.id === validatedData.coupleId);
    
    if (coupleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Couple not found' },
        { status: 404 }
      );
    }

    const updatedCouple = {
      ...couples[coupleIndex],
      originStory: validatedData.originStory ?? couples[coupleIndex].originStory,
      relationshipGoals: validatedData.relationshipGoals ?? couples[coupleIndex].relationshipGoals,
      vulnerabilityPoints: validatedData.vulnerabilityPoints ?? couples[coupleIndex].vulnerabilityPoints,
      trustThermometer: validatedData.trustThermometer ?? couples[coupleIndex].trustThermometer,
      currentStreak: validatedData.currentStreak ?? couples[coupleIndex].currentStreak,
      subscriptionActive: validatedData.subscriptionActive ?? couples[coupleIndex].subscriptionActive,
      subscriptionTier: validatedData.subscriptionTier ?? couples[coupleIndex].subscriptionTier,
      updatedAt: new Date(),
    };

    // Update longest streak if current streak is higher
    if (validatedData.currentStreak !== undefined && validatedData.currentStreak > couples[coupleIndex].longestStreak) {
      updatedCouple.longestStreak = validatedData.currentStreak;
    }

    couples[coupleIndex] = updatedCouple;

    return NextResponse.json({
      success: true,
      couple: {
        ...updatedCouple,
        _count: {
          gameSessions: updatedCouple.gameSessions.length,
          milestones: updatedCouple.milestones.length,
        },
      },
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

    const coupleIndex = couples.findIndex(c => c.id === coupleId);
    
    if (coupleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Couple not found' },
        { status: 404 }
      );
    }

    // Update users to remove couple association
    users = users.map(user => 
      user.coupleId === coupleId 
        ? { ...user, coupleId: undefined, updatedAt: new Date() }
        : user
    );

    // Delete the couple
    couples.splice(coupleIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Couple deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting couple:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete couple' },
      { status: 500 }
    );
  }
}
