import { create } from 'zustand'
import { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']

interface UserState {
  user: User | null
  xp: number
  level: string
  setUser: (user: User) => void
  addXP: (amount: number) => void
  updateLevel: (level: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  xp: 0,
  level: 'Seedling',
  setUser: (user) => set({ user, xp: user.total_xp, level: user.spiritual_level }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  updateLevel: (level) => set({ level })
}))