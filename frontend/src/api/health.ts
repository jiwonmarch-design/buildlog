export type HealthResponse = {
  status: string
  service: string
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/api/health`)

  if (!response.ok) {
    throw new Error('서버 상태를 확인할 수 없습니다.')
  }

  return response.json() as Promise<HealthResponse>
}
