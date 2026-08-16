import React from 'react'

export default function PrivacyPolicy() {
  return (
    <LegalContent title='Privacy Policy' />
  )
}

export function LegalContent({ title }) {
  return (
    <>
      <section className='w-[83%] mx-auto py-10 pb-16 text-[#242424]'>
      <header className='border-b border-gray-300 pb-8 text-center'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        <p className='mt-3 text-sm text-gray-600'>Home <span className='mx-2 text-[#c89a74]'>&gt;</span> {title}</p>
      </header>

      <article className='max-w-5xl pt-12 space-y-7 leading-7 text-gray-700'>
        <div>
          <h2 className='text-2xl font-semibold text-[#242424] mb-2'>Who we are</h2>
          <p>Monsta Furniture is an online furniture store. This policy explains how we handle the information shared while you browse, contact us, or place an order on our website.</p>
        </div>
        <div>
          <h2 className='text-2xl font-semibold text-[#242424] mb-2'>Information we collect</h2>
          <p>We may collect your name, phone number, email address, delivery address, and order details when you create an account, contact us, or make a purchase.</p>
        </div>
        <div>
          <h2 className='text-2xl font-semibold text-[#242424] mb-2'>How we use your information</h2>
          <p>Your information is used to process orders, deliver products, respond to enquiries, improve our services, and share order-related updates. We do not sell your personal information to third parties.</p>
        </div>
        <div>
          <h2 className='text-2xl font-semibold text-[#242424] mb-2'>Cookies and security</h2>
          <p>Cookies may be used to remember your preferences and make the website work smoothly. We take reasonable steps to protect your information, though no online service can guarantee complete security.</p>
        </div>
        <div>
          <h2 className='text-2xl font-semibold text-[#242424] mb-2'>Contact us</h2>
          <p>If you have any questions about this policy, please contact us at furniture@gmail.com or 98745612330.</p>
        </div>
      </article>
      </section>

      <div className='w-full border-b border-gray-300' />
    </>
  )
}

