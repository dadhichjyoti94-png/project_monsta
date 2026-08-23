'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getAdminApiUrl } from '../../utils/api'

const fallbackTestimonials = [
  {
    image: '/image/img10.jpg',
    name: 'KATHY YOUNG',
    role: 'CEO of SunPark',
    text: 'These guys have been absolutely outstanding. Perfect Themes and the best of all that you have many options to choose! Best Support team ever! Very fast responding! Thank you very much! I highly recommend this theme and these people!',
  },
  {
    image: '/image/img11.png',
    name: 'JOHN SULLIVAN',
    role: 'Interior Designer',
    text: 'The furniture quality and support experience were excellent. Every product looked beautiful, arrived on time, and made the full room setup feel easy and premium.',
  },
  {
    image: '/image/img13.jpg',
    name: 'AMANDA LEE',
    role: 'Store Customer',
    text: 'I loved the collection and the smooth shopping experience. The team helped me choose the right pieces, and everything matched my home perfectly.',
  },
]

const getApiOrigin = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  if (!apiBaseUrl) {
    return ''
  }

  try {
    return new URL(apiBaseUrl).origin
  } catch {
    return apiBaseUrl
      .replace(/\/api(\/.*)?$/, '')
      .replace(/\/$/, '')
  }
}

const getImageUrl = (image, imagePath = '') => {
  const imageValue =
    typeof image === 'string'
      ? image
      : image?.src || image?.url || image?.path || image?.file || image?.image || ''

  if (!imageValue || typeof imageValue !== 'string') {
    return '/image/img10.jpg'
  }

  if (
    imageValue.startsWith('http://') ||
    imageValue.startsWith('https://') ||
    imageValue.startsWith('data:') ||
    imageValue.startsWith('//')
  ) {
    return imageValue
  }

  if (imageValue.startsWith('/')) {
    return imageValue
  }

  const cleanedImage = imageValue.replace(/^\/+/, '')

  const fallbackImagePath = `${getApiOrigin()}/uploads/testimonial`
  const resolvedImagePath = imagePath || fallbackImagePath

  if (!resolvedImagePath) {
    return `/${cleanedImage}`
  }

  const basePath = String(resolvedImagePath).trim().replace(/\/+$/, '')

  const rootBase = (() => {
    if (!basePath) return ''

    if (basePath.startsWith('http://') || basePath.startsWith('https://')) {
      return basePath
        .replace(/\/api(\/.*)?$/, '')
        .replace(/\/admin(\/.*)?$/, '')
        .replace(/\/website(\/.*)?$/, '')
        .replace(/\/$/, '')
    }

    if (basePath.includes('/api/')) {
      return basePath.split('/api/')[0]
    }

    if (basePath.includes('/admin')) {
      return basePath.replace(/\/admin.*$/, '')
    }

    if (basePath.includes('/website')) {
      return basePath.replace(/\/website.*$/, '')
    }

    return basePath
  })()

  if (!rootBase) {
    return `/${cleanedImage}`
  }

  if (cleanedImage.startsWith('uploads/') || cleanedImage.startsWith('images/') || cleanedImage.startsWith('storage/')) {
    return `${rootBase}/${cleanedImage}`
  }

  return `${rootBase}/${cleanedImage}`
}

const extractTestimonials = (payload) => {
  if (!payload || typeof payload !== 'object') return []

  const candidates = [
    payload._data,
    payload.data,
    payload.result,
    payload.items,
    payload.list,
    payload.testimonials,
    payload.reviews,
  ]

  for (const item of candidates) {
    if (Array.isArray(item)) return item
  }

  return []
}

const normalizeTestimonial = (item, index, baseImagePath = '') => {
  const imageField =
    item?.image ||
    item?.photo ||
    item?.avatar ||
    item?.profile_image ||
    item?.img ||
    item?.image_url ||
    item?.imageUrl ||
    item?.photo_url ||
    item?.file ||
    item?.path ||
    item?.url

  return {
    id: item?._id || item?.id || `testimonial-${index + 1}`,
    image: getImageUrl(
      imageField,
      item?._image_path || item?.image_path || item?.base_url || item?.baseUrl || baseImagePath || ''
    ),
  name:
    item?.name ||
    item?.customer_name ||
    item?.client_name ||
    item?.full_name ||
    item?.title ||
    `Customer ${index + 1}`,
    role:
      item?.role ||
      item?.designation ||
      item?.profession ||
      item?.company ||
      item?.position ||
      'Verified Customer',
    text:
      item?.text ||
      item?.review ||
      item?.comment ||
      item?.message ||
      item?.feedback ||
      item?.description ||
      'Excellent experience and highly recommended.',
  }
}

const fetchTestimonials = async () => {
  const endpoints = ['testimonial', 'testimonials', 'review', 'reviews']

  for (const endpoint of endpoints) {
    try {
      const response = await axios.post(getAdminApiUrl(`${endpoint}/view`), {
        status: true,
        limit: 20,
      })

      const list = extractTestimonials(response.data)
      const baseImagePath = response.data?._image_path || response.data?.image_path || ''

      if (list.length > 0) {
        const normalized = list.map((item, index) => normalizeTestimonial(item, index, baseImagePath))
        return normalized
      }
    } catch (error) {
      console.log(`${endpoint.toUpperCase()} TESTIMONIAL API ERROR =`, error)
    }
  }

  return fallbackTestimonials
}

export default function CustomerSays() {
  const [loading, setLoading] = useState(false)
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    let mounted = true

    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials()

        if (mounted) {
          setTestimonials(data)
          setActiveSlide(0)
        }
      } catch (error) {
        console.log('TESTIMONIAL LOAD ERROR =', error)

        if (mounted) {
          setTestimonials(fallbackTestimonials)
          setActiveSlide(0)
        }
      } finally {
        if (mounted) {
          setLoadingTestimonials(false)
        }
      }
    }

    loadTestimonials()

    return () => {
      mounted = false
    }
  }, [])

  const activeTestimonial = testimonials?.[activeSlide] || testimonials?.[0] || fallbackTestimonials[0]
  const safeImage = activeTestimonial?.image || '/image/img10.jpg'
  const safeName = activeTestimonial?.name || 'KATHY YOUNG'
  const safeRole = activeTestimonial?.role || 'CEO of SunPark'
  const safeText = activeTestimonial?.text || 'These guys have been absolutely outstanding.'

  const newsletterHandler = (event) => {
    event.preventDefault()
    setLoading(true)

    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter/create`, {
      email: event.target.email.value,
    })
      .then((result) => {
        if (result.data._status) {
          toast.success('Newsletter subscribed successfully.')
          event.target.reset()
        } else {
          toast.error(result.data._message || 'Something went wrong.')
        }
      })
      .catch(() => {
        toast.error('Newsletter subscribe nahi ho paya.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div>
        <div>
          <div className='text-center pt-10'>
            <h3 className='text-[26px] text-[#242424] font-semibold pb-8'>What Our Custumers Say ?</h3>

            {loadingTestimonials ? (
              <p className='max-w-[790px] mx-5 sm:mx-auto text-gray-500 leading-7'>Loading testimonials...</p>
            ) : (
              <p className='max-w-[790px] mx-5 sm:mx-auto text-gray-700 leading-7'>{safeText}</p>
            )}
          </div>

          <div className='text-center pt-10'>
            <div>
              <img
                src={safeImage}
                alt={safeName}
                onError={(event) => {
                  event.currentTarget.src = '/image/img10.jpg'
                  event.currentTarget.onerror = null
                }}
                className='m-auto h-[90px] w-[90px] rounded-full object-cover'
              />
            </div>
            <div>
              <p className='py-4 text-[#242424] font-semibold'>{safeName}</p>
              <p className='text-gray-600 text-[14px]'>{safeRole}</p>
              <div className='flex justify-center pt-4'>
                <FaStar className='text-[#c89a74]' />
                <FaStar className='text-[#c89a74]' />
                <FaStar className='text-[#c89a74]' />
                <FaStar className='text-[#c89a74]' />
                <FaStar className='text-[#c89a74]' />
              </div>

              <div className='flex justify-center gap-3 pt-6 pb-4'>
                {testimonials && testimonials.length > 0 ? (
                  testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id || testimonial.image || index}
                      type='button'
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Show testimonial ${index + 1}`}
                      className={`h-3 w-3 rounded-full border border-[#c89a74] transition-colors ${
                        activeSlide === index ? 'bg-[#c89a74]' : 'bg-white'
                      }`}
                    />
                  ))
                ) : (
                  <p className='text-gray-500'>No testimonials available</p>
                )}
              </div>
            </div>
          </div>

          <div className='bg-[#F8F9F9] mt-10 py-5'>
            <div className=''>
              <h3 className='pt-15 text-center text-[#242424] text-[27px] font-semibold'>Our Newsletter</h3>

              <p className="pt-3 text-center text-[#5a5a5a] text-[15px]">
                Get E-mail updates about our latest shop and special offers
              </p>

              <form
                onSubmit={newsletterHandler}
                className="flex flex-col justify-center items-stretch gap-3 px-5 py-10 sm:flex-row sm:items-center sm:gap-0"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address..."
                  className="w-full max-w-[500px] h-[48px] border border-[#dcdcdc] px-5 outline-none rounded-sm sm:rounded-l-sm"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-[300px] h-[48px] bg-[#c89a74] text-white text-[18px] font-semibold hover:bg-black rounded-sm sm:rounded-r-sm"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
