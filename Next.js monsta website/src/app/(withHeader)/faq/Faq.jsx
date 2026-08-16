'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaGreaterThan } from 'react-icons/fa6'
import { getAdminApiUrl } from '../utils/api'

const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'How long does delivery take?',
    answer:
      'Delivery usually takes 5 to 9 business days depending on your location and the product availability.',
  },
  {
    id: 'faq-2',
    question: 'Do you provide installation services?',
    answer:
      'Yes, we offer installation support for select furniture items. You can confirm the availability while placing the order.',
  },
  {
    id: 'faq-3',
    question: 'Can I return a product?',
    answer:
      'Returns are accepted for damaged or incorrect items within the return window mentioned in our return policy.',
  },
]

const extractFaqList = (payload) => {
  if (!payload || typeof payload !== 'object') return []

  const candidates = [
    payload._data,
    payload.data,
    payload.result,
    payload.items,
    payload.faqs,
    payload.list,
  ]

  for (const item of candidates) {
    if (Array.isArray(item)) return item
  }

  return []
}

const normalizeFaq = (item, index) => ({
  id: item?._id || item?.id || `faq-${index + 1}`,
  question:
    item?.question ||
    item?.faq_question ||
    item?.title ||
    item?.heading ||
    item?.name ||
    `Question ${index + 1}`,
  answer:
    item?.answer ||
    item?.faq_answer ||
    item?.description ||
    item?.content ||
    item?.details ||
    'No answer available at the moment.',
})

const fetchFaqData = async () => {
  const endpoints = ['faq', 'faqs']

  for (const endpoint of endpoints) {
    try {
      const response = await axios.post(getAdminApiUrl(`${endpoint}/view`), {
        status: true,
        limit: 100,
      })

      const faqList = extractFaqList(response.data)

      if (faqList.length > 0) {
        return faqList.map(normalizeFaq)
      }
    } catch (error) {
      console.log(`${endpoint.toUpperCase()} FAQ API ERROR =`, error)
    }
  }

  return fallbackFaqs
}

export default function Faq() {
  const [faqList, setFaqList] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadFaq = async () => {
      try {
        const data = await fetchFaqData()

        if (isMounted) {
          setFaqList(data)
        }
      } catch (error) {
        console.log('FAQ LOAD ERROR =', error)

        if (isMounted) {
          setFaqList(fallbackFaqs)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadFaq()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <div className='text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8'>
        <p className='text-4xl font-medium text-[#242424]'>Frequently Questions</p>
        <div className='flex justify-center items-center gap-2 pt-3'>
          <p className='hover:text-[#c09578]'>Home</p>
          <FaGreaterThan size={10} className='mt-1' />
          <p className='text-[#c09578]'>Frequently Questions</p>
        </div>
      </div>

      <div className='mx-auto mt-10 w-[84%] max-w-5xl pb-14'>
        {loading ? (
          <div className='text-center text-gray-500'>Loading FAQs...</div>
        ) : (
          <div className='space-y-4'>
            {faqList.map((item, index) => {
              const isOpen = activeIndex === index

              return (
                <div
                  key={item.id}
                  className='overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm'
                >
                  <button
                    type='button'
                    onClick={() => setActiveIndex(isOpen ? -1 : index)}
                    className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-medium text-[#242424] transition hover:text-[#c09578]'
                  >
                    <span>{item.question}</span>
                    <span className='text-xl text-[#c09578]'>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className='border-t border-gray-200 bg-gray-50 px-5 py-4 text-base leading-7 text-gray-700'>
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
