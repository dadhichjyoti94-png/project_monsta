'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAdminApiUrl, getWebsiteApiBaseUrl } from '../../utils/api'
// import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import { FaAnglesUp } from 'react-icons/fa6'

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://instagram.com', label: 'Instagram', icon: FaInstagram },
  { href: 'https://twitter.com', label: 'Twitter', icon: FaTwitter },
  { href: 'https://youtube.com', label: 'YouTube', icon: FaYoutube },
  { href: 'https://telegram.org', label: 'Telegram', icon: FaTelegramPlane },
]

const informationLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/contactUs', label: 'Contact Us' },
  { href: '/faq', label: 'Frequently Questions' },
]

const accountLinks = [
  { href: '/my-dashbord', label: 'My Dashboard' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
]

const fallbackTopProducts = [
  {
    id: 'fallback-prayer-unit',
    image: '/image/img21.jpg',
    category: 'Prayer Units',
    title: 'Hardwell Temple Prayer Unit',
    oldPrice: '10,000',
    newPrice: '9,400',
  },
  {
    id: 'fallback-sofa-set',
    image: '/image/img19.jpg',
    category: '1 Seater Sofa',
    title: 'Yuvi sheesham wood sofa set',
    oldPrice: '10,000',
    newPrice: '7,600',
  },
  {
    id: 'fallback-study-table',
    image: '/image/studytable.jpg',
    category: 'Study Tables',
    title: 'Designer Study Table',
    oldPrice: '12,000',
    newPrice: '9,800',
  },
  {
    id: 'fallback-coffee-table',
    image: '/image/Coffee Table.jpg',
    category: 'Coffee Tables',
    title: 'Modern Coffee Table',
    oldPrice: '8,500',
    newPrice: '6,900',
  },
  {
    id: 'fallback-bookshelf',
    image: '/image/Bookshelfs_brown.jpg',
    category: 'Bookshelves',
    title: 'Brown Wooden Bookshelf',
    oldPrice: '11,500',
    newPrice: '8,700',
  },
  {
    id: 'fallback-shoe-rack',
    image: '/image/ShoeRacks.jpg',
    category: 'Shoe Racks',
    title: 'Compact Wooden Shoe Rack',
    oldPrice: '7,500',
    newPrice: '5,900',
  },
]

const getImageUrl = (imagePath, image) => {
  if (!image || typeof image !== 'string') {
    return '/image/logo.png'
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('/')
  ) {
    return image
  }

  return imagePath ? `${imagePath}/${image}` : `/${image}`
}

const makeNumber = (value) => {
  return Number(String(value || 0).replace(/,/g, ''))
}

const mapProduct = (product, imagePath = '') => ({
  id: product._id || product.id || product.slug || product.name,
  image: getImageUrl(imagePath, product.image),
  category: product.sub_sub_category_id?.name || product.sub_category_id?.name || product.parent_category_id?.name || product.category || '',
  title: product.name || product.title || 'Product',
  oldPrice: makeNumber(product.actual_price || product.mrp || product.oldPrice || 0).toLocaleString(),
  newPrice: makeNumber(product.sale_price || product.price || product.newPrice || 0).toLocaleString(),
})

const getPathSeed = (pathname = '') => {
  return pathname.split('').reduce((total, char, index) => {
    return total + char.charCodeAt(0) * (index + 1)
  }, 0)
}

const getFooterProductsByPath = (products, pathname) => {
  if (products.length <= 2) {
    return products
  }

  const startIndex = getPathSeed(pathname || '/') % products.length

  return [
    products[startIndex],
    products[(startIndex + 1) % products.length],
  ]
}

export default function Footer() {
  const pathname = usePathname()
  const [topProducts, setTopProducts] = useState(fallbackTopProducts)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const fetchFooterProducts = async () => {
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
            .filter((product) => product.image)
            .map((product) => mapProduct(product, data._image_path || ''))

          if (products.length > 0) {
            setTopProducts(products)
          }
        }
      } catch (error) {
        console.log('FOOTER PRODUCT ERROR =', error)
      }
    }

    fetchFooterProducts()
  }, [])

  useEffect(() => {
    fetch(`${getWebsiteApiBaseUrl()}/company`)
      .then((response) => response.json())
      .then((data) => {
        if (data?._status) setCompany(data._data)
      })
      .catch(() => {})
  }, [])

  const footerProducts = useMemo(() => {
    return getFooterProductsByPath(topProducts, pathname)
  }, [pathname, topProducts])

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1675px] px-5 pt-[95px] pb-5">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.65fr_0.65fr_1.25fr] lg:gap-14">
          <div>
            <h5 className="mb-8 font-serif text-[18px] font-bold text-[#1f1f1f]">              Contact Us
            </h5>

            <ul className="space-y-3 text-[15px] leading-6 text-[#4d5560]">
              <li>Address: {company?.address || 'Claritas est etiam processus dynamicus'}</li>
              <li>
                <a href={`tel:${company?.mobile_number || '98745612330'}`} className="transition hover:text-[#c98b6b]">
                  Phone: {company?.mobile_number || '98745612330'}
                </a>
              </li>
              <li>
                <a href={`mailto:${company?.email || 'furniture@gmail.com'}`} className="transition hover:text-[#c98b6b]">
                  Email: {company?.email || 'furniture@gmail.com'}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-nowrap gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border border-gray-200 text-[18px] text-gray-400 transition hover:border-[#c98b6b] hover:bg-[#c98b6b] hover:text-white">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-8 font-serif text-[18px] font-bold text-[#1f1f1f]">              Information
            </h5>

            <ul className="space-y-4 text-[15px] leading-6 text-[#4d5560]">
              {informationLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-[#c98b6b]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-10 font-serif text-[20px] font-bold leading-none text-[#1f1f1f]">
              My Account
            </h5>

            <ul className="space-y-5 text-[16px] leading-5 text-[#4d5560]">
              {accountLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-[#c98b6b]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-8 font-serif text-[18px] font-bold text-[#1f1f1f]">
              Top Rated Products
            </h5>

            <div>
              {footerProducts.map((product, index) => (
                <div
                  key={`${product.id}-${pathname}-${index}`}
                  className={`flex gap-4 ${index === 0
                      ? "border-b border-gray-200 pb-4"
                      : "pt-5"
                    }`}
                >
                  <Link href={`/product-details/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-[60px] w-[90px] shrink-0 object-cover cursor-pointer"
                      onError={(event) => {
                        event.currentTarget.src = '/image/logo.png'
                      }}
                    />
                  </Link>

                  <div className="min-w-0">
                    <p className="mb-2 text-[14px] text-[#4d5560]">
                      {product.category}
                    </p>

                    <Link href={`/product-details/${product.id}`}>
                      <p className="mb-3 font-serif text-[18px] text-[#22315a] hover:text-orange-500 cursor-pointer">
                        {product.title}
                      </p>
                    </Link>

                    <div className="flex gap-3 text-[15px]">
                      <span className="text-[#4d5560] line-through">
                        Rs. {product.oldPrice}
                      </span>
                      <span className="font-bold text-[#c98b6b]">
                        Rs. {product.newPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-5">
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-[17px] text-[#4d5560]">
            <Link href="/" className="transition hover:text-[#c98b6b]">
              Home
            </Link>

            <Link href="/shop" className="transition hover:text-[#c98b6b]">
              Online Store
            </Link>

            <Link href="/privacy-policy" className="transition hover:text-[#c98b6b]">
              Privacy Policy
            </Link>

            <Link href="/terms-of-use" className="transition hover:text-[#c98b6b]">
              Terms Of Use
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 py-8 text-center">
          <p className="mb-2 font-semibold text-[#1f1f1f]">
            {company?.company_name || 'Furniture'}
          </p>
          <p className="text-[16px] text-[#4d5560]">
            All Rights Reserved By Furniture | © 2026
          </p>

          <img
            src="/image/footer2.png"
            alt="Payment Methods"
            className="mx-auto mt-4 h-8 object-contain"
          />
        </div>
      </div>

      <a
        href="#"
        aria-label="Back to top"
        className="fixed bottom-8 right-5 z-40 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#1f1f1f] text-[22px] text-white shadow-md transition hover:bg-[#c98b6b]"
      >
        <FaAnglesUp />
      </a>
    </footer>
  )
}
