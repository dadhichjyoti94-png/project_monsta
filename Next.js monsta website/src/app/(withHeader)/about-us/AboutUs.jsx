'use client'

import React, { useEffect, useState } from 'react'
import { FaGreaterThan } from "react-icons/fa6";
import CustomerSays from '../componets/home/CustomerSays';

const getAdminApiUrl = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '';

    return apiBaseUrl
        .replace(/\/$/, '')
        .replace(/\/api\/website$/, '/api/admin');
};

const isActiveItem = (status) => {
    if (status === undefined || status === null) return true;
    if (typeof status === 'boolean') return status;
    if (typeof status === 'number') return status === 1;

    return ['1', 'true', 'active'].includes(String(status).toLowerCase());
};

const getItemOrder = (item) => Number(item._whyChooseOrder || item.order || 0);

const joinImageUrl = (basePath, image) => {
    if (!image) return '';
    if (/^https?:\/\//i.test(image)) return image;

    return `${String(basePath || '').replace(/\/$/, '')}/${String(image).replace(/^\//, '')}`;
};


export default function AboutUs() {
    const [whyChooseUs, setWhyChooseUs] = useState([]);
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        const adminApiUrl = getAdminApiUrl();

        if (!adminApiUrl) return;

        fetch(`${adminApiUrl}/why-choose-us/view`)
            .then((response) => response.json())
            .then((result) => {
                const whyChooseUsData = result?._data || result?.data || result?.items || [];

                setWhyChooseUs(
                    whyChooseUsData
                        .filter((item) => isActiveItem(item._whyChooseStatus ?? item.status))
                        .sort((a, b) => getItemOrder(a) - getItemOrder(b))
                );
                setImagePath(result?.path || result?._image_path || result?.image_path || result?.base_url || result?.baseUrl || '');
            })
            .catch(() => {
                setWhyChooseUs([]);
                setImagePath('');
            });
    }, []);

    return (
        <>
            <div>
                <div className='text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8'>
                    <p className='text-4xl font-medium text-[#242424]'>
                        About Us
                    </p>
                    <div className='flex justify-center items-center gap-2 pt-3'>
                        <p className='hover:text-[#c09578]'>
                            Home
                        </p>
                        <FaGreaterThan size={10} className='mt-1' />
                        <p className='text-[#c09578]'>
                            About Us
                        </p>
                    </div>
                </div>

                <div className='mt-10 flex justify-center'>
                    <img src='/image/img1.jpg' className='w-[84%]'></img>
                </div>

                <div className="mt-4 text-center px-4">

                    <p className="text-[25px] md:text-[30px] leading-[1.3] font-bold text-[#242424]">
                        Welcome To Monsta!
                    </p>

                    <p className="w-full max-w-[1550px] mx-auto pt-5 text-[17px] md:text-[20px] leading-[1.9] text-[#444]">
                        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
                        vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio
                        dignissim qui blandit praesent luptatum zzril delenit augue duis dolore</p>
                </div>
                {/* Previous static Why Choose Us cards - kept here for reference.
                <div className="mt-12 px-4">
                    <p className="text-center text-2xl font-semibold">
                        Why Choose Us?
                    </p>

                    <div className="flex gap-6 mt-12 pl-10">

                        <div className="flex-1 text-center">
                            <img
                                src="/image/house.jpg"
                                className="mx-auto mb-5 w-22"
                            />

                            <p className="text-sm font-semibold mb-3">
                                100% Money Back Guarantee
                            </p>

                            <p className="">
                                Erat metus sodales eget dolor consectetuer,
                                porta ut purus at et alias, nulla ornare velit
                                amet enim
                            </p>
                        </div>

                        <div className="flex-1 text-center">
                            <img
                                src="/image/person.jpg"
                                className="mx-auto mb-5 w-22"
                            />

                            <p className="text-sm font-semibold mb-3">
                                Online Support 24/7
                            </p>

                            <p className="">
                                Erat metus sodales eget dolor consectetuer,
                                porta ut purus at et alias, nulla ornare velit
                                amet enim
                            </p>
                        </div>

                        <div className="flex-1 text-center">
                            <img
                                src="/image/women.jpg"
                                className="mx-auto mb-5 w-80 h-100"
                            />

                            <p className="text-sm font-semibold mb-3">
                                Creative-Design
                            </p>

                            <p className="">
                                Erat metus sodales eget dolor consectetuer, porta ut purus at et alias, nulla ornare velit amet enim God has created everything like air,water,tree and metal
                            </p>
                        </div>

                    </div>
                </div>
                */}

                <div className="mt-12 px-4">
                    {/* Quote */}
                    <p className="text-center italic text-[14px] md:text-[20px] text-[#c09578] leading-relaxed mb-24 font-light">
                        “There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.”
                    </p>

                    {/* Heading */}
                    <div className="max-w-[1280px] mx-auto">
                        <p className="text-center text-[22px] md:text-[30px] font-bold text-[#242424] mb-14">
                            Why Choose Us?
                        </p>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.25fr] gap-10 lg:gap-12 items-start">

                            {/* LEFT - Money Back */}
                            <div className="text-center pt-2">
                                <div className="mb-7 flex justify-center text-[#c9b875]">
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="w-20 h-20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M15 42L50 15L85 42" />
                                        <path d="M25 40V80H75V40" />
                                        <path d="M42 80V58H58V80" />
                                    </svg>
                                </div>

                                <p className="text-[17px] md:text-[18px] font-bold text-[#242424] mb-5">
                                    100% Money Back Guarantee
                                </p>

                                <p className="text-[15px] md:text-[16px] leading-[1.8] text-[#444] max-w-[500px] mx-auto">
                                    Erat metus sodales eget dolor consectetuer, porta ut
                                    purus at et alias, nulla ornare velit amet enim
                                </p>
                            </div>


                            {/* CENTER - Online Support */}
                            <div className="text-center pt-2">
                                <div className="mb-7 flex justify-center text-[#c9b875]">
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="w-20 h-20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        {/* Left person */}
                                        <circle cx="34" cy="34" r="11" />
                                        <path d="M18 66C20 57 26 52 34 52C42 52 48 57 50 66" />

                                        {/* Right person */}
                                        <circle cx="59" cy="32" r="13" />
                                        <path d="M40 68C42 57 49 50 59 50C69 50 77 57 79 68" />
                                    </svg>
                                </div>

                                <p className="text-[17px] md:text-[18px] font-bold text-[#242424] mb-5">
                                    Online Support 24/7
                                </p>

                                <p className="text-[15px] md:text-[16px] leading-[1.8] text-[#444] max-w-[500px] mx-auto">
                                    Erat metus sodales eget dolor consectetuer, porta ut
                                    purus at et alias, nulla ornare velit amet enim
                                </p>
                            </div>


                            {/* RIGHT - Image */}
                            <div className="flex justify-center lg:justify-end">
                                <img
                                    src="/image/women.jpg"
                                    alt="Customer support representative"
                                    className="w-full max-w-[540px] h-[380px] md:h-[500px] lg:h-[600px] object-cover rounded-[8px]"
                                />
                            </div>

                        </div>


                    </div >
                </div >

                <div className='flex gap-5 mt-15'>
                    <div className='pl-20'>
                        <img src='/image/women3.jpg'></img>
                        <p className='pt-5 text-center font-medium text-sm'>What Do We Do?</p>
                        <p className='text-center pt-2 text-[14px]'>Mirum est notare quam littera gothica, quam nunc<br /> putamus parum claram, anteposuerit litterarum <br /> formas humanitatis per seacula quarta decima et <br /> quinta decima.</p>
                    </div>

                    <div>
                        <img src='/image/makeup.jpg'></img>
                        <p className='pt-5 text-center font-medium'>Our Mission</p>
                        <p className='text-center pt-2 text-[14px]'>Mirum est notare quam littera gothica, quam nunc<br /> putamus parum claram, anteposuerit litterarum <br /> formas humanitatis per seacula quarta decima et <br /> quinta decima.</p>
                    </div>

                    <div>
                        <img src='/image/history.jpg'></img>
                        <p className='pt-5 text-center font-medium'>History Of Us</p>
                        <p className='text-center pt-2 text-[14px]'>Mirum est notare quam littera gothica, quam nunc<br /> putamus parum claram, anteposuerit litterarum <br /> formas humanitatis per seacula quarta decima et <br /> quinta decima.</p>
                    </div>
                </div>

                {/* Previous static testimonial code - kept here for reference.
                <div className='pt-5 border-b border-gray-300 pb-9'>
                    <div className='text-center pt-10'>
                        <h3 className='text-[26px] text-[#242424] font-semibold pb-8'>What Our Custumers Say ?</h3>
                        <p className='max-w-[790px] m-auto text-gray-700 leading-7'>These guys have been absolutely outstanding. Perfect Themes and the best of all that you have many options to choose! Best Support team ever! Very fast responding! Thank you very much! I highly recommend this theme and these people!</p>
                    </div>

                    <div className='text-center pt-10'>
                        <div>
                            <img src='/image/women1.jpg' className='m-auto' />
                        </div>
                        <div>
                            <p className='py-4'>KATHY YOUNG</p>
                            <p className='text-gray-700'>CEO of SunPark</p>
                            <div className='flex justify-center pt-4'>

                                <FaStar />
                                <FaStar /> 
                                <FaStar />
                                <FaStar />
                                <FaStar />

                            </div>
                        </div>
                    </div>
                </div>
                */}

                {/* Dynamic testimonial: admin panel data is used here. */}
                <div className='pt-5 border-b border-gray-300 pb-9'>
                    <CustomerSays showNewsletter={false} />
                </div>
            </div >
        </>
    )
}
