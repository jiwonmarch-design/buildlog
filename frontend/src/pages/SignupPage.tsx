import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { readApiError, validationFields } from '../api/client'

type Fields = 'email' | 'password' | 'nickname'
type FieldErrors = Partial<Record<Fields, string>>

export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setGeneralError('')
    setSubmitting(true)
    try {
      await signup({ email, password, nickname })
      navigate('/login', { replace: true, state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } })
    } catch (error) {
      const detail = readApiError(error)
      const invalidFields = validationFields(error)
      const nextErrors: FieldErrors = {}
      if (detail.field && ['email', 'password', 'nickname'].includes(detail.field)) {
        nextErrors[detail.field as Fields] = detail.message
      }
      if (invalidFields.has('email')) nextErrors.email = '올바른 이메일 주소를 입력해주세요.'
      if (invalidFields.has('password')) nextErrors.password = '비밀번호는 8자 이상 64자 이하여야 합니다.'
      if (invalidFields.has('nickname')) {
        nextErrors.nickname = '닉네임은 2~20자의 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다.'
      }
      setFieldErrors(nextErrors)
      if (Object.keys(nextErrors).length === 0) setGeneralError(detail.message ?? '회원가입하지 못했습니다.')
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signup-title">
        <span className="eyebrow">BUILDLOG</span>
        <h1 id="signup-title">회원가입</h1>
        <p className="description">학습 기록을 한곳에 모을 계정을 만드세요.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label>이메일
            <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>
          <label>비밀번호
            <input autoComplete="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <small>8자 이상 64자 이하</small>
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </label>
          <label>닉네임
            <input autoComplete="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} />
            <small>2~20자의 한글, 영문, 숫자, 밑줄</small>
            {fieldErrors.nickname && <span className="field-error">{fieldErrors.nickname}</span>}
          </label>
          {generalError && <p className="form-error">{generalError}</p>}
          <button className="button" type="submit" disabled={submitting}>{submitting ? '가입 중...' : '회원가입'}</button>
        </form>
        <p className="auth-link">이미 계정이 있나요? <Link to="/login">로그인</Link></p>
      </section>
    </main>
  )
}
