'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { FaGreaterThan } from "react-icons/fa6";
import Cookies from 'js-cookie'

export default function MyProfile() {
    const [userProfile, setUserProfile] = useState('')
    const [gender ,setgender] = useState()

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/view-profile`, {}, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then((result) => {
                if (result.data._status) {
                    setUserProfile(result.data._data)
                    setgender(result.data._data.Gender)
                } else {
                    setUserProfile('')
                }
            })
            .catch(() => {
                toast.error('something went wrong')
            })
    }, [])

    //update profile
    
      const   updateProfile = ((e) => {
        e.preventDefault();
        axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update-profile`, e.target, {
            headers: {
                Authorization: `Bearer ${Cookies.get('user_login')}`
            }
        })
            .then((result) => {
                if (result.data._status) {
                    setgender(result.data._data.Gender) 
                    toast.success(result.data._message)
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
                        <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d] cursor-pointer">
                            My Dashboard
                        </div>

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

                        <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded hover:bg-[#c89b7d] cursor-pointer">
                            Logout
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-4 font-serif text=[#242424]">My Profile</h2>
                        <form onSubmit={updateProfile}>

                            <div className="border border-gray-200 rounded-md p-8 bg-white w-full min-h-[500px]">
                                <div className="flex items-center gap-4 mb-6">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="Gender" value={'male'}
                                        onClick={()=> setgender ('male')}
                                            className='W-5 h-5' checked={gender == 'male' ? 'checked' : ''} />
                                        <span>Male</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="Gender" value={'female'}
                                        onClick={()=> setgender ('female')}
                                            className='W-5 h-5' checked={gender == 'female' ? 'checked' : ''} />
                                        <span>Female</span>
                                    </label>
                                </div>

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">
                                        Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={userProfile.name}
                                        className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">
                                        Email<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={userProfile.email}
                                        className="w-full border border-gray-300 px-4 py-3 rounded bg-gray-100" disabled
                                    />
                                </div>

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">
                                        Mobile Number<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name='mobile_number'
                                        defaultValue={userProfile.mobile_number}
                                        className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="mb-10">
                                    <label className="block mb-2 font-medium">
                                        Address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="Address"
                                        defaultValue={userProfile.Address}
                                        className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="bg-[#c89b7d] hover:bg-[#b58768] text-white text-xs font-bold uppercase px-6 py-3 rounded-full transition">
                                        UPDATE
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


