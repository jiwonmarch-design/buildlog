import { useEffect, useState } from 'react'
import './App.css'
import { getHealth } from './api/health'

type ApiState = 'checking' | 'connected' | 'error'

function App() {
  const [apiState, setApiState] = useState<ApiState>('checking')

  async function checkApi() {
    setApiState('checking')

    try {
      const health = await getHealth()
      setApiState(health.status === 'ok' ? 'connected' : 'error')
    } catch {
      setApiState('error')
    }
  }

  useEffect(() => {
    let active = true

    getHealth()
      .then((health) => {
        if (active) {
          setApiState(health.status === 'ok' ? 'connected' : 'error')
        }
      })
      .catch(() => {
        if (active) {
          setApiState('error')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const statusText = {
    checking: '서버 연결을 확인하고 있습니다.',
    connected: 'FastAPI 서버와 연결되었습니다.',
    error: 'FastAPI 서버에 연결할 수 없습니다.',
  }[apiState]

  return (
    <main className="app-shell">
      <section className="status-card" aria-labelledby="page-title">
        <span className="eyebrow">BUILDLOG</span>
        <h1 id="page-title">배운 것과 해결한 것을 한곳에</h1>
        <p className="description">
          공부 기록, 할 일, 오류 해결 경험을 모아볼 서비스의 기본 연결을
          준비했습니다.
        </p>

        <div className={`api-status api-status--${apiState}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          <span>{statusText}</span>
        </div>

        {apiState === 'error' && (
          <button type="button" onClick={() => void checkApi()}>
            다시 확인
          </button>
        )}

        <div className="stack-list" aria-label="프로젝트 기술 구성">
          <span>React + TypeScript</span>
          <span>FastAPI</span>
          <span>Supabase PostgreSQL</span>
          <span>SQLite3 Tests</span>
        </div>
      </section>
    </main>
  )
}

export default App
