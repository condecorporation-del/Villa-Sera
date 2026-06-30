const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://100.106.234.23:8001'

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  return res.json()
}

export async function login(username: string, password: string) {
  const body = new URLSearchParams({ username, password })
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error('Credenciales incorrectas')
  const data = await res.json()
  localStorage.setItem('admin_token', data.access_token)
  return data
}

export function logout() {
  localStorage.removeItem('admin_token')
}

export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, body: unknown) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path: string) => apiFetch(path, { method: 'PATCH' }),
  delete: (path: string) => apiFetch(path, { method: 'DELETE' }),
  postForm: (path: string, formData: FormData) => {
    const token = getToken()
    return fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal: AbortSignal.timeout(15000),
    }).then(r => r.json())
  },
}
