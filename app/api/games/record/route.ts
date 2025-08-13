import { NextRequest, NextResponse } from 'next/server'
import { recordDailyGame } from '@/lib/database/users'

export async function POST(request: NextRequest) {
  try {
    const { userId, gameId, xpEarned, score } = await request.json()
    
    if (!userId || !gameId || xpEarned === undefined || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, gameId, xpEarned, score' },
        { status: 400 }
      )
    }

    const result = await recordDailyGame(userId, gameId, xpEarned, score)
    
    return NextResponse.json({
      success: true,
      dailyGame: result
    })
  } catch (error) {
    console.error('Error recording game:', error)
    
    // Handle specific error for already played today
    if (error instanceof Error && error.message === 'Game already played today') {
      return NextResponse.json(
        { error: 'Game already played today' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to record game' },
      { status: 500 }
    )
  }
}