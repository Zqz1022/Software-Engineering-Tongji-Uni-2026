import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError } from './client'

afterEach(() => vi.unstubAllGlobals())

describe('API client', () => {
  it('uses the current session CSRF token for writes', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ headerName: 'X-CSRF-TOKEN', token: 'first' })),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 1001, displayName: '开发用户一', status: 'ACTIVE' })),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ headerName: 'X-CSRF-TOKEN', token: 'rotated' })),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetch)

    await api.devLogin(1001)
    await api.logout()

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/v1/dev/session',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: expect.objectContaining({ 'X-CSRF-TOKEN': 'first' }),
        body: JSON.stringify({ userId: 1001 }),
      }),
    )
    expect(fetch).toHaveBeenNthCalledWith(
      4,
      '/api/v1/auth/logout',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-CSRF-TOKEN': 'rotated' }),
      }),
    )
  })

  it('preserves unauthorized errors so pages can return to login', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ code: 'UNAUTHENTICATED', message: '请先登录', status: 401 }),
            { status: 401 },
          ),
        ),
    )
    await expect(api.boards()).rejects.toMatchObject({ status: 401, code: 'UNAUTHENTICATED' })
  })

  it('reports a proxy failure without trying to parse HTML as JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<h1>Bad gateway</h1>', { status: 502 })),
    )
    await expect(api.boards()).rejects.toBeInstanceOf(ApiError)
  })
})
