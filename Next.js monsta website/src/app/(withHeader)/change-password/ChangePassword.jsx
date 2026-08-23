'use client'
import axios from 'axios';
import Link from 'next/link'
import React from 'react'
import { FaGreaterThan } from "react-icons/fa6";
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import UserLogoutButton from '../componets/common/UserLogoutButton'


export default function ChangePassword() {
         const   ChangePassword = ((e) => {
        e.preventDefault();
        axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/change-password`, e.target, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then((result) => {
                if (result.data._status) {
                    toast.success(result.data._message)
                    e.target.reset()
                } else {
                    toast.success(result.data._message)
                }
            })
            .catch(() => {
            
                toast.error('something went wrong')
            })
    })
    return (
        <>
            <div>
                <div className='text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8'>
                    <p className='text-4xl font-medium text-[#242424]'>
                        My Dashboard
                    </p>

                    <div className='flex justify-center items-center gap-2 pt-3'>
                        <p className='hover:text-[#c09578]'>
                            Home
                        </p>

                        <FaGreaterThan size={10} className='mt-1' />

                        <p className='text-[#c09578]'>
                            My Dashboard
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 py-8 w-[84%] mx-auto md:flex-row">

                    <div className="w-full md:w-[260px] shrink-0">
                        <Link href={'/my-dashboard'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d] cursor-pointer">
                                My Dashboard
                            </div>
                        </Link>

                        <Link href={'/order'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d] cursor-pointer">
                                Orders
                            </div>
                        </Link>

                        <Link href={'/address'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d] cursor-pointer">
                                Addresses
                            </div>
                        </Link>

                        <Link href={'/my-profile'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d] cursor-pointer">
                                My Profile
                            </div>
                        </Link>

                        <Link href={'/change-password'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d] cursor-pointer">
                                Change Password
                            </div>
                        </Link>

                        <UserLogoutButton className="w-full bg-[#222] text-left text-white font-semibold px-4 py-3 rounded hover:bg-[#c89b7d] cursor-pointer" />

                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-4 font-serif text=[#242424]">Change Password</h2>
                        <form onSubmit={ChangePassword}>
                            <div className="border border-gray-200 rounded-md p-8 bg-white w-full min-h-[400px]">

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" name='current_password'
                                        className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">
                                        New Password<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" name='new_password'
                                        className="w-full border border-gray-300 px-4 py-3 rounded bg-gray-100"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">
                                        Confirm Password<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text" name='confirm_Password'
                                        className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="bg-[#c89b7d] hover:bg-[#b58768] text-white text-xs font-bold uppercase px-6 py-3 rounded-full transition">
                                        CHANGE PASSWORD
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className=' border-b border-gray-300 pt-5'></div>
            </div >
        </>
    )
}
