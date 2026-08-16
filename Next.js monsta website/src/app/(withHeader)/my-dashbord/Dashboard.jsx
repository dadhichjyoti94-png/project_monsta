'use client'

import Link from 'next/link';
import React from 'react'
import { FaGreaterThan } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/ReduxToolkit/LoginSlice';
import { toast } from 'react-toastify';
export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();

    const logoutHandler = () => {
        dispatch(logout());
        toast.success('Logout successfully');
        router.push('/');
    }
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

                        <button
                            type="button"
                            onClick={logoutHandler}
                            className="w-full bg-[#222] text-white font-semibold px-4 py-3 rounded hover:bg-[#c89b7d] cursor-pointer"
                        >
                            Logout
                        </button>

                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-4 text-[#242424]">
                            My Dashboard
                        </h3>

                        <p className="text-gray-700 leading-8">
                            From your account dashboard, you can easily check and view your
                            <b> recent orders</b>, manage your
                            <b> shipping and billing addresses</b>, and edit your
                            <b> password and account details</b>.
                        </p>
                    </div>
                </div>

                <div className='border-b border-gray-300 p-5'></div>

            </div>
        </>
    )
}
