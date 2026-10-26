import { apiRequest } from './client'

export type User = { id: number; email: string; nickname: string; is_admin: boolean }
export type SignupInput = { email: string; password: string; nickname: string }
export type LoginInput = { email: string; password: string }

export function signup(input: SignupInput): Promise<User> {
  return apiRequest<User>('/api/auth/signup', { method: 'POST', body: JSON.stringify(input) })
}

export function login(input: LoginInput): Promise<User> {
  return apiRequest<User>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) })
}

export function logout(): Promise<void> {
  return apiRequest<void>('/api/auth/logout', { method: 'POST' })
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/auth/me')
}

export function updateNickname(nickname: string): Promise<User> {
  return apiRequest<User>('/api/users/me/nickname', {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
  })
}
