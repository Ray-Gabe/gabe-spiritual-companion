import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    feedback: "Great choice! You're growing spiritually.",
    xp_earned: 10,
    explanation: "Every choice is an opportunity to grow closer to God.",
    spiritual_insight: "Remember, wisdom comes from seeking God's will in all things.",
    new_total_xp: 100,
    new_level: 'Growing Branch'
  })
}

export async function GET() {
  return NextResponse.json({ message: "Game validation API is working!" })
}