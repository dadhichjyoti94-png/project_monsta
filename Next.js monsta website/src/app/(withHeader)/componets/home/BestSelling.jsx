'use client'

import React, { useEffect, useState } from 'react'
import ProductCart from '../common/ProductCart'
import { IoEarth } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { hasProductFlag, mapProductCard } from '../../utils/product'
import { getAdminApiUrl } from '../../utils/api'


export default function BestSelling() {
    const [bestSelling, setBestSelling] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBestSellingProducts = async () => {
            try {
                const response = await fetch(getAdminApiUrl('product/view'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: true,
                        limit: 100,
                    }),
                })

                const data = await response.json()

                if (data?._status && Array.isArray(data?._data)) {
                    const products = data._data
                        .filter((product) => hasProductFlag(product, [
                            'is_best_selling',
                            'is_bestselling',
                            'best_selling',
                            'bestselling',
                        ]))
                        .map((product) => mapProductCard(product, data._image_path || ''))

                    setBestSelling(products)
                } else {
                    setBestSelling([])
                }
            } catch (error) {
                console.log('BEST SELLING PRODUCT ERROR =', error)
                setBestSelling([])
            } finally {
                setLoading(false)
            }
        }

        fetchBestSellingProducts()
    }, [])

    return (
        <>
            <div>
                <div className='pt-9 '>
                    <h3 className='text-[#242424] text-[25px] px-5 sm:px-8 lg:px-30 font-semibold'>
                        Bestselling Products
                    </h3>
                </div>

                <div className='w-[84%] max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6'>
                    {loading ? (
                        <p className="w-full text-center text-gray-500">
                            Loading products...
                        </p>
                    ) : bestSelling.length > 0 ? (
                        bestSelling.map((value) => {
                            return <ProductCart key={value.id || value.title} {...value} />
                        })
                    ) : (
                        <p className="w-full text-center text-gray-500">
                            No best selling products found
                        </p>
                    )}
                </div>

                <div className='border border-solid border-[#ebebeb] mt-8 bg-[#F8F9F9]'>

                    <div className='grid grid-cols-1 gap-12 px-5 py-14 sm:grid-cols-3 sm:gap-8 sm:py-25'>

                        {/* First */}
                        <div className='text-center'>
                            <div className='w-[70px] h-[70px] border border-black rounded-full flex items-center justify-center mx-auto mb-5 hover:border-[#c98b6b] hover:text-[#c98b6b]'>
                                <IoEarth size={25} />
                            </div>

                            <p className='text-[20px] font-semibold pb-4'>
                                Free Shipping
                            </p>

                            <p className='text-[19px] text-gray-500'>
                                Free shipping on all order
                            </p>
                        </div>

                        {/* Second */}
                        <div className='text-center'>
                            <div className='w-[70px] h-[70px] border border-black rounded-full flex items-center justify-center mx-auto mb-5 hover:border-[#c98b6b] hover:text-[#c98b6b]'>
                                <CiCircleCheck size={25} />
                            </div>

                            <p className='text-[20px] font-semibold pb-4'>
                                Money Return
                            </p>

                            <p className='text-[19px] text-gray-500'>
                                Back guarantee under 7 days
                            </p>
                        </div>

                        {/* Third */}
                        <div className='text-center'>
                            <div className='w-[70px] h-[70px] border border-black rounded-full flex items-center justify-center mx-auto mb-5 hover:border-[#c98b6b] hover:text-[#c98b6b]'>
                                <IoTimeOutline size={25} />
                            </div>

                            <p className='text-[20px] font-semibold pb-4'>
                                Online Support
                            </p>

                            <p className='text-[19px] text-gray-500'>
                                Support online 24 hours a day
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
