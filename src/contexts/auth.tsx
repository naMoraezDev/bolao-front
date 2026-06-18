'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import { useQueryClient } from '@tanstack/react-query'
import { auth } from '@/lib/firebase'
import { setAuthToken } from '@/lib/auth-token'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const wasLoggedIn = !!user
      const isNowLoggedIn = !!firebaseUser

      setUser(firebaseUser)
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        setAuthToken(token)
      } else {
        setAuthToken(null)
      }
      setLoading(false)

      if (wasLoggedIn !== isNowLoggedIn) {
        queryClient.clear()
      }
    })
    return unsubscribe
  }, [user, queryClient])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOutHandler = async () => {
    await firebaseSignOut(auth)
    setAuthToken(null)
    queryClient.clear()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut: signOutHandler }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
