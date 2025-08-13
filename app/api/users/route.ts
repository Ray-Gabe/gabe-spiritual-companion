import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/database/users'

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const user = await createUser(name, email)
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}