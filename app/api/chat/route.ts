import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { aiProvider } from '@/lib/ai/providers'

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json()
    
    if (!message || !userId) {
      return NextResponse.json({ error: 'Message and userId required' }, { status: 400 })
    }

    const supabase = createServerClient()
    
    // Get user context
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get AI response
    const aiResponse = await aiProvider.getChatResponse(message, user)

    // Save conversation
    await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        user_message: message,
        gabe_response: aiResponse.content,
        emotional_context: aiResponse.emotional_context,
        crisis_level: aiResponse.crisis_level,
        ai_provider: aiResponse.provider
      })

    return NextResponse.json({
      response: aiResponse.content,
      emotional_context: aiResponse.emotional_context,
      crisis_level: aiResponse.crisis_level
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}