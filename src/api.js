const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return ''
}

let csrfLoaded = false
const configuredBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : ''
const runtimeBase = runtimeHost ? `http://${runtimeHost}:8000` : ''
let activeBase = ''

const uniqueBases = (bases) => {
  const seen = new Set()
  const result = []
  for (const base of bases) {
    if (base == null) continue
    const normalized = String(base).replace(/\/$/, '')
    if (seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }
  return result
}

const getApiBases = () => {
  if (configuredBase) {
    return [configuredBase]
  }
  return uniqueBases([
    activeBase,
    runtimeBase,
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    '',
  ])
}

const buildUrlForBase = (url, base) => {
  if (typeof url === 'string' && url.startsWith('/')) {
    return base ? `${base}${url}` : url
  }
  return url
}

const ensureCsrfCookie = async () => {
  if (getCookie('csrftoken')) {
    csrfLoaded = true
    return
  }
  if (csrfLoaded) {
    return
  }
  csrfLoaded = true
  for (const base of getApiBases()) {
    try {
      await fetch(buildUrlForBase('/api/csrf/', base), {
        method: 'GET',
        credentials: 'include',
      })
      activeBase = base
      return
    } catch {
      // Try next base URL.
    }
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

  if (method !== 'GET') {
    await ensureCsrfCookie()
    const token = getCookie('csrftoken')
    if (token) {
      headers['X-CSRFToken'] = token
    }
  }

  let response
  let data = null
  let lastNetworkError = null
  let lastHttpError = null

  for (const base of getApiBases()) {
    try {
      response = await fetch(buildUrlForBase(url, base), {
        credentials: 'include',
        ...options,
        headers,
      })
      const contentType = response.headers.get('content-type') || ''
      data = contentType.includes('application/json') ? await response.json() : null

      // In local dev, Vite can return HTML/404 for /api/* on same-origin.
      // Retry other configured backends before failing.
      const shouldTryNextBase =
        base === '' &&
        getApiBases().length > 1 &&
        (
          (response.ok && !contentType.includes('application/json')) ||
          response.status === 404
        )

      if (shouldTryNextBase) {
        lastHttpError = { response, data }
        continue
      }

      lastNetworkError = null
      lastHttpError = null
      activeBase = base
      break
    } catch (networkError) {
      lastNetworkError = networkError
    }
  }

  if (lastNetworkError || !response) {
    throw new Error('Cannot connect to backend server. Start Django server on port 8000 and retry.')
  }

  if (lastHttpError && !response.ok) {
    response = lastHttpError.response
    data = lastHttpError.data
  }

  if (!response.ok) {
    let message = (data && data.message) || `Request failed (${response.status})`
    if (!data) {
      const rawText = await response.text()
      if (rawText.includes('CSRF')) {
        message = 'CSRF/session issue. Reload page and login again.'
      } else {
        const compact = rawText.replace(/\s+/g, ' ').trim().slice(0, 220)
        if (compact) {
          message = `${message}: ${compact}`
        }
      }
    }
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data || {}
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
}
