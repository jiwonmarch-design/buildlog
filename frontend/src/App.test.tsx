import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { AuthProvider } from './auth/AuthContext'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function renderApp(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>)
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('회원 화면', () => {
  it('로그인하지 않은 사용자를 로그인 화면으로 보낸다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({}, 401))
    renderApp('/')
    expect(await screen.findByRole('heading', { name: '로그인' })).toBeInTheDocument()
  })

  it('로그인 실패 시 이메일은 유지하고 비밀번호만 지운다', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({ detail: { message: '이메일 또는 비밀번호가 맞지 않습니다.' } }, 401))
    renderApp('/login')
    const user = userEvent.setup()
    const email = await screen.findByLabelText('이메일')
    const password = screen.getByLabelText('비밀번호')
    await user.type(email, 'student@example.com')
    await user.type(password, 'wrongpass')
    await user.click(screen.getByRole('button', { name: '로그인' }))
    expect(await screen.findByText('이메일 또는 비밀번호가 맞지 않습니다.')).toBeInTheDocument()
    expect(email).toHaveValue('student@example.com')
    expect(password).toHaveValue('')
  })

  it('회원가입 성공 후 로그인 화면을 보여준다', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({}, 401))
      .mockResolvedValueOnce(jsonResponse({ id: 1, email: 'student@example.com', nickname: '학습자', is_admin: false }, 201))
    renderApp('/signup')
    const user = userEvent.setup()
    await user.type(await screen.findByLabelText('이메일'), 'student@example.com')
    await user.type(screen.getByLabelText(/^비밀번호/), 'password123')
    await user.type(screen.getByLabelText(/^닉네임/), '학습자')
    await user.click(screen.getByRole('button', { name: '회원가입' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument())
    expect(screen.getByText('회원가입이 완료되었습니다. 로그인해주세요.')).toBeInTheDocument()
  })
})
