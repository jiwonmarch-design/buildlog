import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function HomePage() {
  const { user } = useAuth()
  return (
    <main className="page-content">
      <section className="welcome-card">
        <span className="eyebrow">내 기록 홈</span>
        <h1>{user?.nickname}님, 오늘도 기록해볼까요?</h1>
        <p className="description">회원 기능 준비가 끝났습니다. 공부 기록, 할 일, 오류 기록은 다음 단계에서 차례로 연결합니다.</p>
        <Link className="button button--link" to="/settings">계정 설정</Link>
      </section>
      <section className="feature-grid" aria-label="다음에 추가할 기록 기능">
        <article><h2>공부 기록</h2><p>배운 내용을 기록합니다.</p></article>
        <article><h2>할 일</h2><p>앞으로 할 작업을 관리합니다.</p></article>
        <article><h2>오류 기록</h2><p>문제와 해결 방법을 모읍니다.</p></article>
      </section>
    </main>
  )
}
