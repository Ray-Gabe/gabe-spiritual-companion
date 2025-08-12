'use client'

import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-purple-400/30 rounded-full animate-spin" style={{animationDuration: '60s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-400/20 rounded-full animate-spin" style={{animationDuration: '45s', animationDirection: 'reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-indigo-400/40 rounded-full animate-spin" style={{animationDuration: '30s'}}></div>
        </div>
        
        <div className="absolute top-20 left-20 w-16 h-16 border border-purple-400/30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 border border-blue-400/30 rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 border border-indigo-400/40 rotate-45 animate-pulse delay-2000"></div>
        
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/30 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-purple-400/50 rounded-full"></div>
              <div className="absolute inset-2 border border-blue-400/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
              <div className="absolute inset-4 border border-indigo-400/40 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
              
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-4xl">😇</div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 rounded-full opacity-90 shadow-lg animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 tracking-wider">G A B E</h1>
            <h2 className="text-lg font-medium text-purple-200 mb-2 tracking-widest uppercase">Guidance and Blessing Everyday</h2>
            <p className="text-purple-300/80 italic text-sm">Where divine wisdom meets modern conversation</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 border border-purple-400/20 rotate-45"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-blue-400/20 rotate-12"></div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold text-white mb-6">Enter the Sacred Space</h3>
              
              <button
                onClick={() => router.push('/choice')}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse"></div>
                <div className="relative z-10">Enter as Guest (Testing Mode)</div>
              </button>

              <div className="mt-6 text-center">
                <p className="text-purple-300/60 text-sm">
                  ✨ Testing GABE's spiritual features ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}