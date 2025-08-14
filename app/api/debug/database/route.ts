// app/api/debug/database/route.ts
// Debug endpoint to check database connection and existing data

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

export async function GET() {
  try {
    console.log('🔍 Starting database debug check...')
    
    // 1. Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // 2. Check if tables exist and count records
    const userCount = await prisma.user.count()
    const dailyGameCount = await prisma.dailyGame.count()
    const gameSessionCount = await prisma.gameSession.count()

    console.log(`📊 Record counts: Users: ${userCount}, DailyGames: ${dailyGameCount}, GameSessions: ${gameSessionCount}`)

    // 3. Get sample data if it exists
    const sampleUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    const sampleDailyGames = await prisma.dailyGame.findMany({
      take: 5,
      orderBy: { playedDate: 'desc' }
    })

    // 4. Test environment variables
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_PUBLIC_URL: !!process.env.DATABASE_PUBLIC_URL,
      NODE_ENV: process.env.NODE_ENV,
      // Don't log actual URLs for security
      DATABASE_URL_PREVIEW: process.env.DATABASE_URL?.substring(0, 30) + '...',
      DATABASE_PUBLIC_URL_PREVIEW: process.env.DATABASE_PUBLIC_URL?.substring(0, 30) + '...'
    }

    console.log('🔧 Environment status:', envStatus)

    return NextResponse.json({
      status: 'success',
      connection: 'connected',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      database: {
        tables: {
          users: userCount,
          dailyGames: dailyGameCount,
          gameSessions: gameSessionCount
        },
        sampleData: {
          users: sampleUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            totalXP: user.totalXP,
            level: user.currentLevel,
            createdAt: user.createdAt
          })),
          dailyGames: sampleDailyGames.map(game => ({
            id: game.id,
            userId: game.userId,
            gameId: game.gameId,
            xpEarned: game.xpEarned,
            playedDate: game.playedDate
          }))
        }
      },
      message: userCount === 0 ? 
        '⚠️ No users found in database - registration is likely broken' : 
        `✅ Found ${userCount} users in database`
    })

  } catch (error) {
    console.error('❌ Database debug failed:', error)
    
    return NextResponse.json({
      status: 'error',
      connection: 'failed',
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'UnknownError'
      },
      environment: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        DATABASE_PUBLIC_URL: !!process.env.DATABASE_PUBLIC_URL,
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}