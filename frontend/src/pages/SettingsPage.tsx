import { type FormEvent, useState } from 'react'
import { readApiError, validationFields } from '../api/client'
import { useAuth } from '../auth/useAuth'

export function SettingsPage() {
  const { user, updateNickname } = useAuth()
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      await updateNickname(nickname)
      setMessage('닉네임을 변경했습니다.')
    } catch (requestError) {
      const detail = readApiError(requestError)
      setError(validationFields(requestError).has('nickname')
        ? '닉네임은 2~20자의 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다.'
        : detail.message ?? '닉네임을 변경하지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-content page-content--narrow">
      <section className="settings-card">
        <span className="eyebrow">계정 설정</span>
        <h1>닉네임 변경</h1>
        <p className="description">로그인 이메일: {user?.email}</p>
        <form onSubmit={handleSubmit} noValidate>
          <label>새 닉네임<input value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
          <button className="button" type="submit" disabled={submitting}>{submitting ? '변경 중...' : '변경'}</button>
        </form>
      </section>
    </main>
  )
}
