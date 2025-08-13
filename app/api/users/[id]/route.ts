import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    console.log('API: Getting user by ID:', id)
    
    const user = await prisma.user.findUnique({
      where: { id },
    })
    
    if (!user) {
      console.log('API: User not found:', id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('API: User found:', user)
    return NextResponse.json(user)
  } catch (error) {
    console.error('API: Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}