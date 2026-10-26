import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleLogout() {
    setError('')
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setError('로그아웃하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">BuildLog</NavLink>
        <nav aria-label="주요 메뉴">
          <NavLink to="/">내 기록</NavLink>
          <NavLink to="/settings">계정 설정</NavLink>
          <button className="button button--quiet" type="button" onClick={handleLogout}>로그아웃</button>
        </nav>
      </header>
      {error && <p className="global-error">{error}</p>}
      <Outlet />
      <footer className="site-footer">{user?.nickname}님의 BuildLog</footer>
    </div>
  )
}
