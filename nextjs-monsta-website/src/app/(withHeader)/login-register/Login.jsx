'use client'
import { login } from '@/app/ReduxToolkit/LoginSlice';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaGreaterThan } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link'
import Cookies from 'js-cookie'
import { getWebsiteApiBaseUrl } from '../utils/api'



export default function Login() {

    const dispatch = useDispatch();
    const router = useRouter()            //reduex toolkit k function ko call karne k liye use
    const [loginProcessing, setloginProcessing] = useState(false)
    const [registerProcessing, setRegisterProcessing] = useState(false)

    //login

    const loginHandler = (e) => {

        e.preventDefault();
        setloginProcessing(true)
        const formData = new FormData(e.target);

        const email = formData.get('email')?.trim();
        const password = formData.get('password')?.trim();

        if (!email) {
            toast.error('Email is required');
            setloginProcessing(false);
            return;
        }

        if (!password) {
            toast.error('Password is required');
            setloginProcessing(false);
            return;
        }
        axios.post(`${getWebsiteApiBaseUrl()}/user/login`, formData)
            .then((result) => {
                const token = result.data?._token

                if (result.data._status === true && token) {
                    // Keep the session available across browser restarts. The
                    // token itself is still sent only in the Authorization header.
                    Cookies.set('user_login', token, { expires: 7, sameSite: 'lax' })
                    dispatch(login(token));
                    toast.success('Login successfully')  
                    router.push('/my-dashbord')
                } else {
                    toast.error(result.data._message || 'Login token was not received. Please try again.')
                }
                setloginProcessing(false)
            })
            .catch(() => {
                toast.error('something went wrong !')
                setloginProcessing(false)
            })

    }

    //Register

    const registerHandler = (e) => {

        e.preventDefault();
        setRegisterProcessing(true)
        const formData = new FormData(e.target);

        //validation error
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const password = formData.get('password')?.trim();

        if (!name) {
            toast.error('Name is required');
            setRegisterProcessing(false);
            return;
        }

        if (!email) {
            toast.error('Email is required');
            setRegisterProcessing(false)
            return;
        }

        if (!password) {
            toast.error('Password is required');
            setRegisterProcessing(false)
            return;
        }
        axios.post(`${getWebsiteApiBaseUrl()}/user/register`, formData)
            .then((result) => {
                if (result.data._status == true) {
                    toast.success('Register successfully. Please login now.')
                    e.target.reset()
                } else {
                    const backendError =
                        result?.data?._error?.name ||
                        result?.data?._error?.email ||
                        result?.data?._error?.message ||
                        result?.data?._message ||
                        'Something went wrong.'

                    toast.error(backendError)
                }
                setRegisterProcessing(false)
            })
            .catch((error) => {
                const backendError =
                    error?.response?.data?._error?.name ||
                    error?.response?.data?._error?.email ||
                    error?.response?.data?._message ||
                    'Something went wrong!'

                toast.error(backendError)
                setRegisterProcessing(false)
            })

    }
    return (
        <>
            <div>
                <div className='text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8'>
                    <p className='text-3xl sm:text-4xl font-medium text-[#242424]'>
                        My Account
                    </p>
                    <div className='flex justify-center items-center gap-2 pt-3'>
                        <p className='hover:text-[#c09578]'>
                            Home
                        </p>
                        <FaGreaterThan size={10} className='mt-1' />
                        <p className='text-[#c09578]'>
                            My Account
                        </p>
                    </div>
                </div>

                <div className='border-b border-gray-300'>
                    <div className="w-[84%] mx-auto py-8 sm:py-12 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Login */}
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-serif mb-6 sm:mb-8">Login</h2>
                                <form onSubmit={loginHandler}>

                                    <div className="border border-gray-300 p-6 rounded">
                                        <div className="mb-6">
                                            <label className="block mb-2 font-medium">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email" name='email'
                                                className="w-full bg-slate-100 border' border-gray-200 px-4 py-3 outline-none"
                                                placeholder="Enter the Email"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="block mb-2 font-medium">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password" name='password'
                                                className="w-full bg-slate-100 border border-gray-200 px-4 py-3 outline-none"
                                                placeholder="Enter the Password"
                                            />
                                        </div>

                                        <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between sm:items-center cursor-pointer">
                                            <Link href="/forgot-password" className="text-[#c89c74] text-sm hover:text-[#c89c74]">
                                                Forgot password
                                            </Link>

                                            <button className="bg-[#c89c74] text-white px-8 py-2 rounded-full font-semibold hover:bg-black cursor-pointer" disabled={loginProcessing ? 'disabled' : ''}>
                                                {loginProcessing ? 'Loading...' : 'LOGIN'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Register */}
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-serif mb-6 sm:mb-8">Register</h2>
                                <form onSubmit={registerHandler}>
                                    <div className="mb-6">
                                        <label className="block mb-2 font-medium">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full bg-slate-100 border border-gray-200 px-4 py-3 outline-none"
                                            placeholder="Enter the Name"
                                        />
                                    </div>

                                    <div className="border border-gray-300 p-6 rounded">
                                        <div className="mb-6">
                                            <label className="block mb-2 font-medium">
                                                Email address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email" name='email'
                                                className="w-full bg-slate-100 border border-gray-200 px-4 py-3 outline-none"
                                                placeholder="Enter the Email"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="block mb-2 font-medium">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password" name='password'
                                                className="w-full bg-slate-100 border border-gray-200 px-4 py-3 outline-none"
                                                placeholder="Enter the Password"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button className="bg-[#c89c74] text-white px-8 py-2 rounded-full font-semibold hover:bg-black cursor-pointer" disabled={registerProcessing ? 'disabled' : ''}>
                                                {registerProcessing ? 'Loading...' : 'REGISTER'}

                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
