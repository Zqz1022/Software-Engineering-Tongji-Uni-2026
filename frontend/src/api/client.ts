import type { components } from './schema'

export type User = components['schemas']['User']
export type Board = components['schemas']['Board']
type Csrf = components['schemas']['Csrf']

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch('/api/v1' + path, { ...init, credentials: 'same-origin' })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      body?.code ?? 'REQUEST_FAILED',
      body?.message ?? '请求失败，请稍后重试',
    )
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

async function post<T>(path: string, data?: unknown): Promise<T> {
  // Obtain the token for the current session; login/logout rotate or invalidate it.
  const csrf = await request<Csrf>('/auth/csrf')
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [csrf.headerName]: csrf.token },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

export const api = {
  options: () => request<components['schemas']['LoginOptions']>('/auth/options'),
  me: () => request<User>('/auth/me'),
  devLogin: (userId: number) => post<User>('/dev/session', { userId }),
  logout: () => post<void>('/auth/logout'),
  boards: () => request<components['schemas']['BoardList']>('/boards'),
}
