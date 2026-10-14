/**
 * 백엔드 서버와 통신하는 fetch 래퍼.
 *
 * 사용 예)
 *   const health = await api.get<HealthResponse>('/health')
 *   await api.post('/booths', { name: '떡볶이 부스' })
 *
 * 실패(2xx가 아닌 응답)하면 ApiError 를 던집니다. 서버 에러 응답 형식은 { code, message } 예요.
 */

const DEFAULT_API_BASE_URL = 'http://localhost:3000'

/** 서버 주소. `.env.local` 의 VITE_API_BASE_URL 을 쓰고, 없으면 localhost:3000 (끝의 `/` 는 지움) */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, '')

export class ApiError extends Error {
  /** HTTP 상태 코드 (예: 404) */
  readonly status: number
  /** 서버가 보낸 에러 코드 (예: 'NOT_FOUND') */
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  /** 보낼 데이터. 객체를 넣으면 JSON 으로 바꿔서 보냅니다. */
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers, signal } = options

  const finalHeaders = new Headers(headers)
  if (!finalHeaders.has('Accept')) {
    finalHeaders.set('Accept', 'application/json')
  }
  if (body !== undefined && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  const data = await readBody(response)

  if (!response.ok) {
    if (isServerError(data)) {
      throw new ApiError(response.status, data.code, data.message)
    }
    throw new ApiError(
      response.status,
      'UNKNOWN_ERROR',
      `요청에 실패했어요 (${response.status})`,
    )
  }

  return data as T
}

/** 응답 본문을 읽습니다. 비어 있으면 undefined, JSON 이면 객체, 아니면 문자열. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (text === '') return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function isServerError(
  data: unknown,
): data is { code: string; message: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data &&
    typeof data.code === 'string' &&
    typeof data.message === 'string'
  )
}

type Options = Omit<RequestOptions, 'method' | 'body'>

export const api = {
  get: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
