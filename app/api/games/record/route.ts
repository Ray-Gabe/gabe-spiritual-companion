// app/api/games/record/route.ts
// Simplified approach - avoid complex date queries

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, gameId, score, xpEarned } = body

    console.log('🎯 Recording game:', { userId, gameId, score, xpEarned })

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

    // Get today's date as a simple string
    const today = new Date()
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    console.log('📅 Today date:', todayDateOnly.toISOString())

    // Check if user has already played this game today using simpler approach
    const allUserGames = await prisma.dailyGame.findMany({
      where: {
        userId: userId,
        gameId: gameId
      },
      select: {
        playedDate: true
      }
    })

    // Check in JavaScript instead of SQL
    const todayString = todayDateOnly.toISOString().split('T')[0]
    const hasPlayedToday = allUserGames.some(game => {
      const gameDate = new Date(game.playedDate).toISOString().split('T')[0]
      return gameDate === todayString
    })

    if (hasPlayedToday) {
      console.log('⚠️ Game already played today')
      return NextResponse.json(
        { 
          error: 'Game already played today',
          message: 'You can only play each game once per day'
        },
        { status: 409 }
      )
    }

    console.log('✅ Game not played today, creating record...')

    // Use transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Record the daily game with simple date
      const dailyGame = await tx.dailyGame.create({
        data: {
          userId,
          gameId,
          playedDate: todayDateOnly, // Use simple date
          xpEarned,
          score
        }
      })

      // 2. Record detailed game session
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

      // 3. Update user's total XP
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalXP: {
            increment: xpEarned
          },
          updatedAt: new Date()
        }
      })

      // 4. Calculate new level
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
        dailyGame,
        gameSession,
        newTotalXP: updatedUser.totalXP,
        newLevel,
        levelUp: levelChanged
      }
    })

    console.log('✅ Game recorded successfully:', result.newTotalXP, 'XP')

    return NextResponse.json({
      success: true,
      message: 'Game recorded successfully',
      data: {
        xpEarned: result.dailyGame.xpEarned,
        totalXP: result.newTotalXP,
        level: result.newLevel,
        levelUp: result.levelUp
      }
    })

  } catch (error) {
    console.error('❌ Error recording game:', error)
    
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
    const gameCount = await prisma.dailyGame.count()

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      stats: {
        users: userCount,
        gamesPlayed: gameCount
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