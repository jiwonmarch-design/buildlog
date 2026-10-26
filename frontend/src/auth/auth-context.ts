import { createContext } from 'react'
import type { LoginInput, User } from '../api/auth'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
  updateNickname: (nickname: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
