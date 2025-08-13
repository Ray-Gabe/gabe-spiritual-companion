import { create } from 'zustand'

interface User {
  id: string
  name: string
  total_xp: number
  current_level: string
  streak_days: number
}

interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User) => void
  loadUser: (userId: string) => Promise<void>
  addXP: (amount: number, gameId: string) => Promise<void>
  updateLevel: (level: string) => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  
  loadUser: async (userId: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        set({ user: userData })
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      set({ isLoading: false })
    }
  },
  
  addXP: async (amount: number, gameId: string) => {
    const { user } = get()
    if (!user) return
    
    try {
      const response = await fetch('/api/games/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          gameId,
          xpEarned: amount,
          score: amount
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        set({ user: data.user })
      }
    } catch (error) {
      console.error('Error recording game:', error)
    }
  },
  
  updateLevel: (level: string) => {
    const { user } = get()
    if (user) {
      set({ user: { ...user, current_level: level } })
    }
  }
}))