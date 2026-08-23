export const getWebsiteApiBaseUrl = () => {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
}

// The API returns the raw JWT in most environments, but accepting an already
// prefixed value keeps every protected request from becoming "Bearer Bearer …".
export const getUserAuthHeaders = (storedToken) => {
  const token = String(storedToken || '')
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^['"]|['"]$/g, '')

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getAdminApiBaseUrl = () => {
  const explicitAdminUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL

  if (explicitAdminUrl) {
    return explicitAdminUrl.replace(/\/$/, '')
  }

  const websiteApiUrl = getWebsiteApiBaseUrl()

  if (websiteApiUrl.endsWith('/api/website')) {
    return websiteApiUrl.replace(/\/api\/website$/, '/api/admin')
  }

  return websiteApiUrl
}

export const getAdminApiUrl = (endpoint = '') => {
  const baseUrl = getAdminApiBaseUrl()
  const cleanEndpoint = String(endpoint).replace(/^\//, '')

  return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl
}
