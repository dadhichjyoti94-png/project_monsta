import React from 'react'
import { FaGreaterThan } from "react-icons/fa6";
import Link from 'next/link';

export default function Address() {
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

                        <Link href={'/'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded hover:bg-[#c89b7d] cursor-pointer">
                                Logout
                            </div>
                        </Link>

                    </div>

                    <div className="flex-1">
                        <h3 className="text-[16px] mb-8 text-[#5a5a5a]">
                            The following addresses will be used on the checkout page by default.
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Billing Address */}
                            <div>
                                <h2 className="text-[22px] mb-4">Billing Address</h2>

                                <div className="border border-gray-300 p-5">
                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Billing Name*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Billing Email*
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Billing Mobile Number*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Billing Address*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Country*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            State*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            City*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="text-end">
                                        <button
                                            className="bg-[#c89b7d] hover:bg-black text-white
                                                        px-6 py-2 text-[14px] font-semibold
                                                        rounded-full transition-all duration-300"
                                        >
                                            UPDATE
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h2 className="text-[22px] mb-4">Shipping Address</h2>

                                <div className="border border-gray-300 p-5">
                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Shipping Name*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Shipping Email*
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Shipping Mobile Number*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Shipping Address*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            Country*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            State*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block mb-2 font-medium">
                                            City*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-2 py-2 outline-none rounded"
                                        />
                                    </div>

                                    <div className="text-end">
                                        <button
                                            className="bg-[#c89b7d] hover:bg-black text-white
                                                        px-6 py-2 text-[14px] font-semibold
                                                        rounded-full transition-all duration-300"
                                        >
                                            UPDATE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=' border-b border-gray-300 pt-5'></div>
            </div>
        </>
    )
}
