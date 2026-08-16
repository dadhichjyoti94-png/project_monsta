'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import Link from 'next/link'

export default function ProductCart({
  id,
  image,
  category,
  title,
  oldPrice,
  newPrice,
  old_price,
  new_price,
  price,
  mrp,
  color,
  colorName,
  material,
  materialName,
}) {

  const [isWishlist, setIsWishlist] = useState(false)

  
  // PRICE NUMBER
  
  const makeNumber = (value) => {
    return Number(String(value || 0).replace(/,/g, ''))
  }

  
  // IMAGE
  
  const normalizeImagePath = (value) => {

    if (!value || typeof value !== 'string') {
      return '/image/logo.png'
    }

    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:') ||
      value.startsWith('/')
    ) {
      return value
    }

    return `/${value
      .replace(/^\.\//, '')
      .replace(/^\//, '')}`
  }

  const resolveImage = (value) => {

    const imageValue =
      typeof value === 'string'
        ? value
        : value?.src || value?.url || value?.path

    return normalizeImagePath(imageValue)
  }

  const productImage = resolveImage(image)

  
  // FINAL PRICE
  
  const finalOldPrice = makeNumber(
    oldPrice || old_price || mrp
  )

  const finalNewPrice = makeNumber(
    newPrice || new_price || price
  )

  
  // PRODUCT ID
  
  const productId = id || title
  const finalColor = color || colorName || ''
  const finalMaterial = material || materialName || ''

  
  // CHECK WISHLIST

  useEffect(() => {

    const wishlist =
      JSON.parse(localStorage.getItem('wishlist')) || []

    const exist = wishlist.find(
      (item) => item.id === productId
    )

    if (exist) {
      setIsWishlist(true)
    }

  }, [productId])


  
  // WISHLIST
  
  const addToWishlist = () => {

    const product = {
      id: productId,
      image: productImage,
      category: category || '',
      title: title || '',
      oldPrice: finalOldPrice,
      newPrice: finalNewPrice,
      color: finalColor,
      material: finalMaterial,
    }

    const wishlist =
      JSON.parse(localStorage.getItem('wishlist')) || []

    const exist = wishlist.find(
      (item) => item.id === product.id
    )

    // REMOVE FROM WISHLIST
    if (exist) {

      const newWishlist = wishlist.filter(
        (item) => item.id !== product.id
      )

      localStorage.setItem(
        'wishlist',
        JSON.stringify(newWishlist)
      )

      setIsWishlist(false)

      toast.error('Removed from Wishlist')

    }

    // ADD TO WISHLIST
    else {

      const newWishlist = [
        ...wishlist,
        product
      ]

      localStorage.setItem(
        'wishlist',
        JSON.stringify(newWishlist)
      )

      setIsWishlist(true)

      toast.success('Added to Wishlist')
    }
  }


  
  // ADD TO CART
  
  const addToCart = () => {

    const product = {
      id: productId,
      image: productImage,
      category: category || '',
      title: title || '',
      oldPrice: finalOldPrice,
      newPrice: finalNewPrice,
      color: finalColor,
      material: finalMaterial,
      quantity: 1,
    }

    const oldCart =
      JSON.parse(localStorage.getItem('cart')) || []

    const exist = oldCart.find(
      (item) => item.id === product.id
    )

    let newCart

    // ALREADY EXISTS
    if (exist) {

      newCart = oldCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )

    }

    // NEW PRODUCT
    else {

      newCart = [
        ...oldCart,
        product
      ]

    }

    localStorage.setItem(
      'cart',
      JSON.stringify(newCart)
    )

    toast.success('Product added to cart')
  }


  
  // UI
  
  return (

    <div className="bg-white shadow-[0_0_14px_rgba(0,0,0,0.14)]">

      {/* PRODUCT IMAGE */}

      <img
        src={productImage}
        alt={title || 'Product'}
        className="w-full h-[210px] object-cover bg-white"
        onError={(e) => {

          if (
            !e.currentTarget.src.endsWith('/image/logo.png')
          ) {
            e.currentTarget.src = '/image/logo.png'
          }

        }}
      />


      {/* PRODUCT DETAILS */}

      <div className="text-center px-4 py-4">

        {/* CATEGORY */}

        <p className="mb-4 text-[15px] text-gray-700">
          {category}
        </p>

        {/* PRODUCT NAME */}

        <Link href={`/product-details/${productId}`}>

          <h3 className="mb-4 min-h-[28px] text-[18px] font-serif font-bold leading-snug cursor-pointer hover:text-[#c98b6b]">
            {title}
          </h3>

        </Link>


        <div className="mb-4 border-b border-gray-200"></div>


        {/* PRICE */}

        <div className="mb-4">

          <span className="mr-2 text-[16px] text-gray-700 line-through">
            Rs. {finalOldPrice.toLocaleString()}
          </span>

          <span className="text-[18px] font-bold text-[#c98b6b]">
            Rs. {finalNewPrice.toLocaleString()}
          </span>

        </div>


        {/* BUTTONS */}

        <div className="flex justify-center gap-1">

          {/* WISHLIST */}

          <button
            type="button"
            onClick={addToWishlist}
            className="flex h-[44px] w-[44px] items-center justify-center bg-gray-100 hover:bg-[#c98b6b] hover:text-white transition"
          >

            {isWishlist ? (
              <FaHeart className="text-xl text-red-500" />
            ) : (
              <FaRegHeart className="text-xl" />
            )}

          </button>


          {/* CART */}

          <button
            type="button"
            onClick={addToCart}
            className="h-[44px] bg-gray-100 px-6 text-[15px] hover:bg-[#c98b6b] hover:text-white transition"
          >
            Add To Cart
          </button>

        </div>

      </div>

    </div>
  )
}
