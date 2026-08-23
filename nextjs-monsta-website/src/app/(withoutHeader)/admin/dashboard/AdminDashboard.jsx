'use client'

import { adminLogout as adminLogoutAction } from '@/app/ReduxToolkit/AdminLoginSlice'
import { adminApi, adminLogout } from '@/app/utils/adminAuth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [adminProfile, setAdminProfile] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)

  const logoutHandler = () => {
    adminApi('auth/logout')
      .catch(() => {})
      .finally(() => {
        adminLogout()
        dispatch(adminLogoutAction())
        toast.success('Admin logout successfully')
        router.push('/admin/login')
      })
  }

  useEffect(() => {
    adminApi('auth/profile')
      .then((result) => {
        if (result.data._status) {
          setAdminProfile(result.data._data || '')
        } else if (/unauthorized|forbidden|invalid|expired/i.test(result.data._message || '')) {
          toast.error(result.data._message || 'Unauthorized admin')
          logoutHandler()
        } else {
          setAdminProfile('')
        }
      })
      .catch((error) => {
        if ([401, 403].includes(error.response?.status)) {
          toast.error(error.response?.data?._message || 'Admin session expired')
          logoutHandler()
        } else {
          setAdminProfile('')
        }
      })
      .finally(() => {
        setProfileLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="bg-[#222] text-white">
        <div className="w-[84%] mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/image/logo.png" className="w-[110px] bg-white px-3 py-2" alt="Monsta" />
            <h1 className="text-2xl font-serif">Admin Dashboard</h1>
          </div>

          <button
            onClick={logoutHandler}
            className="bg-[#c89c74] text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-[#222]"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="w-[84%] mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="bg-[#c89c74] text-white font-semibold px-4 py-3 rounded mb-2">
              Dashboard
            </div>
            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2">
              Products
            </div>
            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2">
              Orders
            </div>
            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded">
              Users
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-8 min-h-[420px]">
            <h2 className="text-2xl font-serif text-[#242424] mb-4">Welcome Admin</h2>

            {profileLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <div className="text-gray-700 leading-8">
                <p>
                  Admin session is active and this page is protected by the same cookie,
                  proxy redirect, Redux state, and bearer token pattern used by website login.
                </p>

                {adminProfile && (
                  <div className="mt-6 border border-gray-200 rounded p-4 bg-[#fafafa]">
                    <p className="font-semibold text-[#242424]">Admin Profile</p>
                    <p>{adminProfile.name || adminProfile.email || 'Admin user'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
