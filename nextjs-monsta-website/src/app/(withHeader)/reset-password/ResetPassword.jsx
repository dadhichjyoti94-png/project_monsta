'use client'

import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaGreaterThan } from "react-icons/fa6"
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const resetPasswordHandler = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    formData.append('token', token)

    axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/reset-password`, formData)
      .then((result) => {
        if (result.data._status) {
          toast.success(result.data._message)
          e.target.reset()
          router.push('/login-register')
        } else {
          toast.error(result.data._message)
        }
      })
      .catch(() => {
        toast.error('something went wrong')
      })
  }

  return (
    <div>
      <div className="text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8">
        <p className="text-4xl font-medium text-[#242424]">Reset Password</p>

        <div className="flex justify-center items-center gap-2 pt-3">
          <p>Home</p>
          <FaGreaterThan size={10} className="mt-1" />
          <p className="text-[#c09578]">Reset Password</p>
        </div>
      </div>

      <div className="w-[84%] mx-auto py-14">
        <h2 className="text-3xl mb-8">Reset Password</h2>

        <form onSubmit={resetPasswordHandler}>
          <div className="border border-gray-300 p-8">
            <label className="block mb-2 font-medium">New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              className="w-full border border-gray-300 px-4 py-3 outline-none mb-6"
            />

            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 px-4 py-3 outline-none mb-6"
            />

            <button className="bg-[#c89b7d] hover:bg-[#b58768] text-white text-xs font-bold uppercase px-6 py-3 rounded-full">
              RESET PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
