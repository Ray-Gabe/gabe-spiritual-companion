// app/api/users/[id]/today-games/route.ts
// Fixed API with proper PostgreSQL date handling

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await context.params
    
    console.log('📅 Fetching today games for user:', userId)

    // Create proper date range for "today" in UTC
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1)

    console.log('📅 Date range:', {
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString()
    })

    // Query with proper date range
    const todayGames = await prisma.dailyGame.findMany({
      where: {
        userId: userId,
        playedDate: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      select: {
        gameId: true,
        xpEarned: true,
        score: true,
        playedDate: true
      }
    })

    console.log('🎮 Found today games:', todayGames.length)

    return NextResponse.json({
      success: true,
      games: todayGames,
      gameIds: todayGames.map(game => game.gameId),
      count: todayGames.length
    })

  } catch (error) {
    console.error('❌ Error fetching today games:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch today games',
        message: error instanceof Error ? error.message : 'Unknown error',
        games: [],
        gameIds: []
      },
      { status: 500 }
    )
  }
}