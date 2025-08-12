'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, Star, Target, Heart, Brain, Shield, Sparkles, CheckCircle } from 'lucide-react'

const GAME_CONFIGS = {
  'whos-in-charge': {
    title: "Who's in Charge?",
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    description: 'Navigate daily choices with divine wisdom',
    type: 'scenario'
  },
  'broken-compass': {
    title: 'Broken Compass',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    description: 'Truth or Twisted: Can you spot real Bible verses?',
    type: 'quiz'
  },
  'holy-spirit': {
    title: 'Holy Spirit',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
    description: 'Unlock the Fruits of the Spirit through daily challenges',
    type: 'challenge'
  },
  'rescue-mission': {
    title: 'Rescue Mission',
    icon: Heart,
    color: 'from-orange-500 to-red-500',
    description: 'Experience being found by the Good Shepherd',
    type: 'story'
  },
  'god-promised-me': {
    title: 'God Promised Me',
    icon: Star,
    color: 'from-yellow-500 to-orange-500',
    description: 'Find personalized Bible promises for your mood',
    type: 'mood'
  },
  'ask-me-anything': {
    title: 'Ask Me Anything',
    icon: Shield,
    color: 'from-indigo-500 to-purple-500',
    description: 'Safe space for honest questions about faith',
    type: 'conversation'
  }
}

const FRUITS_OF_SPIRIT = [
  { name: 'Love', verse: '1 Corinthians 13:4', challenge: 'Show love to someone who annoyed you today' },
  { name: 'Joy', verse: 'Nehemiah 8:10', challenge: 'Find joy in a small moment today' },
  { name: 'Peace', verse: 'Philippians 4:7', challenge: 'Take 5 minutes to pray for peace' },
  { name: 'Patience', verse: 'Galatians 5:22', challenge: 'Practice patience in a difficult situation' },
  { name: 'Kindness', verse: 'Ephesians 4:32', challenge: 'Do one unexpected act of kindness' },
  { name: 'Goodness', verse: 'Psalm 23:6', challenge: 'Look for God\'s goodness in your day' },
  { name: 'Faithfulness', verse: 'Lamentations 3:23', challenge: 'Keep a promise you made to someone' },
  { name: 'Gentleness', verse: 'Philippians 4:5', challenge: 'Respond gently when someone is harsh' },
  { name: 'Self-Control', verse: 'Galatians 5:23', challenge: 'Practice self-control with your words today' }
]

const MOOD_VERSES = {
  anxious: { verse: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
  sad: { verse: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
  angry: { verse: 'Ephesians 4:26', text: 'In your anger do not sin: Do not let the sun go down while you are still angry.' },
  grateful: { verse: '1 Thessalonians 5:18', text: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.' },
  confused: { verse: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
  hopeful: { verse: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.' }
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id as string
  const [gameState, setGameState] = useState<any>(null)
  const [selectedChoice, setSelectedChoice] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [aiResponse, setAiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userQuestion, setUserQuestion] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedFruit, setSelectedFruit] = useState<number | null>(null)

  const gameConfig = GAME_CONFIGS[gameId as keyof typeof GAME_CONFIGS]

  useEffect(() => {
    if (!gameConfig) {
      router.push('/gamified')
      return
    }

    initializeGame()
  }, [gameId])

  const initializeGame = () => {
    if (!gameConfig) return

    switch (gameConfig.type) {
      case 'scenario':
        setGameState({
          scenario: "You're running late for work and see someone who needs help. What do you do?",
          choices: [
            { text: "Keep going - I can't be late", result: "Self-focused choice" },
            { text: "Stop and help - God's timing is perfect", result: "Faith-focused choice" },
            { text: "Quickly call someone else to help", result: "Compromise choice" }
          ]
        })
        break
      case 'quiz':
        setGameState({
          question: '"God helps those who help themselves" - Is this in the Bible?',
          isCorrect: false,
          explanation: "This is actually NOT in the Bible! It's a common saying but not biblical.",
          realVerse: "Ephesians 2:8-9",
          realText: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast."
        })
        break
      case 'challenge':
        setGameState({
          initialized: true
        })
        break
      case 'story':
        setGameState({
          story: "You feel lost and alone in life. Everyone seems to have it together except you. You wonder if God even cares about you...",
          chapters: [
            { title: "Feeling Lost", content: "Like a sheep separated from the flock, you wander in confusion." },
            { title: "The Search", content: "But the Good Shepherd never stopped looking for you." },
            { title: "Found", content: "With gentle hands, He lifts you up and carries you home." }
          ]
        })
        break
      case 'mood':
        setGameState({
          initialized: true
        })
        break
      case 'story':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">The Good Shepherd's Story</h3>
              <p className="text-purple-100 leading-relaxed mb-4">{gameState.story}</p>
              
              <div className="space-y-4">
                {gameState.chapters?.map((chapter: any, index: number) => (
                  <div key={index} className="bg-slate-700/40 rounded-xl p-4 border border-orange-400/30">
                    <h4 className="text-orange-300 font-semibold mb-2">{chapter.title}</h4>
                    <p className="text-orange-100 text-sm">{chapter.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedChoice('understood')}
                className={`px-8 py-4 rounded-2xl border transition-all ${
                  selectedChoice === 'understood'
                    ? 'border-orange-400 bg-orange-600/20 text-white'
                    : 'border-purple-400/30 bg-slate-800/40 text-purple-100 hover:border-orange-400/60'
                }`}
              >
                💖 I understand God's love for me
              </button>
            </div>
          </div>
        )
        setGameState({
          initialized: true
        })
        break
      default:
        setGameState({ initialized: true })
    }
  }

  const submitChoice = async () => {
    if (!selectedChoice) return

    setIsLoading(true)
    try {
      console.log('Submitting choice:', selectedChoice)
      
      // Simple mock response for testing
      let mockResponse = {
        feedback: "Great choice! You're growing spiritually.",
        xp_earned: 10,
        explanation: "Every choice is an opportunity to grow closer to God.",
        spiritual_insight: "Remember, wisdom comes from seeking God's will in all things.",
        new_total_xp: 100,
        new_level: 'Growing Branch'
      }

      // Customize feedback based on game type and choice
      if (gameConfig.type === 'scenario') {
        if (selectedChoice.includes('help') || selectedChoice.includes('God')) {
          mockResponse = {
            feedback: "🌟 Excellent! You chose to put others and God's will first. This shows real spiritual maturity.",
            xp_earned: 20,
            explanation: "When we choose to help others despite our own pressures, we reflect God's love.",
            spiritual_insight: "Matthew 25:40 - 'Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.'",
            new_total_xp: 120,
            new_level: 'Wise Shepherd'
          }
        } else if (selectedChoice.includes('call someone')) {
          mockResponse = {
            feedback: "👍 That's a thoughtful compromise! You're learning to balance wisdom with compassion.",
            xp_earned: 15,
            explanation: "Sometimes we can help in creative ways when direct action isn't possible.",
            spiritual_insight: "Proverbs 27:14 - 'Plans fail for lack of counsel, but with many advisers they succeed.'",
            new_total_xp: 115,
            new_level: 'Growing Branch'
          }
        } else {
          mockResponse = {
            feedback: "⚠️ This choice puts self first. Consider how God might want you to respond differently.",
            xp_earned: 2,
            explanation: "Our schedules matter, but people matter more. God's timing is always perfect.",
            spiritual_insight: "Ecclesiastes 3:1 - 'To every thing there is a season, and a time to every purpose under the heaven.' Next time, consider God's heart for others.",
            new_total_xp: 102,
            new_level: 'Seedling'
          }
        }
      } else if (gameConfig.type === 'quiz') {
        if (selectedChoice === 'false') {
          mockResponse = {
            feedback: "🎉 CORRECT! That's not actually in the Bible. Excellent biblical discernment!",
            xp_earned: 25,
            explanation: "This is a common misconception. The Bible actually teaches that salvation comes by grace, not our own efforts.",
            spiritual_insight: "Ephesians 2:8-9 - 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.'",
            new_total_xp: 125,
            new_level: 'Kingdom Builder'
          }
        } else {
          mockResponse = {
            feedback: "❌ Incorrect. That's actually not in the Bible, but this is a very common misconception!",
            xp_earned: 3,
            explanation: "Many people think this is biblical, but it's actually more aligned with worldly wisdom than God's truth.",
            spiritual_insight: "The Bible teaches that God helps us not because we help ourselves, but because of His grace and love. Study more to grow in discernment!",
            new_total_xp: 103,
            new_level: 'Seedling'
          }
        }
      } else if (gameConfig.type === 'story') {
        mockResponse = {
          feedback: "🐑 You've experienced the heart of the Good Shepherd! He never stops seeking the lost.",
          xp_earned: 18,
          explanation: "This story reminds us that no matter how lost we feel, God is always searching for us with love.",
          spiritual_insight: "Luke 15:3-7 - Jesus told the parable of the lost sheep to show God's heart for every person. You are precious to Him!",
          new_total_xp: 118,
          new_level: 'Fruitful Tree'
        }
      }

      // For other game types, provide appropriate responses
      if (gameConfig.type === 'challenge' && selectedFruit !== null) {
        const fruit = FRUITS_OF_SPIRIT[selectedFruit]
        mockResponse = {
          feedback: `Beautiful choice! Focusing on ${fruit.name} today will help you grow spiritually.`,
          xp_earned: 18,
          explanation: `${fruit.name} is one of the fruits of the Spirit that God wants to develop in us.`,
          spiritual_insight: `${fruit.verse} - Take time today to practice this spiritual fruit through: ${fruit.challenge}`,
          new_total_xp: 118,
          new_level: 'Fruitful Tree'
        }
      }

      if (gameConfig.type === 'mood' && selectedMood) {
        const moodData = MOOD_VERSES[selectedMood as keyof typeof MOOD_VERSES]
        mockResponse = {
          feedback: `God sees your heart and has a perfect promise for you in this moment.`,
          xp_earned: 15,
          explanation: `When you're feeling ${selectedMood}, remember that God's word has exactly what you need.`,
          spiritual_insight: `${moodData.verse} - "${moodData.text}" Let this truth sink deep into your heart today.`,
          new_total_xp: 115,
          new_level: 'Growing Branch'
        }
      }

      if (gameConfig.type === 'conversation' && userQuestion) {
        mockResponse = {
          feedback: `Thank you for being honest about what's on your heart. God loves your authentic questions.`,
          xp_earned: 12,
          explanation: `Asking questions shows spiritual maturity and a desire to grow deeper in faith.`,
          spiritual_insight: `Matthew 7:7 - 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.' Your questions matter to God.`,
          new_total_xp: 112,
          new_level: 'Growing Branch'
        }
      }

      setAiResponse(mockResponse)
      setShowResult(true)

    } catch (error) {
      console.error('Game submission error:', error)
      // Show error feedback
      setAiResponse({
        feedback: "Something went wrong, but God's love for you never fails! ❤️",
        xp_earned: 5,
        explanation: "Even when technology fails, your heart to grow spiritually is what matters.",
        spiritual_insight: "Romans 8:28 - 'And we know that in all things God works for the good of those who love him.'",
        new_total_xp: 105,
        new_level: 'Growing Branch'
      })
      setShowResult(true)
    } finally {
      setIsLoading(false)
    }
  }

  const renderGameContent = () => {
    if (!gameConfig || !gameState) return null

    switch (gameConfig.type) {
      case 'scenario':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">Today's Scenario</h3>
              <p className="text-purple-100 leading-relaxed">{gameState.scenario}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">What would you do?</h4>
              {gameState.choices?.map((choice: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedChoice(choice.text)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedChoice === choice.text
                      ? 'border-purple-400 bg-purple-600/20 text-white'
                      : 'border-purple-400/30 bg-slate-800/40 text-purple-100 hover:border-purple-400/60 hover:bg-slate-800/60'
                  }`}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">Truth or Twisted?</h3>
              <p className="text-purple-100 leading-relaxed text-lg">{gameState.question}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedChoice('true')}
                className={`p-6 rounded-2xl border transition-all ${
                  selectedChoice === 'true'
                    ? 'border-green-400 bg-green-600/20 text-white'
                    : 'border-purple-400/30 bg-slate-800/40 text-purple-100 hover:border-green-400/60'
                }`}
              >
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold">This IS in the Bible</div>
              </button>
              
              <button
                onClick={() => setSelectedChoice('false')}
                className={`p-6 rounded-2xl border transition-all ${
                  selectedChoice === 'false'
                    ? 'border-red-400 bg-red-600/20 text-white'
                    : 'border-purple-400/30 bg-slate-800/40 text-purple-100 hover:border-red-400/60'
                }`}
              >
                <div className="text-2xl mb-2">❌</div>
                <div className="font-semibold">This is NOT in the Bible</div>
              </button>
            </div>
          </div>
        )

      case 'challenge':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">Fruits of the Spirit Challenge</h3>
              <p className="text-purple-100 leading-relaxed">Choose a spiritual fruit to focus on today and commit to its challenge.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {FRUITS_OF_SPIRIT.map((fruit, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedFruit(index)
                    setSelectedChoice(fruit.name)
                  }}
                  className={`p-4 rounded-2xl border transition-all text-left ${
                    selectedFruit === index
                      ? 'border-green-400 bg-green-600/20 text-white'
                      : 'border-purple-400/30 bg-slate-800/40 text-purple-100 hover:border-green-400/60'
                  }`}
                >
                  <div className="font-bold text-lg mb-2">{fruit.name}</div>
                  <div className="text-sm text-purple-300 mb-2">{fruit.verse}</div>
                  <div className="text-xs italic">{fruit.challenge}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'mood':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">How are you feeling right now?</h3>
              <p className="text-purple-100 leading-relaxed">Choose your current mood and receive a personalized Bible promise.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(MOOD_VERSES).map(([mood, data]) => (
                <button
                  key={mood}
                  onClick={() => {
                    setSelectedMood(mood)
                    setSelectedChoice(mood)
                  }}
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedMood === mood
                      ? 'border-yellow-400 bg-yellow-600/20 text-white'
                      : 'border-purple-400/30 bg-slate-800/40 text-purple-100 hover:border-yellow-400/60'
                  }`}
                >
                  <div className="font-semibold capitalize">{mood}</div>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                <h4 className="text-lg font-bold text-white mb-2">{MOOD_VERSES[selectedMood as keyof typeof MOOD_VERSES].verse}</h4>
                <p className="text-yellow-100 leading-relaxed">{MOOD_VERSES[selectedMood as keyof typeof MOOD_VERSES].text}</p>
              </div>
            )}
          </div>
        )

      case 'conversation':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">Ask Me Anything</h3>
              <p className="text-purple-100 leading-relaxed">This is a safe space for your honest questions about faith, life, and spirituality.</p>
            </div>

            <div>
              <textarea
                value={userQuestion}
                onChange={(e) => {
                  setUserQuestion(e.target.value)
                  setSelectedChoice(e.target.value)
                }}
                placeholder="What's on your heart? Ask anything about faith, God, life, doubts, struggles..."
                className="w-full bg-slate-800/60 border border-purple-400/30 rounded-2xl p-6 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 transition-all"
                rows={6}
              />
            </div>
          </div>
        )

      default:
        return <div className="text-white">Game type not implemented yet.</div>
    }
  }

  if (!gameConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Game not found</div>
      </div>
    )
  }

  const IconComponent = gameConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-b border-purple-400/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/gamified')}
            className="p-2 rounded-xl bg-slate-800/60 text-purple-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${gameConfig.color} rounded-2xl flex items-center justify-center`}>
              <IconComponent className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{gameConfig.title}</h1>
              <p className="text-purple-300 text-sm">{gameConfig.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {!showResult ? (
          <div className="space-y-8">
            {renderGameContent()}
            
            {selectedChoice && !showResult && (
              <div className="text-center">
                <button
                  onClick={submitChoice}
                  disabled={isLoading}
                  className={`px-8 py-4 bg-gradient-to-r ${gameConfig.color} text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none`}
                >
                  {isLoading ? 'Getting Divine Feedback...' : 'Submit My Choice'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* AI Response */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl p-8 border border-green-400/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Divine Feedback</h2>
              </div>
              
              {aiResponse && (
                <div className="space-y-4">
                  <p className="text-green-100 leading-relaxed text-lg">{aiResponse.feedback}</p>
                  
                  <div className="bg-slate-800/60 rounded-2xl p-4">
                    <h4 className="text-white font-semibold mb-2">Spiritual Insight:</h4>
                    <p className="text-purple-200">{aiResponse.spiritual_insight}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-400 font-bold text-lg">
                      +{aiResponse.xp_earned} XP Earned!
                    </div>
                    <div className="text-green-300">
                      New Total: {aiResponse.new_total_xp} XP
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowResult(false)
                  setSelectedChoice('')
                  setAiResponse(null)
                  setSelectedMood('')
                  setSelectedFruit(null)
                  setUserQuestion('')
                  initializeGame()
                }}
                className="px-6 py-3 bg-slate-800/60 text-purple-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all"
              >
                Play Again
              </button>
              
              <button
                onClick={() => router.push('/gamified')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Choose Another Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}