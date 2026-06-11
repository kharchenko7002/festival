// Tiny fetch wrapper for the festival backend API.
// All paths are same-origin: in production the Express server serves both the
// build and the /api routes; during development Vite proxies /api to the
// backend (see vite.config.js).

// The admin token is kept in sessionStorage (cleared when the tab closes).
const TOKEN_KEY = 'festivalAdminToken'

// Custom event so other sections (e.g. the program) can refresh when the
// festival manager saves or resets changes.
export const OVERRIDES_EVENT = 'festival:program-overrides'

export const getToken = () =>
  typeof window === 'undefined' ? null : window.sessionStorage.getItem(TOKEN_KEY)

export const setToken = (token) => window.sessionStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => window.sessionStorage.removeItem(TOKEN_KEY)

export const notifyOverridesChanged = () =>
  window.dispatchEvent(new Event(OVERRIDES_EVENT))

// Core request helper. Throws an Error (with `.status`) on a non-2xx response.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(
      (data && data.message) || `Forespørselen feilet (${response.status})`,
    )
    error.status = response.status
    throw error
  }
  return data
}

// --- API endpoints ---------------------------------------------------------

export const apiHealth = () => request('/health')

export const apiLogin = (username, password) =>
  request('/admin/login', { method: 'POST', body: { username, password } })

export const apiGetOverrides = () => request('/program/overrides')

export const apiSaveOverride = (override) =>
  request('/program/overrides', { method: 'POST', body: override, auth: true })

export const apiResetOverrides = () =>
  request('/program/overrides', { method: 'DELETE', auth: true })
