'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa'
import axios from "axios";
import Cookies from "js-cookie";

export default function ThankYou() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  const getPaymentStatus = (status) => {
    const statuses = {
      1: 'Payment Pending',
      2: 'Payment Successful',
      3: 'Payment Failed',
    }

    return statuses[Number(status)] || 'Payment Pending'
  }

  const getOrderStatus = (status) => {
    const statuses = {
      1: 'Placed',
      2: 'Received',
      3: 'Shipped',
      4: 'Out for Delivery',
      5: 'Completed',
      6: 'Cancelled',
      7: 'Failed',
    }

    return statuses[Number(status)] || 'Processing'
  }

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout/order-details`,
      {
        order_id: orderId,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("user_login")}`,
        },
      }
    )
      .then((result) => {
        if (result.data._status) {
          setOrderData(result.data._data);
        } else {
          console.log(result.data._message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [orderId]);


  return (
    <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">

        <div className="flex justify-center mb-5">
          <FaCheckCircle className="text-green-600 text-7xl" />
        </div>

        <h1 className="text-4xl font-bold text-[#242424] mb-3">
          Thank You!
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Your order has been placed successfully.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading order details...</p>
        ) : (
          <div className="bg-[#f8f5f2] rounded-xl p-5 text-left mb-7">
            <h2 className="text-xl font-semibold text-[#242424] mb-4">
              Order Details
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Order ID:</span>{' '}
                {orderData?.order_id || orderId || 'N/A'}
              </p>

              <p>
                <span className="font-semibold">Order Number:</span>{' '}
                {orderData?.order_number || 'N/A'}
              </p>

              <p>
                <span className="font-semibold">Payment Status:</span>{' '}
                <span className="text-green-600 font-semibold">
                  {getPaymentStatus(orderData?.payment_status)}
                </span>
              </p>

              <p>
                <span className="font-semibold">Order Status:</span>{' '}
                {getOrderStatus(orderData?.order_status)}
              </p>

              <p>
                <span className="font-semibold">Total Amount:</span>{' '}
                ₹{orderData?.net_amount || orderData?.total_amount || '0'}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#c09578] text-white px-6 py-3 rounded-lg hover:bg-[#a47b61] transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/myOrder"
            className="border border-[#c09578] text-[#c09578] px-6 py-3 rounded-lg hover:bg-[#c09578] hover:text-white transition"
          >
            View My Orders
          </Link>
        </div>

      </div>
    </div>
  )
}
