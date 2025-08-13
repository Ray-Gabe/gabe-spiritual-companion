import { NextRequest, NextResponse } from 'next/server'
import { getTodaysGames } from '@/lib/database/users'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const games = await getTodaysGames(id)
    
    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching today\'s games:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}