import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  updateNickname as updateNicknameRequest,
  type User,
} from '../api/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getCurrentUser()
      .then((currentUser) => { if (active) setUser(currentUser) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(input) {
      setUser(await loginRequest(input))
    },
    async logout() {
      await logoutRequest()
      setUser(null)
    },
    async updateNickname(nickname) {
      setUser(await updateNicknameRequest(nickname))
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
