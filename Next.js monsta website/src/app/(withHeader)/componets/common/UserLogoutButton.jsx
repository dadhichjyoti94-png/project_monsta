'use client'

import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '@/app/ReduxToolkit/LoginSlice'

export default function UserLogoutButton({ className = '' }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.replace('/')
    toast.success('Logout successfully')
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      Logout
    </button>
  )
}
