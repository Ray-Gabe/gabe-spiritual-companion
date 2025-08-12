'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  // UPDATED HANDLELOGIN FUNCTION WITH FIXES
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        throw error
      }

      if (data.user) {
        console.log('Login successful, redirecting...')
        // Small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push('/choice')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.message.includes('Invalid login credentials')) {
        setError('Email or password is incorrect. Please try again.')
      } else {
        setError(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Floating divine elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-300/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-400/30">
        <div className="relative z-10 p-8 text-center">
          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Link href="/" className="p-2 rounded-xl bg-slate-800/60 text-purple-300 hover:text-white hover:bg-slate-800 transition-all">
              <ArrowLeft size={20} />
            </Link>
          </div>

          {/* Divine Angel Icon */}
          <div className="mb-8 mt-4">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-blue-400/40 to-purple-400/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-purple-400/50 shadow-2xl">
                <div className="text-3xl">😇</div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 rounded-full opacity-90 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Divine Typography */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-3 tracking-wider">
              Welcome Back
            </h1>
            <p className="text-purple-200 leading-relaxed">
              Your spiritual companion is waiting for you
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-2xl p-3 mb-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-800/80 border border-purple-400/30 rounded-2xl py-4 px-6 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-slate-800 transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-800/80 border border-purple-400/30 rounded-2xl py-4 px-6 pr-12 text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-slate-800 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300/60 hover:text-purple-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse"></div>
              <div className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw size={20} className="animate-spin" />
                    Reconnecting to Divine...
                  </div>
                ) : (
                  'Enter Sacred Space'
                )}
              </div>
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-6 border-t border-purple-400/20">
            <p className="text-purple-300/80 text-sm">
              New to the spiritual journey?{' '}
              <Link href="/" className="text-purple-300 hover:text-white font-medium underline">
                Start your adventure
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}