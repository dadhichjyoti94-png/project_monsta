"use client";

import { FaBoxOpen, FaCalendarAlt, FaCheckCircle, FaClipboardList, FaCreditCard, FaExclamationCircle, FaHourglassHalf, FaMapMarkerAlt, FaTruck } from "react-icons/fa";

const paymentStatusDetails = {
    1: { label: "Payment Pending", className: "bg-amber-50 text-amber-700 ring-amber-200", icon: FaHourglassHalf },
    2: { label: "Payment Successful", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: FaCheckCircle },
    3: { label: "Payment Failed", className: "bg-rose-50 text-rose-700 ring-rose-200", icon: FaExclamationCircle },
};

const orderStatusDetails = {
    1: { label: "Placed", className: "bg-blue-50 text-blue-700 ring-blue-200", icon: FaClipboardList },
    2: { label: "Received", className: "bg-violet-50 text-violet-700 ring-violet-200", icon: FaBoxOpen },
    3: { label: "Shipped", className: "bg-sky-50 text-sky-700 ring-sky-200", icon: FaTruck },
    4: { label: "Out for Delivery", className: "bg-cyan-50 text-cyan-700 ring-cyan-200", icon: FaTruck },
    5: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: FaCheckCircle },
    6: { label: "Cancelled", className: "bg-slate-100 text-slate-700 ring-slate-200", icon: FaExclamationCircle },
    7: { label: "Failed", className: "bg-rose-50 text-rose-700 ring-rose-200", icon: FaExclamationCircle },
};

const formatAmount = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(amount || 0));
const formatDate = (date) => date ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date)) : "—";

function StatusBadge({ detail }) {
    const Icon = detail.icon;
    return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${detail.className}`}><Icon className="text-[11px]" />{detail.label}</span>;
}

export default function MyOrderCard({ orders, loading }) {
    if (loading) return <div className="py-24 text-center text-sm font-medium text-slate-500">Loading your orders…</div>;

    if (orders.length === 0) {
        return <div className="mx-auto my-16 max-w-md rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center"><FaBoxOpen className="mx-auto mb-4 text-4xl text-[#c09578]" /><h1 className="text-xl font-bold text-slate-800">No orders yet</h1><p className="mt-2 text-sm leading-6 text-slate-500">Your placed orders will appear here.</p></div>;
    }

    return (
        <main className="min-h-screen bg-[#faf8f6] py-10 sm:py-14">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#c09578]">Purchase history</p><h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">My Orders</h1></div><p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-stone-200">{orders.length} {orders.length === 1 ? "order" : "orders"}</p></div>

                <div className="space-y-6">
                    {orders.map((item) => {
                        const payment = paymentStatusDetails[Number(item.payment_status)] || paymentStatusDetails[1];
                        const order = orderStatusDetails[Number(item.order_status)] || { label: "Processing", className: "bg-slate-100 text-slate-700 ring-slate-200", icon: FaHourglassHalf };
                        const products = item.product_info || [];

                        return <article key={item._id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition-shadow hover:shadow-md">
                            <header className="flex flex-col gap-4 border-b border-stone-100 bg-stone-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order number</p><p className="mt-1 font-bold text-slate-800">{item.order_number || "Order"}</p></div><div className="flex flex-wrap gap-2"><StatusBadge detail={payment} /><StatusBadge detail={order} /></div></header>
                            <div className="grid gap-5 px-5 py-5 sm:grid-cols-3 sm:px-7">
                                <div className="flex items-center gap-3 text-sm text-slate-600"><FaCalendarAlt className="text-[#c09578]" /><div><p className="text-xs text-slate-400">Ordered on</p><p className="font-semibold text-slate-700">{formatDate(item.created_at)}</p></div></div>
                                <div className="flex items-center gap-3 text-sm text-slate-600"><FaCreditCard className="text-[#c09578]" /><div><p className="text-xs text-slate-400">Total amount</p><p className="font-semibold text-slate-700">{formatAmount(item.net_amount || item.total_amount)}</p></div></div>
                                <div className="flex items-center gap-3 text-sm text-slate-600"><FaMapMarkerAlt className="text-[#c09578]" /><div><p className="text-xs text-slate-400">Delivering to</p><p className="font-semibold text-slate-700">{item.shipping_address?.city || item.billing_address?.city || "Address pending"}</p></div></div>
                            </div>
                            <div className="border-t border-stone-100 px-5 py-2 sm:px-7">
                                {products.length > 0 ? products.map((product, index) => <div key={`${product.id || product.title || "product"}-${index}`} className="flex gap-4 border-b border-stone-100 py-4 last:border-0"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-24 sm:w-24">{product.image ? <img src={product.image} alt={product.title || product.name || "Ordered product"} className="h-full w-full object-cover" /> : <FaBoxOpen className="m-auto h-full w-7 text-stone-400" />}</div><div className="flex min-w-0 flex-1 flex-col justify-center"><h2 className="truncate font-bold text-slate-800">{product.title || product.name || "Product"}</h2><p className="mt-1 text-sm text-slate-500">Quantity: <span className="font-semibold text-slate-700">{product.quantity || 1}</span></p></div><p className="self-center whitespace-nowrap font-bold text-slate-800">{formatAmount(product.newPrice || product.price)}</p></div>) : <p className="py-5 text-sm text-slate-500">Product details are unavailable for this order.</p>}
                            </div>
                        </article>;
                    })}
                </div>
            </div>
        </main>
    );
}
