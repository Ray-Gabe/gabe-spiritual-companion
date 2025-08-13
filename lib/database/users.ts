import { prisma } from './client'

// User management functions
export async function createUser(name: string, email?: string | null) {
  return await prisma.user.create({
    data: {
      name,
      email: email || undefined,
    },
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      daily_games: {
        where: {
          played_date: new Date().toISOString().split('T')[0],
        },
      },
    },
  })
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const newTotalXP = user.total_xp + xpToAdd
  const newLevel = calculateLevel(newTotalXP)

  return await prisma.user.update({
    where: { id: userId },
    data: {
      total_xp: newTotalXP,
      current_level: newLevel,
      last_activity: new Date(),
    },
  })
}

// Daily game tracking
export async function recordDailyGame(
  userId: string,
  gameId: string,
  xpEarned: number,
  score: number
) {
  const today = new Date().toISOString().split('T')[0]

  // Check if already played today
  const existingGame = await prisma.dailyGame.findFirst({
    where: {
      user_id: userId,
      game_id: gameId,
      played_date: today,
    },
  })

  if (existingGame) {
    throw new Error('Game already played today')
  }

  // Record the game
  const dailyGame = await prisma.dailyGame.create({
    data: {
      user_id: userId,
      game_id: gameId,
      played_date: today,
      xp_earned: xpEarned,
      score,
    },
  })

  // Update user XP
  await updateUserXP(userId, xpEarned)

  return dailyGame
}

export async function hasPlayedToday(userId: string, gameId: string) {
  const today = new Date().toISOString().split('T')[0]

  const game = await prisma.dailyGame.findFirst({
    where: {
      user_id: userId,
      game_id: gameId,
      played_date: today,
    },
  })

  return !!game
}

export async function getTodaysGames(userId: string) {
  const today = new Date().toISOString().split('T')[0]

  return await prisma.dailyGame.findMany({
    where: {
      user_id: userId,
      played_date: today,
    },
  })
}

// Helper function to calculate level
function calculateLevel(xp: number): string {
  if (xp < 25) return 'Seedling'
  if (xp < 75) return 'Disciple'
  if (xp < 150) return 'Messenger'
  if (xp < 300) return 'Guardian'
  return 'Kingdom Builder'
}