export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          preferred_name: string
          age_group: 'gen_z' | 'millennial' | 'adult'
          spiritual_level: string
          total_xp: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          preferred_name?: string
          age_group?: 'gen_z' | 'millennial' | 'adult'
          spiritual_level?: string
          total_xp?: number
        }
        Update: {
          preferred_name?: string
          age_group?: 'gen_z' | 'millennial' | 'adult'
          spiritual_level?: string
          total_xp?: number
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          user_message: string
          gabe_response: string
          emotional_context: string
          crisis_level: number
          ai_provider: 'gemini' | 'openai' | 'fallback'
          created_at: string
        }
        Insert: {
          user_id: string
          user_message: string
          gabe_response: string
          emotional_context?: string
          crisis_level?: number
          ai_provider?: 'gemini' | 'openai' | 'fallback'
        }
      }
      spiritual_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: 'devotion' | 'prayer' | 'trivia' | 'scripture' | 'journal'
          xp_earned: number
          completion_time: number | null
          validation_score: number
          content: string | null
          completed_at: string
        }
        Insert: {
          user_id: string
          activity_type: 'devotion' | 'prayer' | 'trivia' | 'scripture' | 'journal'
          xp_earned?: number
          completion_time?: number
          validation_score?: number
          content?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          game_type: string
          choices_made: any[]
          ai_feedback: Record<string, any>
          xp_earned: number
          completed_at: string
        }
        Insert: {
          user_id: string
          game_type: string
          choices_made?: any[]
          ai_feedback?: Record<string, any>
          xp_earned?: number
        }
      }
      daily_content: {
        Row: {
          id: string
          content_type: 'scenario' | 'quiz' | 'verse' | 'challenge'
          content_data: Record<string, any>
          generated_date: string
          ai_provider: string
          created_at: string
        }
        Insert: {
          content_type: 'scenario' | 'quiz' | 'verse' | 'challenge'
          content_data: Record<string, any>
          generated_date?: string
          ai_provider?: string
        }
      }
    }
  }
}