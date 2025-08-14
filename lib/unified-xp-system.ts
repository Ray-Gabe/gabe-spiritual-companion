// ==================== UNIFIED XP SYSTEM ====================
// Single source of truth that consolidates all three systems

interface LevelInfo {
  name: string
  icon: string
  xpRequired: number
  xpToNext: number
}

class UnifiedXPSystem {
  private currentXP: number = 0
  private currentLevel: string = 'Seedling'
  private gamesPlayedToday: string[] = []
  private lastPlayDate: string = ''

  // UNIFIED LEVEL DEFINITIONS (best of all systems)
  private levels = {
    'Seedling': { xpRequired: 0, icon: '🌱', next: 'Disciple' },
    'Disciple': { xpRequired: 100, icon: '📖', next: 'Messenger' },
    'Messenger': { xpRequired: 300, icon: '📢', next: 'Guardian' },
    'Guardian': { xpRequired: 600, icon: '🛡️', next: 'Kingdom Builder' },
    'Kingdom Builder': { xpRequired: 1000, icon: '👑', next: 'Kingdom Builder' }
  }

  constructor() {
    this.loadUserProgress()
    this.migrateOldData()
  }

  // Load progress from localStorage
  loadUserProgress() {
    if (typeof window === 'undefined') return

    // Try new unified key first, then fallback to old keys
    this.currentXP = parseInt(localStorage.getItem('gabeUnifiedXP') || 
                              localStorage.getItem('userXP') || 
                              localStorage.getItem('gabeXP') || '0')
    
    this.currentLevel = localStorage.getItem('gabeUnifiedLevel') || 
                       localStorage.getItem('userLevel') || 
                       this.calculateLevelFromXP(this.currentXP)

    // Load daily games
    const savedGames = JSON.parse(localStorage.getItem('gabeUnifiedGamesToday') || '[]')
    const savedDate = localStorage.getItem('gabeUnifiedLastPlay') || ''
    
    const today = new Date().toDateString()
    if (savedDate === today) {
      this.gamesPlayedToday = savedGames
    } else {
      this.gamesPlayedToday = []
      this.lastPlayDate = today
      this.saveProgress()
    }
  }

  // Migrate data from old systems to unified system
  migrateOldData() {
    if (typeof window === 'undefined') return

    const oldUserXP = localStorage.getItem('userXP')
    const oldGabeXP = localStorage.getItem('gabeXP')
    const hasUnifiedData = localStorage.getItem('gabeUnifiedXP')

    // Only migrate if we don't have unified data yet
    if (!hasUnifiedData && (oldUserXP || oldGabeXP)) {
      console.log('🔄 Migrating XP data to unified system...')
      
      // Use the higher XP value between the two old systems
      const userXPValue = parseInt(oldUserXP || '0')
      const gabeXPValue = parseInt(oldGabeXP || '0')
      this.currentXP = Math.max(userXPValue, gabeXPValue)
      
      this.currentLevel = this.calculateLevelFromXP(this.currentXP)
      this.saveProgress()
      
      console.log(`✅ Migrated XP: ${this.currentXP}, Level: ${this.currentLevel}`)
    }
  }

  // Calculate level from XP amount
  calculateLevelFromXP(xp: number): string {
    if (xp >= 1000) return 'Kingdom Builder'
    if (xp >= 600) return 'Guardian'
    if (xp >= 300) return 'Messenger'
    if (xp >= 100) return 'Disciple'
    return 'Seedling'
  }

  // Get level info
  getLevelInfo(levelName: string = this.currentLevel): LevelInfo {
    const level = this.levels[levelName as keyof typeof this.levels]
    const levelNames = Object.keys(this.levels)
    const currentIndex = levelNames.indexOf(levelName)
    const nextLevel = levelNames[currentIndex + 1] || levelName
    const nextLevelXP = this.levels[nextLevel as keyof typeof this.levels]?.xpRequired || 9999

    return {
      name: levelName,
      icon: level.icon,
      xpRequired: level.xpRequired,
      xpToNext: Math.max(0, nextLevelXP - this.currentXP)
    }
  }

  // Award XP (main function)
  awardXP(amount: number, gameId: string): { success: boolean; levelUp: boolean; newLevel?: string; message: string } {
    // Check daily limit
    if (this.gamesPlayedToday.includes(gameId)) {
      return {
        success: false,
        levelUp: false,
        message: 'You already played this game today! Come back tomorrow. 😊'
      }
    }

    const oldLevel = this.currentLevel
    this.currentXP += amount

    // Check for level up
    const newLevel = this.calculateLevelFromXP(this.currentXP)
    const levelUp = newLevel !== oldLevel

    if (levelUp) {
      this.currentLevel = newLevel
    }

    // Record game completion
    this.gamesPlayedToday.push(gameId)
    this.lastPlayDate = new Date().toDateString()

    // Save progress
    this.saveProgress()

    const message = levelUp 
      ? `🎉 Level up! You're now a ${newLevel}! (+${amount} XP)`
      : `Correct! +${amount} XP`

    return {
      success: true,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      message
    }
  }

  // Save progress to localStorage
  saveProgress() {
    if (typeof window === 'undefined') return

    localStorage.setItem('gabeUnifiedXP', this.currentXP.toString())
    localStorage.setItem('gabeUnifiedLevel', this.currentLevel)
    localStorage.setItem('gabeUnifiedGamesToday', JSON.stringify(this.gamesPlayedToday))
    localStorage.setItem('gabeUnifiedLastPlay', this.lastPlayDate)
  }

  // Check if game can be played
  canPlayGame(gameId: string): boolean {
    return !this.gamesPlayedToday.includes(gameId)
  }

  // Get current stats
  getStats() {
    const levelInfo = this.getLevelInfo()
    const nextLevelInfo = this.getLevelInfo(this.levels[this.currentLevel as keyof typeof this.levels].next)
    
    const progress = this.currentLevel === 'Kingdom Builder' 
      ? 100 
      : ((this.currentXP - levelInfo.xpRequired) / (nextLevelInfo.xpRequired - levelInfo.xpRequired)) * 100

    return {
      currentXP: this.currentXP,
      currentLevel: this.currentLevel,
      levelIcon: levelInfo.icon,
      progress: Math.min(progress, 100),
      gamesPlayedToday: this.gamesPlayedToday.length,
      totalGamesAvailable: 6,
      xpToNextLevel: levelInfo.xpToNext,
      nextLevel: this.levels[this.currentLevel as keyof typeof this.levels].next
    }
  }

  // Reset progress (for testing)
  resetProgress() {
    this.currentXP = 0
    this.currentLevel = 'Seedling'
    this.gamesPlayedToday = []
    this.lastPlayDate = ''
    
    // Clear all old localStorage keys
    localStorage.removeItem('gabeUnifiedXP')
    localStorage.removeItem('gabeUnifiedLevel')
    localStorage.removeItem('gabeUnifiedGamesToday')
    localStorage.removeItem('gabeUnifiedLastPlay')
    localStorage.removeItem('userXP')
    localStorage.removeItem('userLevel')
    localStorage.removeItem('gabeXP')
    
    console.log('🔄 Progress reset to Seedling level!')
  }

  // Clean up old localStorage keys after migration
  cleanupOldData() {
    localStorage.removeItem('userXP')
    localStorage.removeItem('userLevel')
    localStorage.removeItem('gabeXP')
    localStorage.removeItem('gamesPlayedToday')
    console.log('🧹 Cleaned up old localStorage keys')
  }
}

// ==================== REACT HOOK FOR UNIFIED SYSTEM ====================
import { useState, useEffect } from 'react'

export function useUnifiedXPSystem() {
  const [xpSystem] = useState(() => new UnifiedXPSystem())
  const [stats, setStats] = useState(xpSystem.getStats())

  // Update stats when XP changes
  const refreshStats = () => {
    setStats(xpSystem.getStats())
  }

  useEffect(() => {
    refreshStats()
  }, [])

  const awardXP = (amount: number, gameId: string) => {
    const result = xpSystem.awardXP(amount, gameId)
    refreshStats() // Update UI
    return result
  }

  const canPlayGame = (gameId: string) => {
    return xpSystem.canPlayGame(gameId)
  }

  const resetProgress = () => {
    xpSystem.resetProgress()
    refreshStats()
  }

  return {
    stats,
    awardXP,
    canPlayGame,
    resetProgress,
    refreshStats
  }
}

// ==================== USAGE EXAMPLE ====================
/*
// In your React component:
const { stats, awardXP, canPlayGame } = useUnifiedXPSystem()

// Check if game can be played
if (canPlayGame('scripture-detective')) {
  // Award XP when game is completed
  const result = awardXP(25, 'scripture-detective')
  
  if (result.success) {
    alert(result.message)
  } else {
    alert(result.message) // Already played today
  }
}

// Display current stats
console.log(`XP: ${stats.currentXP}, Level: ${stats.currentLevel}`)
console.log(`Progress: ${stats.progress}%, Games Today: ${stats.gamesPlayedToday}/${stats.totalGamesAvailable}`)
*/