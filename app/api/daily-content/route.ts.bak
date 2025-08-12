import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple mock daily content for testing
    const mockContent = {
      scenario: {
        scenario: "You're running late for work and see someone who needs help. What do you do?",
        choices: [
          { text: "Keep going - I can't be late", result: "Self-focused choice" },
          { text: "Stop and help - God's timing is perfect", result: "Faith-focused choice" },
          { text: "Quickly call someone else to help", result: "Compromise choice" }
        ],
        verse: "Galatians 6:2",
        verseText: "Carry each other's burdens, and in this way you will fulfill the law of Christ."
      },
      quiz: {
        question: '"God helps those who help themselves" - Is this in the Bible?',
        isCorrect: false,
        explanation: "This is actually NOT in the Bible! It's a common saying but not biblical.",
        realVerse: "Ephesians 2:8-9",
        realText: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast."
      },
      verse: {
        mood: 'hopeful',
        verse: 'Jeremiah 29:11',
        text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.',
        promise: 'God has amazing plans for your life!'
      }
    }

    return NextResponse.json(mockContent)
  } catch (error) {
    console.error('Daily content error:', error)
    return NextResponse.json({ error: 'Failed to load daily content' }, { status: 500 })
  }
}