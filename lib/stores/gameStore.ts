import { create } from 'zustand'

interface DailyScenario {
  scenario: string
  choices: any[]
  verse: string
  verseText: string
  seed: string
}

interface BibleQuiz {
  question: string
  isCorrect: boolean
  explanation: string
  realVerse: string
  realText: string
}

interface MoodVerse {
  mood: string
  verse: string
  text: string
  promise: string
}

interface GameState {
  dailyContent: {
    scenario: DailyScenario | null
    quiz: BibleQuiz | null
    verse: MoodVerse | null
  }
  currentGame: string | null
  gameProgress: Record<string, any>
  setDailyContent: (content: Partial<GameState['dailyContent']>) => void
  setCurrentGame: (game: string | null) => void
  updateGameProgress: (gameId: string, progress: any) => void
}

export const useGameStore = create<GameState>((set) => ({
  dailyContent: {
    scenario: null,
    quiz: null,
    verse: null
  },
  currentGame: null,
  gameProgress: {},
  setDailyContent: (content) => set((state) => ({
    dailyContent: { ...state.dailyContent, ...content }
  })),
  setCurrentGame: (game) => set({ currentGame: game }),
  updateGameProgress: (gameId, progress) => set((state) => ({
    gameProgress: { ...state.gameProgress, [gameId]: progress }
  }))
}))