'use client'

import axios from 'axios'
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useRazorpay } from "react-razorpay";
import { getUserAuthHeaders, getWebsiteApiBaseUrl } from '../utils/api';



export default function Checkout() {
  const { Razorpay } = useRazorpay();
  const router = useRouter();
  const profileFetched = useRef(false)

  const [cartItems, setCartItems] = useState([])
  const [showShipping, setShowShipping] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!Cookies.get('user_login')) {
      router.replace('/login-register')
      return
    }

    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    const oldCart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(oldCart)
  }, [])

  useEffect(() => {
    const totalAmount = cartItems.reduce((total, item) => {
      return total + Number(item.newPrice || item.price || 0) * Number(item.quantity || 1)
    }, 0)

    setSubtotal(totalAmount)
  }, [cartItems])

  const [orderLoading, setOrderLoadind] = useState(false)


  const [userProfile, setUserProfile] = useState({})
  const [customerName, setCustomerName] = useState('')
  const [customerMobile, setCustomerMobile] = useState('')

  useEffect(() => {
    if (profileFetched.current) return
    profileFetched.current = true

    const token = Cookies.get('user_login')

    if (!token) {
      setUserProfile({})
      return
    }

    axios.post(`${getWebsiteApiBaseUrl()}/user/view-profile`, {}, {
      headers: getUserAuthHeaders(token)
    })
      .then((result) => {
        if (result.data._status) {
          const profile = result.data._data || {}
          setUserProfile(profile);
          setCustomerName(profile.name || '')
          setCustomerMobile(profile.mobile_number || '')
        } else {
          setUserProfile({});
        }
      }).catch((err) => {
        console.error('Profile load failed:', err.response?.data || err.message)
      })
  }, [])

  //place Order
  const placeOrder = (event) => {
    event.preventDefault()
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    if (!razorpayKey) {
      toast.error('Payment service is not configured. Please try again later.')
      return
    }

    console.log("Cart Items:", cartItems);

    console.log("Request Body:", {
      total_amount: subtotal,
      net_amount: subtotal,
      product_info: cartItems,
    });
    console.log("Place Order Clicked");
    setOrderLoadind(true)

    const token = Cookies.get('user_login')

    if (!token) {
      setOrderLoadind(false)
      toast.error('Please login before checkout')
      router.push('/login-register')
      return
    }

    var billing_address = {
      name: event.target.billing_name.value,
      mobile_number: event.target.billing_mobile_number.value,
      email: event.target.billing_email.value,
      address: event.target.billing_address.value,
      country: event.target.billing_country.value,
      city: event.target.billing_city.value,
      state: event.target.billing_state.value,
    }

    if (showShipping) {
      var shipping_address = {
        name: event.target.shipping_name.value,
        mobile_number: event.target.shipping_mobile_number.value,
        email: event.target.shipping_email.value,
        address: event.target.shipping_address.value,
        country: event.target.shipping_country.value,
        city: event.target.shipping_city.value,
        state: event.target.shipping_state.value,
      }


    } else {
      var shipping_address = billing_address
    }


    axios.post(
      `${getWebsiteApiBaseUrl()}/checkout/place-order`,
      {
        name: event.target.name.value,
        mobile_number: event.target.mobile_number.value,

        total_amount: subtotal,
        discount_amount: 0,
        net_amount: subtotal,
        shipping_address: shipping_address,
        order_note: event.target.order_notes.value,
        billing_address: billing_address,
        product_info: cartItems
      },
      {
        headers: getUserAuthHeaders(token)
      }
    )
      .then((result) => {
        setOrderLoadind(false);

        if (result.data._status) {
          handlePayment(result.data._data)
          toast.success(result.data._message);
          // localStorage.removeItem('cart') // Razorpay complete hone ke baad karna
        } else {
          if (/authorization token is required|unauthorized|invalid token|token expired/i.test(String(result.data._message || result.data._data))) {
            Cookies.remove('user_login')
            toast.error('Your login session has expired. Please login again.')
            router.push('/login-register')
            return
          }
          toast.error(result.data._message || result.data._data || 'Order place nahi ho saka.');
        }
      })
      .catch((err) => {
        setOrderLoadind(false);

        console.log(err);
        console.log(err.response);
        console.log(err.response?.data);

        const errorMessage = err.response?.data?._message || err.response?.data?._data || ''
        if (/authorization token is required|unauthorized|invalid token|token expired/i.test(String(errorMessage))) {
          Cookies.remove('user_login')
          toast.error('Your login session has expired. Please login again.')
          router.push('/login-register')
          return
        }

        toast.error(
          errorMessage || "Order place nahi ho saka."
        );
      });

    const handlePayment = (orderInfo) => {
      console.log("Order Info:", orderInfo);
      console.log("Mobile:", orderInfo.mobile_number);
      console.log("User Mobile:", userProfile.mobile_number);
      const options = {
        key: razorpayKey,
        amount: orderInfo.net_amount * 100, // Amount in paise
        currency: "INR",
        name: "wscube tech",
        description: "Test Transaction",
        order_id: orderInfo.order_id, // Generate order_id on server
        handler: (response) => {
          console.log(response);
          orderStatusChange(response.razorpay_payment_id, response.razorpay_order_id)
          // toast.success("Payment Successful!");
        },
        prefill: {
          name: userProfile.name,
          email: userProfile.email,
          contact: String(orderInfo.mobile_number),
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setOrderLoadind(false)
        const paymentError = response?.error
        console.error('Razorpay payment failed:', paymentError)
        toast.error(paymentError?.description || paymentError?.reason || 'Payment failed. Please try another payment method.')
      });
      razorpayInstance.open();
    };

    const orderStatusChange = (payment_id, order_id) => {
      axios.post(
        `${getWebsiteApiBaseUrl()}/checkout/order-status`,
        {
          payment_id: payment_id,
          order_id: order_id,
        },
        {
          headers: getUserAuthHeaders(token)
        }
      )
        .then((result) => {
          setOrderLoadind(false);

          if (result.data._status) {
            if (result.data._payment_status) {
              toast.success(result.data._message);
              localStorage.removeItem("cart");

              router.push(`/thank-you?order_id=${order_id}`);
            }


            // localStorage.removeItem('cart') // Razorpay complete hone ke baad karna
          } else {
            toast.error(result.data._message);
          }
        })
        .catch(() => {
          setOrderLoadind(false);

          toast.error("Something went wrong");
        });

    }


  } // <-- placeOrder function yahan close hoga

  const inputClass =
    'w-full border border-gray-500 h-[44px] mt-2 px-3 outline-none bg-[#fafafa] focus:bg-white focus:border-[#c09578]'

  const labelClass = 'font-semibold text-[14px] text-[#242424]'
  const headingClass = 'bg-[#1f1f1f] text-white px-5 py-4 font-bold uppercase tracking-wide'

  if (!isAuthenticated) return null

  return (
    <div className="w-[84%] mx-auto py-10">
      <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Billing */}
            <div>
              <h3 className={headingClass}>BILLING DETAILS</h3>

              <div className="border border-gray-400 p-5 min-h-[520px]">
                <div className="mb-4">
                  <label className={labelClass}>Name*</label>
                  <input
                    name="name"
                    className={inputClass}
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Mobile Number*</label>
                  <input
                    name="mobile_number"
                    className={inputClass}
                    type="text"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Billing Name*</label>
                  <input
                    name="billing_name"
                    className={inputClass}
                    type="text"
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Billing Email*</label>
                  <input
                    name="billing_email"
                    className={inputClass}
                    type="email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Billing Mobile Number*</label>
                  <input
                    name="billing_mobile_number"
                    className={inputClass}
                    type="text"
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Billing Address*</label>
                  <input
                    name="billing_address"
                    className={inputClass}
                    type="text"
                  />
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Country*</label>
                  <input
                    name="billing_country"
                    className={inputClass}
                    type="text"
                  />
                  <select className={inputClass}>
                    <option>Select Country</option>
                    <option>India</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>State*</label>
                    <input
                      name="billing_state"
                      className={inputClass}
                      type="text"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>City*</label>
                    <input
                      name="billing_city"
                      className={inputClass}
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h3 className={headingClass}>SHIPPING DETAILS</h3>

              <div className="border border-gray-400 p-5 min-h-[520px]">
                <label className="flex items-center gap-2 font-semibold cursor-pointer mb-5">
                  <input
                    type="checkbox"
                    checked={showShipping}
                    onChange={(e) => setShowShipping(e.target.checked)}
                  />
                  Ship to different address?
                </label>

                {showShipping ? (
                  <>
                    <div className="mb-4">
                      <label className={labelClass}>Shipping Name*</label>
                      <input
                        name="shipping_name"
                        type="text"
                        className={inputClass}
                        defaultValue={customerName}
                      />
                    </div>

                    <div className="mb-4">
                      <label className={labelClass}>Shipping Mobile Number*</label>
                      <input
                        name="shipping_mobile_number"
                        type="text"
                        className={inputClass}
                        defaultValue={customerMobile}
                      />
                    </div>

                    <div className="mb-4">
                      <label className={labelClass}>Shipping Email*</label>
                      <input
                        name="shipping_email"
                        type="text"
                        className={inputClass}
                      />
                    </div>

                    <div className="mb-4">
                      <label className={labelClass}>Shipping Address*</label>
                      <input
                        name="shipping_address"
                        type="text"
                        className={inputClass}
                      />
                    </div>

                    <div className="mb-4">
                      <label className={labelClass}>Country*</label>
                      <input
                        name="shipping_country"
                        type="text"
                        className={inputClass}
                      />
                      <select className={inputClass}>
                        <option>Select Country</option>
                        <option>India</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>State*</label>
                        <input
                          name="shipping_state"
                          type="text"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>City*</label>
                        <input
                          name="shipping_city"
                          type="text"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-center text-gray-600 border border-dashed border-gray-400 p-5">
                    Checkbox click karne par shipping address yaha open hoga.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Order Notes */}
          <div className="mt-6">
            <h3 className={headingClass}>ORDER NOTES</h3>

            <textarea
              name="order_notes"
              rows="5"
              placeholder="Notes about your order..."
              className="w-full border border-gray-400 p-3 outline-none"
            />
          </div>
        </div>


        {/* Your Order */}
        <table className="w-full border border-gray-500 border-collapse">
          <thead>
            <tr className="bg-[#f2f2f2]">
              <th className="border border-gray-500 p-4 text-left">Product</th>
              <th className="border border-gray-500 p-4 text-center">Qty</th>
              <th className="border border-gray-500 p-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border border-gray-500 p-4">
                  {item.title || item.name}
                </td>

                <td className="border border-gray-500 p-4 text-center">
                  {item.quantity}
                </td>

                <td className="border border-gray-500 p-4 text-right">
                  Rs. {(item.newPrice || item.price) * item.quantity}
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={2} className="border border-gray-500 p-4 font-semibold">
                Discount (-)
              </td>

              <td className="border border-gray-500 p-4 text-right">
                Rs. 0
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="border border-gray-500 p-4 font-bold">
                Order Total
              </td>

              <td className="border border-gray-500 p-4 font-bold text-right">
                Rs. {subtotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="bg-[#c09578] text-white px-8 py-3 mt-5 font-bold disabled:opacity-60" disabled={orderLoading}
        >
          {orderLoading ? 'Loading...' : 'Place Order'}
        </button>
      </form>
    </div>
  )





  //     "_status": true,
  //     "_message": "Order placed successfully",
  //     "_data": {
  //         "user_id": "6a30ec680e6eca0726a96358",
  //         "name": "dadhich",
  //         "mobile_number": 1234567890,
  //         "order_number": "MONSTA_00206",
  //         "order_id": "order_T6vKz00jVZ7KfC",
  //         "payment_id": "",
  //         "order_note": "asdfgh",
  //         "billing_address": {
  //             "name": "sdfgh",
  //             "mobile_number": "1234567890",
  //             "email": "jyotidadhich491@gmail.com",
  //             "address": "paota",
  //             "country": "India",
  //             "city": "Jodhpur",
  //             "state": "Rajasthan"
  //         },
  //         "shipping_address": {
  //             "name": "sdfgh",
  //             "mobile_number": "1234567890",
  //             "email": "jyotidadhich491@gmail.com",
  //             "address": "paota",
  //             "country": "India",
  //             "city": "Jodhpur",
  //             "state": "Rajasthan"
  //         },
  //         "product_info": [
  //             {
  //                 "id": "Wooden Jhula",
  //                 "image": "image/Swing Jhula__.jpg",
  //                 "category": "Calina Swing Jhula",
  //                 "title": "Wooden Jhula",
  //                 "oldPrice": 65000,
  //                 "newPrice": 58000,
  //                 "quantity": 1
  //             },
  //             {
  //                 "id": "Coffee Tables",
  //                 "image": "image/Coffee Table.jpg",
  //                 "category": "Evaan Coffee Tables",
  //                 "title": "Coffee Tables",
  //                 "oldPrice": 2600,
  //                 "newPrice": 2300,
  //                 "quantity": 4
  //             },
  //             {
  //                 "id": "Shoe Racks",
  //                 "image": "image/ShoeRacks.jpg",
  //                 "category": "Gloria Shoe Racks",
  //                 "title": "Shoe Racks",
  //                 "oldPrice": 3400,
  //                 "newPrice": 2900,
  //                 "quantity": 1
  //             }
  //         ],
  //         "total_amount": 70100,
  //         "discount_amount": 0,
  //         "net_amount": 70100,
  //         "payment_status": 1,
  //         "order_status": 1,
  //         "created_at": "2026-06-28T04:04:52.721Z",
  //         "updated_at": "2026-06-28T04:04:52.721Z",
  //         "deleted_at": null,
  //         "_id": "6a40a5cc4e7885c655ef1bd6",
  //         "__v": 0
  //     }
  // }
}
