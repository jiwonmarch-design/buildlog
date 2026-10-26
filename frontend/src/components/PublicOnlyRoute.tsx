import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth()
  if (loading) return <p className="page-status">로그인 상태를 확인하고 있습니다.</p>
  if (user) return <Navigate to="/" replace />
  return children
}
