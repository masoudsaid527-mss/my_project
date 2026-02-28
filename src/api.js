const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return ''
}

let csrfLoaded = false

const normalizeBaseUrl = (url) => (url || '').trim().replace(/\/+$/, '')

const DEFAULT_API_BASE_URL = 'https://masoud-project-64gt.onrender.com'

const BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL_DEPLOY ||
    DEFAULT_API_BASE_URL,
)

const buildUrl = (url) => {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  if (url.startsWith('/')) {
    return BASE_URL ? `${BASE_URL}${url}` : url
  }

  return url
}

const ensureCsrfCookie = async () => {
  if (getCookie('csrftoken')) return
  if (csrfLoaded) return

  csrfLoaded = true

  await fetch(buildUrl('/api/csrf/'), {
    method: 'GET',
    credentials: 'include',
  })
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

  const response = await fetch(buildUrl(url), {
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

  return data || {}
}

export const api = {
  get: (url) => request(url),
  post: (url, body) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
}
