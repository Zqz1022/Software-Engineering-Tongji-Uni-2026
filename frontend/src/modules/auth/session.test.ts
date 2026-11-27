import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { api, ApiError } from '../../api/client'
import { useSessionStore } from './session'

beforeEach(() => setActivePinia(createPinia()))

describe('session state', () => {
  it('drops stale user data when the server reports an expired session', async () => {
    const session = useSessionStore()
    session.user = { id: 1001, displayName: '开发用户一', status: 'ACTIVE' }
    vi.spyOn(api, 'me').mockRejectedValue(new ApiError(401, 'UNAUTHENTICATED', '请先登录'))
    await session.restore()
    expect(session.user).toBeNull()
  })

  it('does not claim logout succeeded when the server could not invalidate the session', async () => {
    const session = useSessionStore()
    session.user = { id: 1001, displayName: '开发用户一', status: 'ACTIVE' }
    vi.spyOn(api, 'logout').mockRejectedValue(new ApiError(503, 'UNAVAILABLE', '稍后重试'))
    await expect(session.logout()).rejects.toThrow('稍后重试')
    expect(session.user?.id).toBe(1001)
  })
})
