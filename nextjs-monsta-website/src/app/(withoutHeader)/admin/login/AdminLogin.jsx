'use client'

import { adminLogin } from '@/app/ReduxToolkit/AdminLoginSlice'
import { ADMIN_ROLE_COOKIE, getAdminApiEndpoint, isAdminAuthResponse } from '@/app/utils/adminAuth'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function AdminLogin() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [loginProcessing, setLoginProcessing] = useState(false)

  const loginHandler = (e) => {
    e.preventDefault()
    setLoginProcessing(true)

    const formData = new FormData(e.target)
    const email = formData.get('email')?.trim()
    const password = formData.get('password')?.trim()

    if (!email) {
      toast.error('Email is required')
      setLoginProcessing(false)
      return
    }

    if (!password) {
      toast.error('Password is required')
      setLoginProcessing(false)
      return
    }

    axios.post(getAdminApiEndpoint('auth/login'), e.target, { withCredentials: true })
      .then((result) => {
        if (result.data._status == true && result.data._token && isAdminAuthResponse(result.data)) {
          Cookies.set(ADMIN_ROLE_COOKIE, 'admin')
          dispatch(adminLogin(result.data._token))
          toast.success('Admin login successfully')
          router.push('/admin/dashboard')
        } else if (result.data._status == true) {
          toast.error('Only admin users can access admin panel')
        } else {
          toast.error(result.data._message)
        }

        setLoginProcessing(false)
      })
      .catch((error) => {
        toast.error(error.response?.data?._message || 'something went wrong !')
        setLoginProcessing(false)
      })
  }

  return (
    <div className="min-h-screen bg-[#f6f2ef] flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] bg-white border border-gray-200 rounded p-8 shadow-sm">
        <div className="mb-8 text-center">
          <img src="/image/logo.png" className="w-[130px] mx-auto mb-5" alt="Monsta" />
          <h1 className="text-3xl font-serif text-[#242424]">Admin Login</h1>
        </div>

        <form onSubmit={loginHandler}>
          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="w-full bg-slate-100 border border-gray-200 px-4 py-3 outline-none focus:border-[#c89c74]"
              placeholder="Enter the Email"
            />
          </div>

          <div className="mb-7">
            <label className="block mb-2 font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              className="w-full bg-slate-100 border border-gray-200 px-4 py-3 outline-none focus:border-[#c89c74]"
              placeholder="Enter the Password"
            />
          </div>

          <button
            className="w-full bg-[#c89c74] text-white px-8 py-3 rounded-full font-semibold hover:bg-black cursor-pointer disabled:opacity-60"
            disabled={loginProcessing}
          >
            {loginProcessing ? 'Loading...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  )
}
