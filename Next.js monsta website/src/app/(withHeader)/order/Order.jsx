"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaGreaterThan } from "react-icons/fa6";
import { getUserAuthHeaders, getWebsiteApiBaseUrl } from "../utils/api";
import UserLogoutButton from "../componets/common/UserLogoutButton";

const orderStatuses = { 1: "Placed", 2: "Received", 3: "Shipped", 4: "Out for Delivery", 5: "Completed", 6: "Cancelled", 7: "Failed" };

const formatDate = (date) => date ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date)) : "—";
const formatAmount = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(amount || 0));
const getProductImage = (image) => {
  const value = typeof image === "string" ? image : image?.src || image?.url || image?.path;
  if (!value) return "/image/logo.png";
  if (/^(https?:|data:|\/)/.test(value)) return value;
  return `/${value.replace(/^\.\//, "")}`;
};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get("user_login");
      if (!token) {
        setError("Please login to see your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getWebsiteApiBaseUrl()}/checkout/my-order`, { method: "POST", headers: getUserAuthHeaders(token) });
        const result = await response.json();
        if (!response.ok || !result._status) throw new Error(result._message || "Your orders could not be loaded.");
        setOrders(Array.isArray(result._data) ? result._data : []);
      } catch (requestError) {
        setError(requestError.message || "Your orders could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="text-center mt-10 border-b border-gray-300 w-[84%] mx-auto pb-8">
        <p className="text-4xl font-medium text-[#242424]">My Dashboard</p>
        <div className="flex justify-center items-center gap-2 pt-3"><p className="hover:text-[#c09578]">Home</p><FaGreaterThan size={10} className="mt-1" /><p className="text-[#c09578]">My Dashboard</p></div>
      </div>

      <div className="flex flex-col gap-6 py-8 w-[84%] mx-auto md:flex-row">
        <div className="w-full md:w-[260px] shrink-0">
          <Link href="/my-dashbord"><div className="bg-black hover:bg-[#c89b7d] text-white font-semibold px-4 py-3 rounded mb-2">My Dashboard</div></Link>
          <Link href="/order"><div className="bg-[#c89b7d] text-white font-semibold px-4 py-3 rounded mb-2">Orders</div></Link>
          <Link href="/address"><div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">Addresses</div></Link>
          <Link href="/my-profile"><div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">My Profile</div></Link>
          <Link href="/change-password"><div className="bg-[#222] text-white font-semibold px-4 py-3 rounded mb-2 hover:bg-[#c89b7d]">Change Password</div></Link>
          <UserLogoutButton className="w-full bg-[#222] text-left text-white font-semibold px-4 py-3 rounded hover:bg-[#c89b7d]" />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-[#242424]">Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border border-gray-300 border-collapse">
              <thead><tr className="bg-gray-50"><th className="p-4 text-center font-semibold">Order</th><th className="p-4 text-center font-semibold">Date</th><th className="p-4 text-center font-semibold">Status</th><th className="p-4 text-center font-semibold">Total</th><th className="p-4 text-center font-semibold">Action</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan="5" className="p-8 text-center border border-gray-300 text-gray-500">Loading your orders…</td></tr>}
                {!loading && error && <tr><td colSpan="5" className="p-8 text-center border border-gray-300 text-red-600">{error}</td></tr>}
                {!loading && !error && orders.length === 0 && <tr><td colSpan="5" className="p-8 text-center border border-gray-300 text-gray-500">You have not placed any orders yet.</td></tr>}
                {!loading && !error && orders.map((order) => {
                  const products = Array.isArray(order.product_info) ? order.product_info : [];
                  const orderId = order._id || order.order_id || order.order_number;
                  const isOpen = openOrderId === orderId;
                  const itemCount = products.reduce((total, product) => total + Number(product.quantity || 1), 0);
                  return <Fragment key={orderId}>
                    <tr><td className="p-4 text-center border border-gray-300 font-medium">{order.order_number || order.order_id || "—"}</td><td className="p-4 text-center border border-gray-300">{formatDate(order.created_at)}</td><td className="p-4 text-center border border-gray-300">{orderStatuses[Number(order.order_status)] || "Processing"}</td><td className="p-4 text-center border border-gray-300">{formatAmount(order.net_amount ?? order.total_amount)} for {itemCount} {itemCount === 1 ? "item" : "items"}</td><td className="p-4 text-center border border-gray-300"><button type="button" onClick={() => setOpenOrderId(isOpen ? null : orderId)} className="text-[#c09578] font-semibold hover:underline">{isOpen ? "Hide" : "View"}</button></td></tr>
                    {isOpen && <tr><td colSpan="5" className="border border-gray-300 bg-gray-50 p-4"><p className="mb-3 font-semibold text-[#242424]">Order items</p>{products.length ? <ul className="space-y-3">{products.map((product, index) => <li key={`${product.id || product.title || "product"}-${index}`} className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3 text-sm last:border-0 last:pb-0"><div className="flex min-w-0 items-center gap-3"><img src={getProductImage(product.image)} alt={product.title || product.name || "Ordered product"} className="h-16 w-16 shrink-0 rounded object-cover bg-white" onError={(event) => { event.currentTarget.src = "/image/logo.png"; }} /><span className="truncate">{product.title || product.name || "Product"} × {product.quantity || 1}</span></div><span className="shrink-0 font-medium">{formatAmount(product.newPrice ?? product.price)}</span></li>)}</ul> : <p className="text-sm text-gray-500">Product information is unavailable for this order.</p>}</td></tr>}
                  </Fragment>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-300 p-5" />
    </div>
  );
}
