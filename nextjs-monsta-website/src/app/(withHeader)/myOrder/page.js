"use client";

import { useEffect, useState } from "react";
import MyOrderCard from "./MyOrderCard";
import Cookies from "js-cookie";

export default function Page() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = Cookies.get("user_login");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout/my-order`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("TOKEN:", token);
            console.log("MY ORDER RESPONSE:", data);

            if (data._status) {
                setOrders(data._data);
            }
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    return (
        <MyOrderCard
            orders={orders}
            loading={loading}
        />
    );
}
