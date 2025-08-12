'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Star, ChevronDown } from 'lucide-react'

export default function ChoicePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    faithLevel: ''
  })
  const [showAgeDropdown, setShowAgeDropdown] = useState(false)

  const ageOptions = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']
  const faithOptions = ['New to faith', 'Curious seeker', 'Growing in Christ', 'Spiritually strong']

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        {/* GABE Avatar */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <span className="text-3xl">😇</span>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-yellow-400 rounded-full"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-blue-800 mb-2">GABE</h1>
          <p className="text-lg font-medium text-blue-700 mb-4">Messenger of God</p>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome! Let's get to know you 👋</h2>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-2">What's your name?</label>
          <input
            type="text"
            placeholder="What's your name?"
            value={userInfo.name}
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Age Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-2">How old are you?</label>
          <div className="relative">
            <button
              onClick={() => setShowAgeDropdown(!showAgeDropdown)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-left text-gray-600 focus:outline-none focus:border-blue-400 flex items-center justify-between"
            >
              <span>{userInfo.age || 'Select age'}</span>
              <ChevronDown size={20} />
            </button>
            
            {showAgeDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl mt-1 shadow-lg z-10">
                {ageOptions.map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      setUserInfo({...userInfo, age});
                      setShowAgeDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {age}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Faith Level */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-3">Where are you on your faith journey?</label>
          <div className="grid grid-cols-2 gap-2">
            {faithOptions.map((option) => (
              <button
                key={option}
                onClick={() => setUserInfo({...userInfo, faithLevel: option})}
                className={`px-3 py-2 rounded-2xl border text-sm font-medium transition-colors ${
                  userInfo.faithLevel === option
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Log In Button */}
        <button
          onClick={() => router.push('/chat')}
          disabled={!userInfo.name || !userInfo.age || !userInfo.faithLevel}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-2xl mb-4 transition-colors"
        >
          Log In
        </button>

        {/* Bottom Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/chat')}
            className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={16} />
            <span className="font-medium">Chat with GABE</span>
          </button>
          
          <button
            onClick={() => router.push('/gamified')}
            className="flex items-center justify-center gap-2 bg-gray-50 text-blue-700 py-3 rounded-2xl border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <Star size={16} />
            <span className="font-medium">Get Gabefiyied</span>
          </button>
        </div>
      </div>
    </div>
  )
}