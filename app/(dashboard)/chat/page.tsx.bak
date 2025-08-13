'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/lib/stores/userStore'
import { useRouter } from 'next/navigation'
import { Send, ArrowLeft, Heart, Sparkles, Star, User, MessageCircle, X, ChevronRight } from 'lucide-react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  emotional_context?: string
  crisis_level?: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [selectedHero, setSelectedHero] = useState<any>(null)
  const [selectedPrayer, setSelectedPrayer] = useState<any>(null)
  const { user, setUser } = useUserStore()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Sample data for features
  const bibleHeroes = [
    {
      name: "David",
      age: "Teen shepherd",
      summary: "Young guy who took down a giant with just faith and a sling",
      motivation: "When everyone doubts you, God sees your potential. David was just a kid when he faced the biggest challenge ever - and WON because he trusted God over fear! 💪",
      keyVerse: "1 Samuel 17:47",
      verseText: "The battle is the Lord's!",
      application: "That 'giant' you're facing? God's got bigger plans than your problems!"
    },
    {
      name: "Esther",
      age: "Young woman, early 20s",
      summary: "Girl who became queen and saved her entire people",
      motivation: "Your voice matters MORE than you think! Esther was scared but spoke up anyway. Sometimes God puts you in positions 'for such a time as this' - trust the timing! ✨",
      keyVerse: "Esther 4:14",
      verseText: "For such a time as this",
      application: "Your generation, your voice, your moment - God positioned you here for a reason!"
    },
    {
      name: "Daniel",
      age: "Teenager",
      summary: "Stayed true to God when everyone else was conforming",
      motivation: "Being different isn't weird - it's powerful! Daniel kept his values while everyone else was compromising. That's main character energy right there! 🔥",
      keyVerse: "Daniel 1:8",
      verseText: "Daniel resolved not to defile himself",
      application: "Standing out for your faith isn't cringe - it's courage!"
    }
  ]

  const dailyPromise = {
    promise: "God's got plans for your future that are actually fire! 🔥",
    verse: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    application: "That anxiety about your future? God's already got it mapped out. Trust the process! ✨"
  }

  const prayerList = [
    {
      title: "🤲 Help me with social anxiety",
      preview: "For those overwhelming social moments...",
      prayer: "God, these social situations honestly make me so nervous. Help me remember that You're with me even when I feel awkward or out of place. Give me confidence to be myself and peace when my anxiety tries to take over. Remind me that I don't have to be perfect - just real. Amen. 💙"
    },
    {
      title: "💪 Give me strength for today",
      preview: "When everything feels too much...",
      prayer: "Lord, today feels heavy and I'm already tired. Fill me with Your strength when mine runs out. Help me take it one step at a time and remind me that You're carrying me through this. I don't have to do it all - just the next right thing. Amen. ✨"
    },
    {
      title: "📱 Navigate social media pressure",
      preview: "Finding peace in the digital world...",
      prayer: "God, this whole social media thing is honestly exhausting. Help me remember that my worth isn't measured by likes or follows. Give me wisdom to take breaks when I need them and strength to post authentically. Remind me that You see the real me, not just my highlight reel. Amen. 💚"
    },
    {
      title: "💔 Heal my relationships",
      preview: "For broken friendships and family...",
      prayer: "Father, my relationships are messy right now and my heart hurts. Show me how to love like You do - with grace, forgiveness, and patience. Help me know when to fight for someone and when to let go. Heal what's broken and protect what's good. Amen. 💝"
    },
    {
      title: "🎯 Show me my purpose",
      preview: "When life feels directionless...",
      prayer: "God, I feel so lost right now and I don't know what I'm supposed to be doing with my life. Open my eyes to see the unique way You've made me. Help me trust that You have good plans for me, even when I can't see them yet. Guide my next steps. Amen. 🌟"
    }
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
        // Add welcome message
        setMessages([{
          id: '1',
          content: `Hey ${profile.preferred_name}! 😇 I'm GABE, and I'm so glad you're here. What's on your heart today?`,
          isUser: false,
          timestamp: new Date()
        }])
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const gabeMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        emotional_context: data.emotional_context,
        crisis_level: data.crisis_level
      }

      setMessages(prev => [...prev, gabeMessage])

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now, but I'm still here with you. God's love never fails, even when technology does! 💙",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFeatureClick = (feature: string) => {
    setActiveFeature(feature)
  }

  const closeFeature = () => {
    setActiveFeature(null)
    setSelectedHero(null)
    setSelectedPrayer(null)
  }

  const handlePrayerClick = (prayer: any) => {
    setSelectedPrayer(prayer)
  }

  const handlePrayThis = () => {
    alert('🙏 Beautiful! God heard your heart. This prayer has been marked as prayed.')
    setSelectedPrayer(null)
  }

  const handleSavePrayer = () => {
    alert('💾 Prayer saved to your favorites! You can find it in your saved prayers.')
  }

  const renderFeatureModal = () => {
    if (!activeFeature) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-400/30">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-400/30">
            <h2 className="text-xl font-bold text-white">
              {activeFeature === 'heroes' && '📖 Bible Heroes'}
              {activeFeature === 'promise' && '✨ Today\'s Promise'}
              {activeFeature === 'prayers' && '🙏 Top 5 Prayers This Week'}
            </h2>
            <button onClick={closeFeature} className="p-2 hover:bg-slate-800 rounded-full text-purple-300">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeFeature === 'heroes' && !selectedHero && (
              <div className="space-y-4">
                <p className="text-purple-200 text-center mb-6">Heroes who get what you're going through:</p>
                {bibleHeroes.map((hero, index) => (
                  <div key={index} className="bg-slate-800/60 rounded-2xl p-4 border border-amber-400/30 cursor-pointer hover:bg-slate-800 transition-colors"
                       onClick={() => setSelectedHero(hero)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{hero.name}</h3>
                        <p className="text-amber-400 text-sm">{hero.age}</p>
                      </div>
                      <ChevronRight className="text-amber-400 ml-auto" size={16} />
                    </div>
                    <p className="text-purple-200 text-sm">{hero.summary}</p>
                  </div>
                ))}
              </div>
            )}

            {activeFeature === 'heroes' && selectedHero && (
              <div className="space-y-6">
                <button onClick={() => setSelectedHero(null)} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4">
                  <ArrowLeft size={16} />
                  Back to Heroes
                </button>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedHero.name}</h2>
                  <p className="text-amber-400 font-medium">{selectedHero.age}</p>
                </div>

                <div className="bg-green-900/30 rounded-2xl p-6 border border-green-500/30">
                  <h3 className="font-bold text-green-300 mb-3">🔥 Motivation for You</h3>
                  <p className="text-green-100 leading-relaxed">{selectedHero.motivation}</p>
                </div>

                <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-500/30">
                  <h3 className="font-bold text-blue-300 mb-3">📖 Their Key Verse</h3>
                  <div className="bg-slate-800/60 rounded-xl p-4 border border-blue-400/30">
                    <p className="text-blue-200 font-bold mb-2">"{selectedHero.verseText}"</p>
                    <p className="text-blue-300 text-sm">- {selectedHero.keyVerse}</p>
                  </div>
                </div>

                <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-500/30">
                  <h3 className="font-bold text-purple-300 mb-3">✨ For Your Life</h3>
                  <p className="text-purple-100 leading-relaxed">{selectedHero.application}</p>
                </div>
              </div>
            )}

            {activeFeature === 'promise' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {dailyPromise.promise}
                  </h3>
                </div>

                <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-500/30">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-200 mb-3">
                      "{dailyPromise.text}"
                    </p>
                    <p className="text-blue-300 font-medium">
                      - {dailyPromise.verse}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-500/30">
                  <h4 className="font-bold text-blue-300 mb-2">How This Applies to You:</h4>
                  <p className="text-blue-100 leading-relaxed">
                    {dailyPromise.application}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-purple-300">✨ Promise updates weekly</p>
                </div>
              </div>
            )}

            {activeFeature === 'prayers' && !selectedPrayer && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Real prayers for real struggles
                  </h3>
                  <p className="text-purple-300">Click any prayer to read the full version</p>
                </div>

                {prayerList.map((prayerItem, index) => (
                  <div key={index} className="bg-purple-900/30 rounded-2xl p-4 border border-purple-500/30 cursor-pointer hover:bg-purple-900/50 transition-colors"
                       onClick={() => handlePrayerClick(prayerItem)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-200 mb-1">{prayerItem.title}</h4>
                        <p className="text-purple-300 text-sm italic">{prayerItem.preview}</p>
                      </div>
                      <ChevronRight className="text-purple-400" size={16} />
                    </div>
                  </div>
                ))}

                <div className="text-center mt-6">
                  <p className="text-sm text-purple-300">🔄 Updates weekly with fresh prayers</p>
                </div>
              </div>
            )}

            {activeFeature === 'prayers' && selectedPrayer && (
              <div className="space-y-6">
                <button onClick={() => setSelectedPrayer(null)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4">
                  <ArrowLeft size={16} />
                  Back to Prayer List
                </button>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedPrayer.title}
                  </h3>
                </div>

                <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-500/30">
                  <p className="text-purple-100 leading-relaxed text-lg">
                    {selectedPrayer.prayer}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handlePrayThis}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-700 transition-colors"
                  >
                    🙏 Pray This
                  </button>
                  <button 
                    onClick={handleSavePrayer}
                    className="px-6 py-3 border-2 border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-colors"
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-600 flex items-center justify-center">
        <div className="text-white">Loading your spiritual space...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-600 flex flex-col">
      {/* Header - UPDATED TO CLEAN DESIGN */}
      <div className="bg-purple-500/80 backdrop-blur-sm p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="text-purple-600" size={20} />
          </div>
          <div>
            <h1 className="font-semibold">GABE</h1>
            <p className="text-sm italic">Because even prayers start with a conversation</p>
          </div>
          
          {/* Voice Toggle & Star Button */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Voice</span>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/gamified')}
              className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-500 transition-colors"
              title="GABEified Games"
            >
              <Star className="text-purple-700" size={20} />
            </button>
            
            <button 
              onClick={() => router.push('/choice')}
              className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.isUser 
                  ? 'bg-blue-600 text-white rounded-3xl rounded-tr-lg' 
                  : 'bg-white text-gray-800 rounded-3xl rounded-tl-lg shadow-lg'
              } px-6 py-4`}>
                
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">😇</span>
                    <span className="text-blue-600 text-xs font-medium">GABE</span>
                    {message.emotional_context && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {message.emotional_context}
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                <div className={`text-xs mt-2 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-3xl rounded-tl-lg shadow-lg px-6 py-4 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">😇</span>
                  <span className="text-blue-600 text-xs font-medium">GABE</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Feature Buttons */}
      <div className="bg-purple-500/80 backdrop-blur-sm border-t border-purple-400/30 p-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleFeatureClick('heroes')}
              className="flex items-center gap-2 bg-amber-500/20 text-amber-200 rounded-full px-4 py-2 hover:bg-amber-500/30 transition-colors whitespace-nowrap text-sm border border-amber-400/30"
            >
              <User size={16} />
              <span>Bible Heroes</span>
            </button>
            
            <button
              onClick={() => handleFeatureClick('promise')}
              className="flex items-center gap-2 bg-blue-500/20 text-blue-200 rounded-full px-4 py-2 hover:bg-blue-500/30 transition-colors whitespace-nowrap text-sm border border-blue-400/30"
            >
              <Sparkles size={16} />
              <span>Promise for Today</span>
            </button>
            
            <button
              onClick={() => handleFeatureClick('prayers')}
              className="flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 hover:bg-white/30 transition-colors whitespace-nowrap text-sm border border-white/30"
            >
              <MessageCircle size={16} />
              <span>Top 5 Prayers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-purple-500/80 backdrop-blur-sm border-t border-purple-400/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your heart..."
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 pr-14 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 resize-none shadow-lg"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Modal */}
      {renderFeatureModal()}
    </div>
  )
}