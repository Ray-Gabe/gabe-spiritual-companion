import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()
    
    console.log('API: Received request to create user:', { name, email })
    
    if (!name || name.trim() === '') {
      console.log('API: Name validation failed')
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    console.log('API: Creating user with Prisma...')

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email && email.trim() !== '' ? email.trim() : null,
        total_xp: 0,
        current_level: 'Seedling',
        streak_days: 0,
      },
    })

    console.log('API: User created successfully:', user)
    return NextResponse.json(user, { status: 201 })
    
  } catch (error) {
    console.error('API: Error creating user:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('API: Error message:', error.message)
      console.error('API: Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create user', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('API: Getting all users...')
    
    const users = await prisma.user.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 10 // Limit to last 10 users
    })
    
    console.log('API: Found users:', users.length)
    return NextResponse.json(users)
    
  } catch (error) {
    console.error('API: Error fetching users:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}