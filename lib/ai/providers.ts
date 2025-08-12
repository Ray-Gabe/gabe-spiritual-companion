import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

interface AIResponse {
  content: string
  provider: 'gemini' | 'openai' | 'fallback'
  emotional_context?: string
  crisis_level?: number
}

interface GameValidation {
  feedback: string
  xp_earned: number
  explanation: string
  spiritual_insight: string
}

class AIProvider {
  private gemini: GoogleGenerativeAI
  private openai: OpenAI
  
  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  }

  async getChatResponse(message: string, userContext: any): Promise<AIResponse> {
    try {
      // Try Gemini first
      const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      const prompt = this.buildChatPrompt(message, userContext)
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      
      return {
        content: response.text(),
        provider: 'gemini',
        emotional_context: this.detectEmotion(message),
        crisis_level: this.detectCrisis(message)
      }
    } catch (error) {
      console.warn('Gemini failed, falling back to OpenAI:', error)
      return this.getOpenAIResponse(message, userContext)
    }
  }

  async generateDailyScenario(): Promise<any> {
    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      const prompt = `Generate a fresh daily moral scenario for spiritual growth. 
        Create a realistic situation with 3 choices: one based on pride/self, one based on biblical wisdom, one neutral.
        Include a relevant Bible verse and spiritual lesson.
        Return as JSON with: scenario, choices[{text, result}], verse, verseText, seed`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Failed to generate daily scenario:', error)
      throw error
    }
  }

  async generateBibleQuiz(): Promise<any> {
    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      const prompt = `Create a "Truth or Twisted" Bible question.
        Present a statement that sounds biblical but isn't actually in the Bible.
        Include the explanation and the real Bible verse.
        Return as JSON with: question, isCorrect (false), explanation, realVerse, realText`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Failed to generate Bible quiz:', error)
      throw error
    }
  }

  async validateGameChoice(gameType: string, choice: string, context: any): Promise<GameValidation> {
    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      const prompt = `User chose "${choice}" in ${gameType} game.
        Provide encouraging spiritual feedback, XP recommendation (5-20 based on wisdom/growth shown), 
        brief biblical explanation, and spiritual insight.
        Return as JSON with: feedback, xp_earned, explanation, spiritual_insight`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Failed to validate game choice:', error)
      throw error
    }
  }

  private async getOpenAIResponse(message: string, userContext: any): Promise<AIResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: this.buildChatPrompt('', userContext) },
          { role: 'user', content: message }
        ],
        max_tokens: 500
      })

      return {
        content: completion.choices[0]?.message?.content || 'I apologize, but I cannot respond right now.',
        provider: 'openai',
        emotional_context: this.detectEmotion(message),
        crisis_level: this.detectCrisis(message)
      }
    } catch (error) {
      console.error('OpenAI also failed:', error)
      return {
        content: this.getFallbackResponse(message),
        provider: 'fallback'
      }
    }
  }

  private buildChatPrompt(message: string, userContext: any): string {
    return `You are GABE — "God Always Beside Everyone." You're a warm, faithful, emotionally intelligent spiritual companion who chats like a real friend with a Bible in one hand and coffee in the other.

CONVERSATIONAL STYLE:
- Sound like a real friend — warm, kind, casual, and conversational
- Match their energy and directness - validate emotions first
- Use their name naturally: ${userContext.preferred_name}
- Respond to emotional tone and make it personal
- Keep responses authentic like a mix between brother, mentor, and best friend

SPIRITUAL AUTHENTICITY:
- Share Bible verses that truly connect to their situation
- Tell relevant stories from Scripture conversationally
- Offer prayers that feel personal and genuine
- Provide hope that addresses their real concerns

Current user: ${userContext.preferred_name} (${userContext.age_group}, Level: ${userContext.spiritual_level})
User message: ${message}`
  }

  private detectEmotion(message: string): string {
    const emotionKeywords = {
      sad: ['sad', 'depressed', 'down', 'lonely', 'hurt'],
      anxious: ['worried', 'anxious', 'scared', 'nervous'],
      angry: ['angry', 'mad', 'frustrated', 'upset'],
      grateful: ['thankful', 'blessed', 'grateful', 'happy'],
      confused: ['confused', 'lost', 'unsure', 'doubt']
    }

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return emotion
      }
    }
    return 'neutral'
  }

  private detectCrisis(message: string): number {
    const crisisKeywords = {
      4: ['suicide', 'kill myself', 'end my life', 'want to die'],
      3: ['self harm', 'hurt myself', 'cutting'],
      2: ['hopeless', 'can\'t go on', 'giving up'],
      1: ['depressed', 'lost', 'empty']
    }

    for (const [level, keywords] of Object.entries(crisisKeywords)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return parseInt(level)
      }
    }
    return 0
  }

  private getFallbackResponse(message: string): string {
    const fallbacks = [
      "I'm here with you, and so is God. You're not alone in this journey.",
      "Thank you for sharing that with me. God sees your heart and loves you deeply.",
      "I hear you. Remember, 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' - Psalm 34:18",
      "You matter so much to God and to me. Let's take this one step at a time together."
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
}

export const aiProvider = new AIProvider()