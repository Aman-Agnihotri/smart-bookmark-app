'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error('Error logging in:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />

      <div className="glass-panel fade-slide relative z-10 w-full max-w-md p-6 text-center sm:p-8">
        <span className="pill">Welcome Back</span>
        <h1 className="hero-title gradient-heading mt-4 text-3xl font-bold sm:text-4xl">Smart Bookmark App</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#556274] sm:text-base">
          Sign in with Google to organize and access your bookmarks from anywhere.
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="primary-btn mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17202d] px-4 py-3 text-white hover:bg-[#101722] disabled:opacity-60"
        >
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
