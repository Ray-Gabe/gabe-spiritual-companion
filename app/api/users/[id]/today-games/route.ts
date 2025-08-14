// app/api/users/[id]/today-games/route.ts
// Simplified approach - avoid date filtering entirely

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await context.params
    
    console.log('📅 Fetching games for user:', userId)

    // Get ALL daily games for this user (we'll filter on frontend)
    const allGames = await prisma.dailyGame.findMany({
      where: {
        userId: userId
      },
      select: {
        gameId: true,
        xpEarned: true,
        score: true,
        playedDate: true
      },
      orderBy: {
        playedDate: 'desc'
      }
    })

    // Filter for today's games in JavaScript instead of SQL
    const today = new Date()
    const todayString = today.toISOString().split('T')[0] // YYYY-MM-DD

    const todayGames = allGames.filter(game => {
      const gameDate = new Date(game.playedDate).toISOString().split('T')[0]
      return gameDate === todayString
    })

    console.log('🎮 Total games:', allGames.length, 'Today games:', todayGames.length)

    return NextResponse.json({
      success: true,
      games: todayGames,
      gameIds: todayGames.map(game => game.gameId),
      count: todayGames.length,
      totalGames: allGames.length
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