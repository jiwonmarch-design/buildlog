const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type ErrorDetail = { field?: string; message?: string }

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, detail: unknown) {
    super('요청을 처리하지 못했습니다.')
    this.status = status
    this.detail = detail
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (response.status === 204) return undefined as T

  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, body?.detail ?? body)
  return body as T
}

export function readApiError(error: unknown): ErrorDetail {
  if (!(error instanceof ApiError)) {
    return { message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' }
  }
  if (typeof error.detail === 'object' && error.detail !== null && !Array.isArray(error.detail)) {
    return error.detail as ErrorDetail
  }
  return { message: '입력한 내용을 확인해주세요.' }
}

export function validationFields(error: unknown): Set<string> {
  if (!(error instanceof ApiError) || !Array.isArray(error.detail)) return new Set()
  return new Set(
    error.detail
      .map((item) => item?.loc?.at?.(-1))
      .filter((field): field is string => typeof field === 'string'),
  )
}
