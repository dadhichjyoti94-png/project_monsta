"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { FaGreaterThan } from "react-icons/fa6";
import { toast } from "react-toastify";
import { getUserAuthHeaders, getWebsiteApiBaseUrl } from "../utils/api";
import UserLogoutButton from "../componets/common/UserLogoutButton";

const emptyAddress = { name: "", email: "", mobile_number: "", address: "", country: "", state: "", city: "" };
const fields = [["name", "Name", "text"], ["email", "Email", "email"], ["mobile_number", "Mobile Number", "tel"], ["address", "Address", "text"], ["country", "Country", "text"], ["state", "State", "text"], ["city", "City", "text"]];

function AddressForm({ title, address, onChange, onSubmit, isSaving }) {
  return <form onSubmit={onSubmit} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"><h2 className="mb-5 text-xl font-bold text-stone-900">{title}</h2><div className="space-y-4">{fields.map(([key, label, type]) => <label key={key} className="block"><span className="mb-1.5 block text-sm font-medium text-stone-700">{label}<span className="text-[#c09578]">*</span></span><input type={type} name={key} required value={address[key] || ""} onChange={onChange} className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#c09578] focus:ring-2 focus:ring-[#c09578]/20" /></label>)}</div><div className="mt-6 text-right"><button type="submit" disabled={isSaving} className="rounded-lg bg-[#242424] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c09578] disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : "Update address"}</button></div></form>;
}

export default function Address() {
  const [billingAddress, setBillingAddress] = useState(emptyAddress);
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = Cookies.get("user_login");
    if (!token) return;

    axios.post(`${getWebsiteApiBaseUrl()}/user/view-profile`, {}, { headers: getUserAuthHeaders(token) })
      .then(({ data }) => {
        if (!data?._status) return;
        const profile = data._data || {};
        const legacyAddress = profile.Address || "";
        setBillingAddress({ ...emptyAddress, name: profile.name || "", email: profile.email || "", mobile_number: profile.mobile_number || "", address: legacyAddress, ...(profile.billing_address || {}) });
        setShippingAddress({ ...emptyAddress, name: profile.name || "", email: profile.email || "", mobile_number: profile.mobile_number || "", address: legacyAddress, ...(profile.shipping_address || {}) });
      })
      .catch(() => toast.error("Address details load nahi ho sake."));
  }, []);

  const updateAddress = async (type, event) => {
    event.preventDefault();
    const token = Cookies.get("user_login");
    if (!token) return toast.error("Please login again.");

    const nextBillingAddress = type === "billing" ? billingAddress : billingAddress;
    const nextShippingAddress = type === "shipping" ? shippingAddress : shippingAddress;
    setIsSaving(true);
    try {
      const { data } = await axios.put(`${getWebsiteApiBaseUrl()}/user/update-profile`, {
        billing_address: nextBillingAddress,
        shipping_address: nextShippingAddress,
        Address: nextBillingAddress.address,
      }, { headers: getUserAuthHeaders(token) });
      if (!data?._status) throw new Error(data?._message || "Address update nahi ho saka.");
      setBillingAddress({ ...emptyAddress, ...(data._data?.billing_address || nextBillingAddress) });
      setShippingAddress({ ...emptyAddress, ...(data._data?.shipping_address || nextShippingAddress) });
      toast.success("Address updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?._message || error.message || "Address update nahi ho saka.");
    } finally {
      setIsSaving(false);
    }
  };

  const sidebarItems = [["/order", "Orders"], ["/address", "Addresses"], ["/my-profile", "My Profile"], ["/change-password", "Change Password"]];
  return <div><div className="mx-auto mt-10 w-[84%] border-b border-gray-300 pb-8 text-center"><p className="text-4xl font-medium text-[#242424]">My Dashboard</p><div className="flex items-center justify-center gap-2 pt-3 text-sm"><Link href="/" className="hover:text-[#c09578]">Home</Link><FaGreaterThan size={10} /><p className="text-[#c09578]">Addresses</p></div></div><div className="mx-auto flex w-[84%] flex-col gap-6 py-8 md:flex-row"><aside className="w-full shrink-0 md:w-[260px]"><div className="mb-2 rounded bg-[#222] px-4 py-3 font-semibold text-white">My Dashboard</div>{sidebarItems.map(([href, label]) => <Link href={href} key={href} className={`mb-2 block rounded px-4 py-3 font-semibold text-white transition ${href === "/address" ? "bg-[#c89b7d]" : "bg-[#222] hover:bg-[#c89b7d]"}`}>{label}</Link>)}<UserLogoutButton className="w-full rounded bg-[#222] px-4 py-3 text-left font-semibold text-white hover:bg-[#c89b7d]" /></aside><main className="flex-1"><p className="mb-6 text-sm text-stone-600">These saved addresses will be available during checkout.</p><div className="grid grid-cols-1 gap-6 xl:grid-cols-2"><AddressForm title="Billing address" address={billingAddress} isSaving={isSaving} onChange={(event) => setBillingAddress((current) => ({ ...current, [event.target.name]: event.target.value }))} onSubmit={(event) => updateAddress("billing", event)} /><AddressForm title="Shipping address" address={shippingAddress} isSaving={isSaving} onChange={(event) => setShippingAddress((current) => ({ ...current, [event.target.name]: event.target.value }))} onSubmit={(event) => updateAddress("shipping", event)} /></div></main></div><div className="border-b border-gray-300 pt-5" /></div>;
}
