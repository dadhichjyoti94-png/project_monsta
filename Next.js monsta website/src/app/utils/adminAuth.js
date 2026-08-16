import axios from 'axios'
import Cookies from 'js-cookie'

export const ADMIN_LOGIN_COOKIE = 'admin_token'
export const ADMIN_ROLE_COOKIE = 'admin_role'

export const getAdminApiUrl = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || ''
  const cleanBaseUrl = apiBaseUrl.replace(/\/$/, '')

  if (!cleanBaseUrl) return ''

  if (cleanBaseUrl.endsWith('/api/website')) {
    return cleanBaseUrl.replace(/\/api\/website$/, '/api/admin')
  }

  return cleanBaseUrl
}

export const getAdminApiEndpoint = (endpoint) => {
  const adminApiUrl = getAdminApiUrl()

  if (!adminApiUrl) return ''

  return `${adminApiUrl}/${String(endpoint || '').replace(/^\//, '')}`
}

export const decodeJwtPayload = (token) => {
  try {
    const payload = token?.split('.')?.[1]

    if (!payload) return null

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='))

    return JSON.parse(decodedPayload)
  } catch {
    return null
  }
}

export const hasAdminRole = (data) => {
  if (!data) return false

  const role = data.role || data.role_type || data.user_role || data.userType || data.user_type || data.type

  return (
    role === 'admin' ||
    role === 'super_admin' ||
    role === 1 ||
    data.is_admin === true ||
    data.isAdmin === true
  )
}

export const isAdminAuthResponse = (data) => {
  const tokenPayload = decodeJwtPayload(data?._token)
  const adminData = data?._data || data?.data || data?.admin || data?.user

  return hasAdminRole(tokenPayload?.adminData) || hasAdminRole(tokenPayload) || hasAdminRole(adminData) || hasAdminRole(data)
}

export const getAdminToken = () => Cookies.get(ADMIN_LOGIN_COOKIE) || Cookies.get('admin_login')

export const isAdminSession = () => {
  const token = getAdminToken()

  return Boolean(token && (hasAdminRole(decodeJwtPayload(token)) || Cookies.get(ADMIN_ROLE_COOKIE) === 'admin'))
}

export const adminLogout = () => {
  Cookies.remove(ADMIN_LOGIN_COOKIE)
  Cookies.remove('admin_login')
  Cookies.remove(ADMIN_ROLE_COOKIE)
}

export const adminApi = (endpoint, data = {}, config = {}) => {
  const token = getAdminToken()

  return axios.post(getAdminApiEndpoint(endpoint), data, {
    ...config,
    withCredentials: true,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.headers || {}),
    },
  })
}
