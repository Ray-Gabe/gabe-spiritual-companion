import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const today = new Date().toISOString().split('T')[0]
    
    const games = await prisma.dailyGame.findMany({
      where: {
        user_id: id,
        played_date: today,
      },
      // Only select columns that exist
      select: {
        id: true,
        game_id: true,
        xp_earned: true,
        score: true,
        played_date: true
      }
    })
    
    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching today games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}