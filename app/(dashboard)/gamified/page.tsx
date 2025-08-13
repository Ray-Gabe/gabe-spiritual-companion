'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, Star, Target, Heart, Brain, Shield, Sparkles, CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react'

// Types
interface User {
  id: string;
  name: string;
  total_xp: number;
  current_level: string;
  streak_days: number;
}

interface PlayedGame {
  game_id: string;
  xp_earned: number;
  score: number;
}

// Modern 6 Games with Real Gameplay
const SPIRITUAL_GAMES = [
  {
    id: 'scripture-detective',
    title: "Scripture Detective",
    description: "Can you spot the real Bible verse from the fake ones?",
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-100',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    type: "multiple-choice",
    question: "Which of these is a REAL Bible verse?",
    options: [
      { text: "God helps those who help themselves", isCorrect: false, explanation: "This is actually NOT in the Bible! It's a common saying but Benjamin Franklin said it." },
      { text: "For I know the plans I have for you, declares the Lord", isCorrect: true, explanation: "✅ Correct! This is Jeremiah 29:11 - one of God's most comforting promises." },
      { text: "Cleanliness is next to godliness", isCorrect: false, explanation: "Nope! This phrase isn't biblical - it was coined by John Wesley in the 1700s." },
      { text: "Money is the root of all evil", isCorrect: false, explanation: "Close, but not quite! The Bible says 'LOVE of money' is the root of evil (1 Timothy 6:10)." }
    ],
    hint: "💡 Look for verses that focus on God's character and promises to His people.",
    learning: "Many popular sayings sound biblical but aren't! Always check if wisdom aligns with God's character.",
    points: { correct: 100, wrong: 10 }
  },
  {
    id: 'moral-compass',
    title: "Moral Compass",
    description: "Navigate ethical scenarios with biblical wisdom",
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-100',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    type: "scenario",
    scenario: "Your best friend asks you to lie to their parents about where they were last night. They promise they weren't doing anything dangerous.",
    question: "What's the most Christ-like response?",
    options: [
      { text: "Lie to help your friend", isCorrect: false, explanation: "Even 'white lies' to help others go against God's call for truthfulness." },
      { text: "Refuse and tell them lying is wrong", isCorrect: true, explanation: "✅ Perfect! Speaking truth in love shows real friendship and honors God." },
      { text: "Avoid the parents completely", isCorrect: false, explanation: "Avoiding the situation doesn't address the heart issue or help your friend grow." },
      { text: "Tell the parents yourself", isCorrect: false, explanation: "This betrays trust without first giving your friend a chance to do what's right." }
    ],
    hint: "💡 Think about Ephesians 4:15 - 'Speaking the truth in love'",
    learning: "True friendship means helping each other grow in character, even when it's uncomfortable.",
    points: { correct: 150, wrong: 25 }
  },
  {
    id: 'faith-heroes',
    title: "Faith Heroes Journey",
    description: "Walk with Bible heroes in their moments of faith",
    icon: Trophy,
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'from-amber-50 to-yellow-100',
    borderColor: 'border-amber-200',
    iconColor: 'text-orange-500',
    type: "matching",
    challenge: "David faced a giant with just a sling and stones. What gave him courage?",
    question: "What gave David courage to face Goliath?",
    options: [
      { text: "His military training", isCorrect: false, explanation: "David was just a young shepherd, not a trained soldier." },
      { text: "His faith in God's power", isCorrect: true, explanation: "✅ Yes! David trusted that God who helped him defeat lions and bears could defeat Goliath too." },
      { text: "His anger at the giant", isCorrect: false, explanation: "David wasn't acting from anger, but from faith and righteous zeal for God's honor." },
      { text: "Peer pressure from the army", isCorrect: false, explanation: "Actually, the whole army was afraid! David stood alone in faith." }
    ],
    hint: "💡 Remember: David said 'The Lord who rescued me from the paw of the lion... will rescue me from this Philistine'",
    learning: "Past faithfulness builds future courage. God's track record in your life is your foundation for trusting Him in new challenges.",
    points: { correct: 125, wrong: 20 }
  },
  {
    id: 'love-language',
    title: "Love Language Lab",
    description: "Practice showing God's love in practical ways",
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'from-pink-50 to-rose-100',
    borderColor: 'border-pink-200',
    iconColor: 'text-pink-500',
    type: "application",
    situation: "Your little sibling is having a really hard day and feels left out at school.",
    question: "How can you show them God's love in a practical way?",
    options: [
      { text: "Tell them to pray about it", isCorrect: false, explanation: "While prayer is good, they need to feel loved and supported first." },
      { text: "Listen, encourage, and spend quality time with them", isCorrect: true, explanation: "✅ Perfect! This mirrors how God listens to us and is always present in our struggles." },
      { text: "Buy them something to cheer them up", isCorrect: false, explanation: "Gifts are nice, but presence and emotional support matter more." },
      { text: "Tell them it's not a big deal", isCorrect: false, explanation: "Dismissing their feelings doesn't show love or help them process emotions." }
    ],
    hint: "💡 Think about how Jesus comforted people - with presence, listening, and genuine care",
    learning: "God's love is active and present. We show His love by truly seeing and caring for others' hearts.",
    points: { correct: 175, wrong: 30 }
  },
  {
    id: 'wisdom-warrior',
    title: "Wisdom Warrior",
    description: "Battle worldly lies with biblical truth",
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'from-purple-50 to-violet-100',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    type: "defense",
    attack: "Social media influence: 'You only live once! Do whatever makes you happy, even if it hurts others.'",
    question: "What biblical truth defeats this lie?",
    options: [
      { text: "Happiness is the most important thing", isCorrect: false, explanation: "The Bible calls us to joy (deeper than happiness) that comes from serving God and others." },
      { text: "We live for God's glory, not just our pleasure", isCorrect: true, explanation: "✅ Exactly! 1 Corinthians 10:31 - 'Do everything for the glory of God' - this brings true fulfillment." },
      { text: "Other people don't matter as much as you", isCorrect: false, explanation: "Jesus taught us to love others as ourselves - their wellbeing matters deeply." },
      { text: "Rules are meant to be broken", isCorrect: false, explanation: "God's guidelines protect us and help us flourish - they're loving boundaries, not restrictions." }
    ],
    hint: "💡 Remember: True freedom comes from living according to God's design for human flourishing",
    learning: "The world's definition of freedom often leads to bondage. God's 'restrictions' are actually the path to true life and joy.",
    points: { correct: 200, wrong: 15 }
  },
  {
    id: 'prayer-powerup',
    title: "Prayer Power-Up",
    description: "Level up your prayer life with biblical styles",
    icon: Sparkles,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'from-cyan-50 to-blue-100',
    borderColor: 'border-cyan-200',
    iconColor: 'text-cyan-500',
    type: "practice",
    challenge: "You're stressed about a big test tomorrow. How do you pray about it?",
    question: "Which prayer approach combines trust, honesty, and surrender?",
    options: [
      { text: "'God, You better help me pass this test!'", isCorrect: false, explanation: "This sounds more like demanding than trusting. God isn't our genie!" },
      { text: "'God, I'm really nervous about this test. Please give me peace and help me do my best. Your will be done.'", isCorrect: true, explanation: "✅ Beautiful! This combines honesty about feelings, a specific request, and surrender to God's will." },
      { text: "'I don't need to pray, I studied hard.'", isCorrect: false, explanation: "While studying is important, prayer acknowledges our dependence on God for everything." },
      { text: "'If I fail, it means God doesn't love me.'", isCorrect: false, explanation: "God's love isn't based on our performance! His love is unconditional and eternal." }
    ],
    hint: "💡 Think about Jesus' prayer in the garden: honest about His feelings but surrendered to the Father's will",
    learning: "Powerful prayer includes: Honesty about our feelings + Specific requests + Trust in God's character + Surrender to His will",
    points: { correct: 150, wrong: 25 }
  }
]

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Great Job!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="text-4xl mb-4">😇</div>
        <p className="text-purple-600 font-semibold mb-6">See ya tomorrow for more spiritual adventures!</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default function GamifiedPage() {
  // State management with proper types
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [playedToday, setPlayedToday] = useState<PlayedGame[]>([])
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  // Initialize user and load today's games
  useEffect(() => {
    initializeUser()
  }, [])

  const initializeUser = async () => {
    try {
      setLoading(true)
      
      // For now, create a test user or get from localStorage
      let userId = localStorage.getItem('gabe_user_id')
      
      if (!userId) {
        // Create new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Player', email: null })
        })
        const newUser = await response.json()
        localStorage.setItem('gabe_user_id', newUser.id)
        setUser(newUser)
        setPlayedToday([])
      } else {
        // Get existing user and today's games
        const userResponse = await fetch(`/api/users/${userId}`)
        const userData = await userResponse.json()
        setUser(userData)
        
        const gamesResponse = await fetch(`/api/users/${userId}/today-games`)
        const gamesData = await gamesResponse.json()
        setPlayedToday(gamesData)
      }
    } catch (error) {
      console.error('Failed to initialize user:', error)
      // Fallback to local state
      setUser({ id: 'local', name: 'Player', total_xp: 15, current_level: 'Seedling', streak_days: 0 })
      setPlayedToday([])
    } finally {
      setLoading(false)
    }
  }

  const handleGameClick = (gameId: string) => {
    // Check if already played today
    const alreadyPlayed = playedToday.some(game => game.game_id === gameId)
    if (alreadyPlayed) {
      setSuccessMessage("You've already completed this game today! Come back tomorrow for a new challenge.")
      setShowSuccessModal(true)
      return
    }

    setActiveGame(gameId)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = async (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
    setShowResult(true)
    
    const currentGame = SPIRITUAL_GAMES.find(g => g.id === activeGame)
    if (!currentGame || !user) return

    const isCorrect = currentGame.options[optionIndex].isCorrect
    const xpEarned = isCorrect ? currentGame.points.correct : currentGame.points.wrong
    
    if (isCorrect) {
      setGameScore(gameScore + xpEarned)
      setStreak(streak + 1)
    } else {
      setGameScore(gameScore + xpEarned)
      setStreak(0)
    }

    // Save to database
    try {
      if (user.id !== 'local') {
        await fetch('/api/games/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            gameId: activeGame,
            xpEarned,
            score: isCorrect ? 100 : 0
          })
        })

        // Update user data
        const updatedUser = await fetch(`/api/users/${user.id}`)
        const userData = await updatedUser.json()
        setUser(userData)

        // Update played games
        setPlayedToday(prev => [...prev, { game_id: activeGame, xp_earned: xpEarned, score: isCorrect ? 100 : 0 }])
      }
    } catch (error) {
      console.error('Failed to save game result:', error)
    }
  }

  const resetGame = () => {
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const backToGames = () => {
    setActiveGame(null)
    setSelectedAnswer(null)
    setShowResult(false)
    
    // Check if all games completed today
    if (playedToday.length >= 5) { // 5 out of 6 games (allowing for one completion)
      setSuccessMessage(`Amazing work! You've completed your spiritual journey for today. You earned ${playedToday.reduce((sum, game) => sum + game.xp_earned, 0)} XP points!`)
      setShowSuccessModal(true)
    }
  }

  const getNextLevelXP = (currentXP: number) => {
    if (currentXP < 25) return 25
    if (currentXP < 75) return 75
    if (currentXP < 150) return 150
    if (currentXP < 300) return 300
    return 500
  }

  const getCurrentLevel = (xp: number) => {
    if (xp < 25) return { name: 'Seedling', icon: '🌱' }
    if (xp < 75) return { name: 'Disciple', icon: '🌿' }
    if (xp < 150) return { name: 'Messenger', icon: '👤' }
    if (xp < 300) return { name: 'Guardian', icon: '🛡️' }
    return { name: 'Kingdom Builder', icon: '👑' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😇</div>
          <div className="text-xl text-gray-600">Loading your spiritual journey...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😇</div>
          <div className="text-xl text-gray-600">Unable to load user data</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const nextLevelXP = getNextLevelXP(user.total_xp)
  const progressPercentage = (user.total_xp / nextLevelXP) * 100
  const currentGame = SPIRITUAL_GAMES.find(g => g.id === activeGame)
  const currentLevel = getCurrentLevel(user.total_xp)

  const allLevels = [
    { name: "Seedling", icon: "🌱", range: "0-24", active: user.total_xp >= 0 && user.total_xp < 25 },
    { name: "Disciple", icon: "🌿", range: "25-74", active: user.total_xp >= 25 && user.total_xp < 75 },
    { name: "Messenger", icon: "👤", range: "75-149", active: user.total_xp >= 75 && user.total_xp < 150 },
    { name: "Guardian", icon: "🛡️", range: "150-299", active: user.total_xp >= 150 && user.total_xp < 300 },
    { name: "Kingdom Builder", icon: "👑", range: "300+", active: user.total_xp >= 300 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      {/* Enhanced Header */}
      <div className="bg-purple-800/60 backdrop-blur-sm border-b border-purple-500/30 p-4 rounded-t-2xl mb-4 mx-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/choice')}
              className="text-purple-200 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            
            {!activeGame && (
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">GABEIFIED</h1>
            <p className="text-orange-300 text-sm italic">"Everyday is a Sunday"</p>
          </div>
          
          {activeGame && (
            <div className="flex items-center gap-6 text-purple-300">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500" size={16} />
                <span className="font-medium">Score: {gameScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-orange-500" size={16} />
                <span className="font-medium">Streak: {streak}</span>
              </div>
            </div>
          )}
        </div>

        {activeGame && (
          <button 
            onClick={backToGames} 
            className="flex items-center gap-2 text-purple-300 hover:text-white mt-4"
          >
            <ArrowLeft size={16} />
            <span>Back to Games</span>
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!activeGame ? (
          <>
            {/* Enhanced iOS-Style Progress Card */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border-2 border-blue-200">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">{currentLevel.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{currentLevel.name}</h2>
                    <p className="text-gray-500 text-xs">{user.total_xp} XP Points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium text-sm">Progress to {user.total_xp < 25 ? 'Disciple' : user.total_xp < 75 ? 'Messenger' : user.total_xp < 150 ? 'Guardian' : user.total_xp < 300 ? 'Kingdom Builder' : 'Master'}</p>
                  <p className="text-gray-500 text-xs">{Math.round(progressPercentage)}%</p>
                </div>
              </div>

              {/* Clean Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Enhanced Level Journey */}
              <div className="flex justify-between">
                {allLevels.map((level, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      level.active 
                        ? 'bg-blue-500 shadow-sm' 
                        : user.total_xp >= parseInt(level.range.split('-')[0]) || level.range.includes('+')
                        ? 'bg-gray-300'
                        : 'bg-gray-200'
                    }`}>
                      <span className={`text-xs ${level.active ? '' : 'opacity-40'}`}>
                        {level.icon}
                      </span>
                    </div>
                    <p className={`text-xs font-medium mb-0.5 ${level.active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {level.name}
                    </p>
                    <p className={`text-xs ${level.active ? 'text-gray-500' : 'text-gray-400'}`}>
                      {level.range} XP
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Progress Info */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 mb-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📅</span>
                <h3 className="text-lg font-bold text-gray-800">Today's Progress</h3>
              </div>
              <p className="text-gray-600">
                You've completed {playedToday.length} out of 6 games today. 
                {playedToday.length === 6 ? " Amazing work! 🎉" : " Keep going! 💪"}
              </p>
            </div>

            {/* Enhanced Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPIRITUAL_GAMES.map((game) => {
                const IconComponent = game.icon
                const isCompleted = playedToday.some(played => played.game_id === game.id)
                
                return (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform relative ${
                      isCompleted 
                        ? 'border-green-300 bg-green-50' 
                        : `${game.borderColor} hover:scale-105 hover:shadow-xl`
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className={isCompleted ? 'text-green-500' : game.iconColor} size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{game.description}</p>
                      {isCompleted && (
                        <p className="text-green-600 text-sm font-medium mt-2">✅ Completed today!</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Footer */}
            <div className="mt-6 mx-6">
              <div className="bg-purple-800/60 backdrop-blur-sm rounded-b-2xl p-4 shadow-lg border border-purple-500/30">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="text-orange-300" size={16} />
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">WHERE FAITH MEETS FUN</span>
                    <span className="text-sm italic text-orange-300">"Every game teaches, every play grows your spirit"</span>
                  </div>
                  <Sparkles className="text-orange-300" size={16} />
                </div>
              </div>
            </div>
          </>
        ) : currentGame && (
          /* Individual Game Interface - Same as before but with database integration */
          <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-lg mx-6">
            {/* Game Header */}
            <div className={`bg-gradient-to-r ${currentGame.color} p-6`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <currentGame.icon className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentGame.title}</h3>
                  <p className="text-white/90 text-sm">{currentGame.description}</p>
                </div>
              </div>
            </div>

            {/* Game Content - Same as before */}
            <div className="p-6 bg-gray-50">
              {/* Scenario/Challenge/Situation/Attack */}
              {currentGame.scenario && (
                <div className="bg-white rounded-xl p-4 mb-4 border-2 border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Scenario:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{currentGame.scenario}</p>
                </div>
              )}

              {currentGame.challenge && (
                <div className="bg-white rounded-xl p-4 mb-4 border-2 border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Challenge:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{currentGame.challenge}</p>
                </div>
              )}

              {currentGame.situation && (
                <div className="bg-white rounded-xl p-4 mb-4 border-2 border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Situation:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{currentGame.situation}</p>
                </div>
              )}

              {currentGame.attack && (
                <div className="bg-red-50 rounded-xl p-4 mb-4 border-2 border-red-200">
                  <h4 className="text-sm font-semibold text-red-600 mb-2">🛡️ Incoming Attack:</h4>
                  <p className="text-red-700 text-sm leading-relaxed italic">"{currentGame.attack}"</p>
                </div>
              )}

              <h4 className="text-lg font-bold text-gray-800 mb-4">{currentGame.question}</h4>

              {/* Hint */}
              {!showResult && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-blue-500" size={14} />
                    <span className="text-blue-600 font-medium text-sm">Hint</span>
                  </div>
                  <p className="text-blue-700 text-sm">{currentGame.hint}</p>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3 mb-4">
                {currentGame.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                      showResult
                        ? option.isCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : selectedAnswer === index
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-300 bg-gray-50 text-gray-600'
                        : selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {showResult && (
                        option.isCorrect ? (
                          <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                        ) : selectedAnswer === index ? (
                          <XCircle className="text-red-500 flex-shrink-0" size={16} />
                        ) : (
                          <div className="w-4 h-4 flex-shrink-0" />
                        )
                      )}
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Result */}
              {showResult && selectedAnswer !== null && (
                <div className="space-y-4">
                  <div className={`rounded-xl p-4 border-2 ${
                    currentGame.options[selectedAnswer].isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}>
                    <h5 className={`font-bold text-sm mb-2 ${
                      currentGame.options[selectedAnswer].isCorrect
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {currentGame.options[selectedAnswer].isCorrect ? '🎉 Correct!' : '❌ Not Quite!'}
                    </h5>
                    <p className={`text-sm leading-relaxed ${
                      currentGame.options[selectedAnswer].isCorrect
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {currentGame.options[selectedAnswer].explanation}
                    </p>
                  </div>

                  {/* Learning Section */}
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="text-blue-500" size={16} />
                      <h5 className="text-blue-700 font-bold text-sm">What You Learned</h5>
                    </div>
                    <p className="text-blue-600 text-sm leading-relaxed">{currentGame.learning}</p>
                  </div>

                  {/* Points Earned */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm border-2 ${
                      currentGame.options[selectedAnswer].isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <Trophy className={`${
                        currentGame.options[selectedAnswer].isCorrect
                          ? 'text-green-500'
                          : 'text-orange-500'
                      }`} size={16} />
                      <span className={`font-bold ${
                        currentGame.options[selectedAnswer].isCorrect
                          ? 'text-green-700'
                          : 'text-orange-700'
                      }`}>
                        +{currentGame.options[selectedAnswer].isCorrect 
                          ? currentGame.points.correct 
                          : currentGame.points.wrong} XP Earned!
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center pt-4">
                    <button
                      onClick={resetGame}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all text-sm font-medium border-2 border-gray-300"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={backToGames}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:scale-105 transition-all text-sm font-medium border-2 border-orange-400"
                    >
                      Play Another Game
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  )
}