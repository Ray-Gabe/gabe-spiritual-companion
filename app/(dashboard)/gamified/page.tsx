'use client'

import { useState } from 'react'
import { Brain, Heart, Users, Shield, Crown, Lightbulb, CheckCircle } from 'lucide-react'
import { useUnifiedXPSystem } from '@/lib/unified-xp-system'

// ==================== SPIRITUAL GAMES DATA ====================
const SPIRITUAL_GAMES = [
  {
    id: 'scripture-detective',
    title: "Scripture Detective",
    description: "Can you spot the real Bible verse from the fake ones?",
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    question: "Which of these is a REAL Bible verse?",
    options: [
      { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.", isCorrect: true },
      { text: "The Lord helps those who help themselves and work hard for their blessings.", isCorrect: false },
      { text: "God wants you to be rich and successful in all your earthly endeavors.", isCorrect: false },
      { text: "Prayer is just positive thinking that makes you feel better about yourself.", isCorrect: false }
    ]
  },
  {
    id: 'moral-compass',
    title: "Moral Compass",
    description: "Navigate ethical scenarios with biblical wisdom",
    icon: Heart,
    color: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    question: "Your friend asks you to lie to their parents. What should you do?",
    options: [
      { text: "Lie to help your friend avoid trouble", isCorrect: false },
      { text: "Tell your friend you can't lie, and encourage honesty", isCorrect: true },
      { text: "Ignore the situation and walk away", isCorrect: false },
      { text: "Tell the parents yourself without talking to your friend", isCorrect: false }
    ]
  },
  {
    id: 'faith-heroes',
    title: "Faith Heroes Journey",
    description: "Learn from biblical characters and their faith stories",
    icon: Users,
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-500',
    question: "Who trusted God even when asked to sacrifice his son?",
    options: [
      { text: "Moses", isCorrect: false },
      { text: "David", isCorrect: false },
      { text: "Abraham", isCorrect: true },
      { text: "Noah", isCorrect: false }
    ]
  },
  {
    id: 'love-language',
    title: "Love Language Lab",
    description: "Practice showing love in practical, biblical ways",
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-200',
    iconColor: 'text-pink-500',
    question: "How can you show love to someone who hurt you?",
    options: [
      { text: "Ignore them completely", isCorrect: false },
      { text: "Get revenge to teach them a lesson", isCorrect: false },
      { text: "Forgive them and treat them with kindness", isCorrect: true },
      { text: "Tell everyone what they did wrong", isCorrect: false }
    ]
  },
  {
    id: 'wisdom-warrior',
    title: "Wisdom Warrior",
    description: "Counter worldly lies with biblical truth",
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    question: "The world says 'Follow your heart.' What does the Bible say?",
    options: [
      { text: "The heart is deceitful above all things", isCorrect: true },
      { text: "Always trust your feelings", isCorrect: false },
      { text: "Your heart knows what's best for you", isCorrect: false },
      { text: "Emotions are the best guide for decisions", isCorrect: false }
    ]
  },
  {
    id: 'prayer-powerup',
    title: "Prayer Power-Up",
    description: "Learn different prayer styles and biblical approaches",
    icon: Crown,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-200',
    iconColor: 'text-cyan-500',
    question: "What should be included in a balanced prayer?",
    options: [
      { text: "Only asking for things you want", isCorrect: false },
      { text: "Praise, confession, thanksgiving, and requests", isCorrect: true },
      { text: "Just saying thank you", isCorrect: false },
      { text: "Only praying when you need something", isCorrect: false }
    ]
  }
]

export default function GamifiedPage() {
  // ==================== UNIFIED XP SYSTEM ====================
  const { stats, awardXP, canPlayGame } = useUnifiedXPSystem()
  
  // ==================== GAME MODAL STATE ====================
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // ==================== GAME HANDLERS ====================
  const handleGameClick = (gameId: string) => {
    if (!canPlayGame(gameId)) {
      alert('You already played this game today! Come back tomorrow. 😊')
      return
    }
    setActiveGame(gameId)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const selectAnswer = (selected: number, correct: number) => {
    setSelectedAnswer(selected)
    setShowResult(true)

    setTimeout(() => {
      if (selected === correct) {
        const result = awardXP(25, activeGame!) // Award 25 XP for correct answer
        alert(result.message) // Will show level up or correct message
      } else {
        alert('Try again! The correct answer was highlighted.')
      }
      
      // Reset and close modal
      setActiveGame(null)
      setSelectedAnswer(null)
      setShowResult(false)
    }, 1500)
  }

  // ==================== RENDER ====================
  const activeGameData = activeGame ? SPIRITUAL_GAMES.find(g => g.id === activeGame) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">✨ GABEIFIED ✨</h1>
        <p className="text-purple-200">Spiritual Growth Through Gamified Learning</p>
      </div>

      {/* Progress Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {stats.levelIcon} {stats.currentLevel}
              </h2>
              <p className="text-gray-600">{stats.currentXP} XP</p>
              {stats.xpToNextLevel > 0 && (
                <p className="text-sm text-gray-500">{stats.xpToNextLevel} XP to {stats.nextLevel}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Games Today</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.gamesPlayedToday}/{stats.totalGamesAvailable}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {Math.round(stats.progress)}% to next level
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPIRITUAL_GAMES.map((game) => {
            const IconComponent = game.icon
            const isCompleted = !canPlayGame(game.id)
            
            return (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${game.borderColor} border-2 ${
                  isCompleted ? 'opacity-75 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${game.color} mr-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{game.title}</h3>
                    {isCompleted && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed Today
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{game.description}</p>
              </div>
            )
          })}
        </div>

        {/* Daily Progress Summary */}
        {stats.gamesPlayedToday === stats.totalGamesAvailable && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-6 text-center">
            <h3 className="font-bold">🎉 All Games Completed Today!</h3>
            <p>You've completed all spiritual challenges for today. Come back tomorrow for more!</p>
          </div>
        )}
      </div>

      {/* Game Modal */}
      {activeGame && activeGameData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">{activeGameData.title}</h2>
            <p className="mb-6">{activeGameData.question}</p>
            
            <div className="space-y-2">
              {activeGameData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && selectAnswer(index, activeGameData.options.findIndex(o => o.isCorrect))}
                  disabled={showResult}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    showResult
                      ? option.isCorrect
                        ? 'bg-green-500 text-white' // Correct answer
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'   // Wrong selected answer
                        : 'bg-gray-200'             // Other options
                      : 'bg-blue-100 hover:bg-blue-200'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setActiveGame(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}