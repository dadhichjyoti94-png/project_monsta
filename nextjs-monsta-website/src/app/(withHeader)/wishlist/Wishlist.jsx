"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  const removeWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-xl text-gray-500">Your Wishlist is Empty</p>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded"
                />

                <p className="text-gray-500 mt-3">{item.category}</p>

                <h2 className="font-bold text-lg mt-2">
                  {item.title}
                </h2>

                {item.color && (
                  <p className="text-gray-500 mt-2">
                    Color: {item.color}
                  </p>
                )}

                {item.material && (
                  <p className="text-gray-500 mt-2">
                    Material: {item.material}
                  </p>
                )}

                <p className="mt-3">
                  <span className="line-through mr-2">
                    ₹{item.oldPrice}
                  </span>

                  <span className="text-[#c98b6b] font-bold">
                    ₹{item.newPrice}
                  </span>
                </p>

                <button
                  onClick={() => removeWishlist(item.id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded flex justify-center items-center gap-2"
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
