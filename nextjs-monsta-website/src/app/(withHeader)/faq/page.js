import React from 'react'
import Faq from './Faq'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Frequently Questions',
  description: 'FAQ list from admin data',
}

export default function page() {
  return (
    <div>
      <Faq />
    </div>
  )
}
