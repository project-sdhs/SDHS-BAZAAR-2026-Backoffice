import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL, ApiError, api } from './client'

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api client', () => {
  it('서버 주소 + 경로로 요청하고 JSON 응답을 돌려준다', async () => {
    const fetchMock = mockFetch(200, { status: 'ok' })

    const result = await api.get<{ status: string }>('/health')

    expect(result).toEqual({ status: 'ok' })
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/health`,
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('실패 응답이면 서버의 { code, message } 로 ApiError 를 던진다', async () => {
    mockFetch(404, { code: 'NOT_FOUND', message: '없는 주소예요' })

    const error = await api.get('/nope').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
      message: '없는 주소예요',
    })
  })
})
