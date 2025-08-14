// app/api/users/[id]/route.ts
// Fixed user ID API with proper date handling

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    console.log('👤 Fetching user:', id)

    // Get user with basic info
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        totalXP: true,
        currentLevel: true,
        streakDays: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      console.log('❌ User not found:', id)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get today's games using proper date range
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1)

    const todayGames = await prisma.dailyGame.findMany({
      where: {
        userId: id,
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

    console.log('✅ User found with', todayGames.length, 'games today')

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        totalXP: user.totalXP,
        currentLevel: user.currentLevel,
        streakDays: user.streakDays,
        todayGames: todayGames.map(game => game.gameId),
        gamesPlayedToday: todayGames.length
      }
    })

  } catch (error) {
    console.error('❌ Error fetching user:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}