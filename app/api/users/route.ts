// app/api/users/route.ts
// Fixed user registration API with comprehensive debugging

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 User registration request received')
    
    // Parse request body with validation
    let body;
    try {
      body = await request.json()
      console.log('📝 Request body parsed:', { name: body.name, email: body.email })
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email } = body

    // Validate required fields
    if (!name || !email) {
      console.log('⚠️ Missing required fields:', { name: !!name, email: !!email })
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['name', 'email'],
          received: { name: !!name, email: !!email }
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('⚠️ Invalid email format:', email)
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('🔗 Testing database connection...')

    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ Database connection successful')
    } catch (connectionError) {
      console.error('❌ Database connection failed:', connectionError)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error',
          suggestion: 'Check DATABASE_PUBLIC_URL environment variable'
        },
        { status: 500 }
      )
    }

    console.log('👤 Checking if user already exists...')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('✅ User already exists, returning existing user:', existingUser.id)
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          totalXP: existingUser.totalXP,
          currentLevel: existingUser.currentLevel,
          streakDays: existingUser.streakDays
        }
      })
    }

    console.log('🆕 Creating new user...')

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        totalXP: 0,
        currentLevel: 'Seedling',
        streakDays: 0
      }
    })

    console.log('✅ User created successfully:', newUser.id)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        totalXP: newUser.totalXP,
        currentLevel: newUser.currentLevel,
        streakDays: newUser.streakDays
      }
    })

  } catch (error) {
    console.error('❌ User registration error:', error)
    
    // Detailed error analysis
    if (error instanceof Error) {
      // Prisma-specific errors
      if (error.message.includes('Environment variable not found')) {
        return NextResponse.json(
          { 
            error: 'Database configuration error',
            details: 'Environment variable not found',
            suggestion: 'Set DATABASE_PUBLIC_URL in Railway environment variables'
          },
          { status: 500 }
        )
      }

      if (error.message.includes('Can\'t reach database server')) {
        return NextResponse.json(
          { 
            error: 'Database server unreachable',
            details: error.message,
            suggestion: 'Check PostgreSQL service status in Railway'
          },
          { status: 500 }
        )
      }

      if (error.message.includes('Schema')) {
        return NextResponse.json(
          { 
            error: 'Database schema error',
            details: error.message,
            suggestion: 'Run database migrations: npx prisma migrate deploy'
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET endpoint to list users (for debugging)
export async function GET() {
  try {
    await prisma.$connect()
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalXP: user.totalXP,
        level: user.currentLevel,
        createdAt: user.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}