import { NextResponse } from 'next/server'

const decodeJwtPayload = (token) => {
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

const hasAdminRole = (payload) => {
  if (!payload) return false

  const role = payload.role || payload.role_type || payload.user_role || payload.userType || payload.user_type || payload.type

  return (
    role === 'admin' ||
    role === 'super_admin' ||
    role === 1 ||
    payload.is_admin === true ||
    payload.isAdmin === true
  )
}

export function proxy(request) {
  const cookies = request.cookies.get('user_login')?.value
  const isLogin = cookies ? 1 : 0
  const adminToken = request.cookies.get('admin_token')?.value || request.cookies.get('admin_login')?.value
  const adminRole = request.cookies.get('admin_role')?.value
  const adminPayload = decodeJwtPayload(adminToken)
  const isAdminLogin = adminToken && (hasAdminRole(adminPayload?.adminData) || hasAdminRole(adminPayload) || adminRole === 'admin') ? 1 : 0
  const isAdminLoginPage = request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminProtectedRoute = request.nextUrl.pathname.startsWith('/admin') && !isAdminLoginPage

  if (isLogin === 1 && request.nextUrl.pathname.startsWith('/login-register')) {
    return NextResponse.redirect(new URL('/my-dashbord', request.url))
  }

  if (isLogin === 0 && request.nextUrl.pathname.startsWith('/my-dashbord')) {
    return NextResponse.redirect(new URL('/login-register', request.url))
  }

  if (isAdminLogin === 1 && isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (isAdminLogin === 0 && isAdminProtectedRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}
