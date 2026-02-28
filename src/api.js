const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return ''
}

let csrfLoaded = false

// ✅ Backend URL yako ya Render
const BASE_URL = 'https://masoud-project-64gt.onrender.com'

const buildUrl = (url) => {
  if (url.startsWith('/')) {
    return `${BASE_URL}${url}`
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
    throw new Error(`Request failed (${response.status})`)
  }

  return data || {}
}

export const api = {
  get: (url) => request(url),
  post: (url, body) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
}