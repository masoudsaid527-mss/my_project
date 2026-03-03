let csrfLoaded = false
let csrfToken = ''
let authToken = ''

if (typeof window !== 'undefined') {
  authToken = window.localStorage.getItem('access_token') || ''
}

const normalizeBaseUrl = (url) => (url || '').trim().replace(/\/+$/, '')

const DEFAULT_DEPLOY_API_BASE_URL = 'https://masoud-project-64gt.onrender.com'

const ENV_API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL_DEPLOY,
)

const IS_LOCAL_UI =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname)

const getBaseUrlCandidates = () => {
  const envBase = normalizeBaseUrl(ENV_API_BASE_URL)
  if (!IS_LOCAL_UI) {
    return [envBase || DEFAULT_DEPLOY_API_BASE_URL].filter(Boolean)
  }

  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const localFromHost = `http://${host}:8000`
  const localFallback = host === 'localhost' ? 'http://127.0.0.1:8000' : 'http://localhost:8000'

  // In local UI, use local backend only. Do not fall back to remote to avoid auth/session mismatch.
  return [localFromHost, localFallback]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)
}

let activeBaseUrl = getBaseUrlCandidates()[0] || ''

const buildUrl = (url, baseUrl = activeBaseUrl) => {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  if (url.startsWith('/')) {
    return baseUrl ? `${baseUrl}${url}` : url
  }

  return url
}

const ensureCsrfCookie = async () => {
  if (csrfToken) return
  if (csrfLoaded) return

  csrfLoaded = true

  try {
    const candidates = getBaseUrlCandidates()
    let tokenLoaded = false
    for (const baseUrl of candidates) {
      try {
        const response = await fetch(buildUrl('/api/csrf/', baseUrl), {
          method: 'GET',
          credentials: 'include',
        })
        const contentType = response.headers.get('content-type') || ''
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json()
          csrfToken = data?.csrfToken || ''
          activeBaseUrl = baseUrl
          tokenLoaded = true
          break
        }
      } catch {
        // try next base url
      }
    }
    if (!tokenLoaded) {
      csrfLoaded = false
    }
  } catch {
    csrfLoaded = false
  }
}

const request = async (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase()

  const headers = {
    ...(options.headers || {}),
  }

  if (!headers['Content-Type'] && method !== 'GET') {
    headers['Content-Type'] = 'application/json'
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  if (method !== 'GET' && !authToken) {
    await ensureCsrfCookie()
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }
  }

  const candidates = getBaseUrlCandidates()
  let lastError = null

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(buildUrl(url, baseUrl), {
        credentials: 'include',
        ...options,
        headers,
      })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json')
        ? await response.json()
        : null

      if (!response.ok) {
        const error = new Error(
          data?.message || `Request failed (${response.status})`,
        )
        error.status = response.status
        error.data = data
        throw error
      }

      activeBaseUrl = baseUrl
      return data || {}
    } catch (error) {
      lastError = error
      if (error?.status) {
        throw error
      }
    }
  }

  const attempted = candidates.join(', ')
  throw new Error(
    lastError?.message ||
      `Backend not reachable. Start backend server on port 8000. Tried: ${attempted}`,
  )
}

export const api = {
  get: (url) => request(url),
  post: (url, body) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
  setAuthToken: (token) => {
    authToken = token || ''
    if (typeof window !== 'undefined') {
      if (authToken) {
        window.localStorage.setItem('access_token', authToken)
      } else {
        window.localStorage.removeItem('access_token')
      }
    }
  },
  clearAuthToken: () => {
    authToken = ''
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('access_token')
    }
  },
}
