import Link from 'next/link';
import React from 'react'
import { FaGreaterThan } from "react-icons/fa6";

export default function Order() {
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
                            <div className=" bg-[black] hover:bg-[#c89b7d] text-white font-semibold px-4 py-3 rounded mb-2">
                                My Dashboard
                            </div>
                        </Link>

                        <Link href={'/order'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">
                                Orders
                            </div>
                        </Link>


                        <Link href={'/address'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">
                                Addresses
                            </div>
                        </Link>

                        <Link href={'/my-profile'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">
                                My Profile
                            </div>
                        </Link>

                        <Link href={'/change-password'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">
                                Change Password
                            </div>
                        </Link>

                        <Link href={'/'}>
                            <div className="bg-[#222] text-white font-semibold px-4 py-3 rounded hover:bg-[#c89b7d]">
                                Logout
                            </div>
                        </Link>

                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-4 text-[#242424]">
                            Orders
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-4 text-center font-semibold">Order</th>
                                        <th className="p-4 text-center font-semibold">Date</th>
                                        <th className="p-4 text-center font-semibold">Status</th>
                                        <th className="p-4 text-center font-semibold">Total</th>
                                        <th className="p-4 text-center font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="p-4 text-center border border-gray-300">1</td>
                                        <td className="p-4 text-center border border-gray-300">May10,2018</td>
                                        <td className="p-4 text-center border border-gray-300">Completed</td>
                                        <td className="p-4 text-center border border-gray-300">Rs. 25.00 for 1 item</td>
                                        <td className="p-4 text-center border border-gray-300 text-[#c09578] font-semibold cursor-pointer">
                                            View
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="p-4 text-center border border-gray-300">2</td>
                                        <td className="p-4 text-center border border-gray-300">May10,2018</td>
                                        <td className="p-4 text-center border border-gray-300">Processing</td>
                                        <td className="p-4 text-center border border-gray-300">Rs. 17.00 for 1 item</td>
                                        <td className="p-4 text-center border border-gray-300 text-[#c09578] font-semibold cursor-pointer">
                                            View
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='border-b border-gray-300 p-5'></div>
            </div>
        </>
    )
}
