// app/api/games/record/route.ts
// Emergency fix - completely avoid dailyGame table for now

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, gameId, score, xpEarned } = body

    console.log('🎯 Recording game (emergency mode):', { userId, gameId, score, xpEarned })

    // Validate required fields
    if (!userId || !gameId || score === undefined || xpEarned === undefined) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['userId', 'gameId', 'score', 'xpEarned']
        },
        { status: 400 }
      )
    }

    // SKIP daily game checking for now - just record session and update XP
    const result = await prisma.$transaction(async (tx) => {
      // 1. Record detailed game session only (skip dailyGame table)
      const gameSession = await tx.gameSession.create({
        data: {
          userId,
          gameId,
          score,
          xpEarned,
          startedAt: new Date(Date.now() - 30000), // 30 seconds ago
          endedAt: new Date()
        }
      })

      // 2. Update user's total XP
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalXP: {
            increment: xpEarned
          },
          updatedAt: new Date()
        }
      })

      // 3. Calculate new level
      const newLevel = calculateLevel(updatedUser.totalXP)
      let levelChanged = false

      if (newLevel !== updatedUser.currentLevel) {
        await tx.user.update({
          where: { id: userId },
          data: { 
            currentLevel: newLevel,
            updatedAt: new Date()
          }
        })
        levelChanged = true
      }

      return {
        gameSession,
        newTotalXP: updatedUser.totalXP,
        newLevel,
        levelUp: levelChanged
      }
    })

    console.log('✅ Game recorded successfully (emergency mode):', result.newTotalXP, 'XP')

    return NextResponse.json({
      success: true,
      message: 'Game recorded successfully',
      data: {
        xpEarned: xpEarned,
        totalXP: result.newTotalXP,
        level: result.newLevel,
        levelUp: result.levelUp
      }
    })

  } catch (error) {
    console.error('❌ Error recording game (emergency mode):', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to record game',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Helper function to calculate level based on XP
function calculateLevel(totalXP: number): string {
  if (totalXP >= 300) return 'Kingdom Builder'
  if (totalXP >= 150) return 'Guardian'  
  if (totalXP >= 75) return 'Messenger'
  if (totalXP >= 25) return 'Disciple'
  return 'Seedling'
}

// GET endpoint for health check
export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const sessionCount = await prisma.gameSession.count()

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      stats: {
        users: userCount,
        gameSessions: sessionCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}