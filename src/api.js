const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return ''
}

let csrfLoaded = false

const ensureCsrfCookie = async () => {
  if (getCookie('csrftoken')) {
    csrfLoaded = true
    return
  }
  if (csrfLoaded) {
    return
  }
  csrfLoaded = true
  await fetch('/api/csrf/', {
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

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    let message = (data && data.message) || `Request failed (${response.status})`
    if (!data) {
      const rawText = await response.text()
      if (rawText.includes('CSRF')) {
        message = 'CSRF/session issue. Reload page and login again.'
      }
    }
    throw new Error(message)
  }

  return data || {}
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
}
