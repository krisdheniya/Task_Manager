import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DbUser {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'USER'
}

interface AuthContextType {
  user: User | null          // Supabase auth user (has the JWT)
  dbUser: DbUser | null      // Your Prisma DB user (has the role)
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean           // Convenience shortcut
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on page refresh — no sync needed, just restore UI state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Fires on login, logout, and token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session) {
        syncUserWithBackend(session.access_token)
      } else {
        // Logged out — clear DB user too
        setDbUser(null)
        setLoading(false)  // Set loading to false when no session
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const syncUserWithBackend = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`)
      const data: DbUser = await res.json()
      setDbUser(data)          // Now your whole app knows the role
    } catch (err) {
      console.error('Backend sync failed:', err)
      setDbUser(null)
    } finally {
      setLoading(false)  // Always set loading to false after sync attempt
    }
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setDbUser(null)
    setSession(null)
  }

  const value: AuthContextType = {
    user,
    dbUser,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isAdmin: dbUser?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}