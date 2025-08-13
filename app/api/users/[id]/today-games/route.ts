import { NextRequest, NextResponse } from 'next/server'
import { getTodaysGames } from '@/lib/database/users'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const todaysGames = await getTodaysGames(id)
    
    return NextResponse.json(todaysGames)
  } catch (error) {
    console.error('Error fetching today\'s games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch today\'s games' },
      { status: 500 }
    )
  }
}