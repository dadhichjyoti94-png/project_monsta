'use client'

import axios from 'axios';
import React, { useState } from 'react'
import { FaGreaterThan } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { SlEnvolope } from "react-icons/sl";
import { toast } from 'react-toastify';

export default function ContactUs() {
    const [loading, setLoading] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);

        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/content-enquiry/create`, {
            name: event.target.name.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            subject: event.target.subject.value,
            message: event.target.message.value
        })
            .then((result) => {
                if (result.data._status) {
                    toast.success('Enquiry submitted successfully.');
                    event.target.reset();
                } else {
                    toast.error(result.data._message || 'Something went wrong.');
                }
            })
            .catch(() => {
                toast.error('Enquiry submit nahi ho payi.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div>
                <div className='text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8'>
                    <p className='text-4xl font-medium text-[#242424]'>
                        Contact Us
                    </p>
                    <div className='flex justify-center items-center gap-2 pt-3'>
                        <p className='hover:text-[#c09578]'>
                            Home
                        </p>
                        <FaGreaterThan size={10} className='mt-1' />
                        <p className='text-[#c09578]'>
                            Contact Us
                        </p>
                    </div>
                </div>

                <div>
                    <div className="w-[84%] mx-auto h-[300px] sm:h-[450px] pt-5">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.6255114907312!2d73.0306057!3d26.2738149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c5b1dfafdd7%3A0xf992fd41c21a238e!2sLaxmi%20Dairy%20%26%20Provision%20Store!5e0!3m2!1sen!2sin!4v1780384520508!5m2!1sen!2sin"
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe>
                    </div>

                    <div className='w-[84%] mx-auto pt-10 sm:pt-15 flex flex-col justify-between gap-8 lg:flex-row'>

                        <div className='w-[48%]'>
                            <h3 className='text-[#242424] text-3xl font-semibold'>
                                Contact Us
                            </h3>

                            <div className='mt-6'>
                                <p className='flex items-center gap-4 border-t border-b border-gray-300 py-5'>
                                    <FaAddressCard />
                                    <span>Address : Claritas est etiam processus dynamicus</span>
                                </p>

                                <p className='flex items-center gap-4 border-b border-gray-300 py-5'>
                                    <FaPhoneAlt />
                                    <span>98745612330</span>
                                </p>

                                <p className='flex items-center gap-4 py-5'>
                                    <SlEnvolope />
                                    <span>furniture@gmail.com</span>
                                </p>
                            </div>
                        </div>

                        <div className='w-[52%]'>
                            <h3 className='text-[#242424] text-3xl font-semibold'>
                                Tell Us Your Question
                            </h3>

                            <form onSubmit={submitHandler} className='mt-6'>
                                <label className='font-semibold block mb-2'>
                                    Your Name (required)
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Name *"
                                    className='w-full border border-gray-300 p-4 mb-6 outline-none'
                                />

                                <label className='font-semibold block mb-2'>
                                    Your Email (required)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email *"
                                    className='w-full border border-gray-300 p-4 mb-6 outline-none'
                                />

                                <label className='font-semibold block mb-2'>
                                    Your Mobile Number (required)
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    placeholder="Mobile Number *"
                                    className='w-full border border-gray-300 p-4 mb-6 outline-none'
                                />

                                <label className='font-semibold block mb-2'>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject *"
                                    className='w-full border border-gray-300 p-4 mb-6 outline-none'
                                />

                                <label className='font-semibold block mb-2'>
                                    Your Message
                                </label>
                                <textarea
                                    name="message"
                                    placeholder="Message *"
                                    rows="6"
                                    className='w-full border border-gray-300 p-4 outline-none resize-none'
                                ></textarea>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#242424] text-white h-[48px] px-10 mt-4 text-base font-medium cursor-pointer hover:bg-[#c09578] transition-all duration-300 rounded"
                                >
                                    {loading ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>

                    </div>

                    <div className='w-full border-b border-gray-300 pt-17'></div>
                </div>
            </div>
        </>
    )
}
