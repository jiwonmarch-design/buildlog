import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { readApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const message = (location.state as { message?: string } | null)?.message

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email, password })
      const destination = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(readApiError(requestError).message ?? '이메일 또는 비밀번호가 맞지 않습니다.')
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <span className="eyebrow">BUILDLOG</span>
        <h1 id="login-title">로그인</h1>
        <p className="description">내 학습 기록을 이어서 관리하세요.</p>
        {message && <p className="form-success">{message}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <label>이메일
            <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>비밀번호
            <input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>{submitting ? '로그인 중...' : '로그인'}</button>
        </form>
        <p className="auth-link">계정이 없나요? <Link to="/signup">회원가입</Link></p>
      </section>
    </main>
  )
}
