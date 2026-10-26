import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p className="page-status">로그인 상태를 확인하고 있습니다.</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
