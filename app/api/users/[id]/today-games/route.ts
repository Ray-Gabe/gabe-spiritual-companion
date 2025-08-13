import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const today = new Date().toISOString().split('T')[0]
    
    console.log('API: Getting today games for user:', id, 'date:', today)
    
    const games = await prisma.dailyGame.findMany({
      where: {
        user_id: id,
        played_date: today,
      },
    })
    
    console.log('API: Found games:', games)
    return NextResponse.json(games)
  } catch (error) {
    console.error('API: Error fetching today games:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}