'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaGreaterThan } from "react-icons/fa6"
import { FaTrashAlt } from "react-icons/fa"

export default function Cart() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const oldCart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(oldCart)
  }, [])

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQuantity = (id, value) => {
    const qty = Number(value)
    if (qty < 1) return

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    )

    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.newPrice || item.price || 0) * Number(item.quantity || 1)
  }, 0)

  return (
    <div className="w-[84%] mx-auto py-10">
      <div className='text-center border-b border-gray-300 pb-8'>
        <p className='text-4xl font-medium text-[#242424]'>
          Shopping Cart
        </p>

        <div className='flex justify-center items-center gap-2 pt-3'>
          <Link href='/' className='hover:text-[#c09578]'>
            Home
          </Link>
          <FaGreaterThan size={10} className='mt-1' />
          <p className='text-[#c09578]'>Shopping Cart</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className='border-b border-gray-300'>
          <div className='pt-7'>
            <img src='/image/cartimage.jpg' className='mx-auto' alt="empty-cart" />
          </div>

          <p className='text-center pt-5 pb-8'>
            Your Shopping cart is empty !
          </p>
        </div>
      ) : (
        <>
          <div className='overflow-x-auto mt-10'>
            <table className='w-full border border-gray-200'>
              <thead>
                <tr className='bg-[#f7f7f7] border-b-2 border-[#c09578]'>
                  <th className='p-5 text-left'>Delete</th>
                  <th className='p-5 text-left'>Image</th>
                  <th className='p-5 text-left'>Product</th>
                  <th className='p-5 text-left'>Price</th>
                  <th className='p-5 text-left'>Quantity</th>
                  <th className='p-5 text-left'>Total</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => {
                  const price = Number(item.newPrice || item.price || 0)
                  const quantity = Number(item.quantity || 1)

                  return (
                    <tr key={item.id} className='border-b'>
                      <td className='p-5 border'>
                        <button
                          onClick={() => removeItem(item.id)}
                          className='text-[#c09578] text-[18px]'
                        >
                          <FaTrashAlt />
                        </button>
                      </td>

                      <td className='p-5 border'>
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className='w-[160px] h-[110px] object-cover'
                        />
                      </td>

                      <td className='p-5 border'>
                        <div>
                          <p>{item.title || item.name}</p>
                          {item.color && (
                            <p className='text-sm text-gray-500 mt-2'>Color: {item.color}</p>
                          )}
                          {item.material && (
                            <p className='text-sm text-gray-500 mt-2'>Material: {item.material}</p>
                          )}
                        </div>
                      </td>

                      <td className='p-5 border font-bold'>
                        Rs. {price.toLocaleString()}
                      </td>

                      <td className='p-5 border'>
                        <div className='flex items-center gap-3'>
                          <span className='font-semibold'>Quantity</span>

                          <input
                            type='number'
                            min='1'
                            value={quantity}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            className='w-[70px] border px-3 py-2 outline-none'
                          />
                        </div>
                      </td>

                      <td className='p-5 border font-bold'>
                        Rs. {(price * quantity).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className='flex justify-end mt-5'>
            <button className='bg-[#1f1f1f] text-white px-7 py-3 font-bold'>
              UPDATE CART
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 mb-10'>
            <div className='border border-gray-200'>
              <h3 className='bg-[#1f1f1f] text-white p-5 text-[24px] font-serif'>
                COUPON
              </h3>

              <div className='p-6'>
                <p className='mb-5 text-gray-600'>
                  Enter your coupon code if you have one.
                </p>

                <div className='flex flex-wrap gap-4'>
                  <input
                    type='text'
                    placeholder='Coupon code'
                    className='border border-gray-300 px-4 py-3 outline-none'
                  />

                  <button className='bg-[#1f1f1f] text-white px-6 py-3 font-bold'>
                    APPLY COUPON
                  </button>
                </div>
              </div>
            </div>

            <div className='border border-gray-200'>
              <h3 className='bg-[#1f1f1f] text-white p-5 text-[24px] font-serif'>
                CART TOTALS
              </h3>

              <div className='p-6'>
                <div className='flex justify-between mb-6 font-bold text-[18px]'>
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className='flex justify-between mb-6 font-bold text-[18px]'>
                  <span>Discount (-)</span>
                  <span>Rs. 0</span>
                </div>

                <div className='flex justify-between mb-8 font-bold text-[18px]'>
                  <span>Total</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className='text-right'>
                  <button className='bg-[#c09578] text-white px-6 py-4 font-bold'>
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
