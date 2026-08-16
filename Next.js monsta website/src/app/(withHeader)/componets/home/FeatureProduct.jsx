'use client'

import ProductCart from '../common/ProductCart'
import Link from 'next/link'
import React, { useEffect, useState } from "react"
import axios from "axios"
import { createNameMap, getProductColor, getProductMaterial, isOnSaleProduct } from '../../utils/product'
import { getAdminApiUrl } from '../../utils/api'

const fetchColorList = async () => {
    const endpoints = ['colour', 'color']

    for (const endpoint of endpoints) {
        try {
            const result = await axios.post(getAdminApiUrl(`${endpoint}/view`), {
                status: true,
                limit: 100
            })

            if (result.data?._status && Array.isArray(result.data._data)) {
                return result.data._data
            }
        } catch (error) {
            console.log(`${endpoint.toUpperCase()} LIST ERROR =`, error)
        }
    }

    return []
}

const fetchMaterialList = async () => {
    try {
        const result = await axios.post(getAdminApiUrl('material/view'), {
            status: true,
            limit: 100
        })

        if (result.data?._status && Array.isArray(result.data._data)) {
            return result.data._data
        }
    } catch (error) {
        console.log('MATERIAL LIST ERROR =', error)
    }

    return []
}

export default function FeatureProduct() {

    const [activeTab, setActiveTab] = useState("featured")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [imagePath, setImagePath] = useState("")
    const [colorMap, setColorMap] = useState({})
    const [materialMap, setMaterialMap] = useState({})

    const apiUrl = getAdminApiUrl('product')

    useEffect(() => {

        Promise.all([
            axios.post(`${apiUrl}/view`, {
                limit: 100
            }),
            fetchColorList(),
            fetchMaterialList()
        ])
            .then(([result, colorList, materialList]) => {

                console.log("PRODUCT API RESPONSE =", result.data)

                setColorMap(createNameMap(colorList))
                setMaterialMap(createNameMap(materialList))

                if (result.data._status) {
                    setProducts(result.data._data)
                    setImagePath(result.data._image_path)
                } else {
                    setProducts([])
                }

            })
            .catch((error) => {

                console.log("PRODUCT API ERROR =", error)
                setProducts([])

            })
            .finally(() => {
                setLoading(false)
            })

    }, [])

    // Active tab ke according products
    let filteredProducts = []

    if (activeTab === "featured") {

        filteredProducts = products.filter(
            (item) => Number(item.product_type) === 1
        )

    } else if (activeTab === "new") {

        filteredProducts = products.filter(
            (item) => Number(item.product_type) === 2
        )

    } else if (activeTab === "sale") {

        filteredProducts = products.filter(
            (item) => isOnSaleProduct(item) && ![1, 2].includes(Number(item.product_type))
        )

    }

    return (
        <>
            <div className="w-full">

                {/* Tabs */}

                <div className="mt-7 mb-8 flex justify-center">

                    <div className="flex max-w-full border border-gray-300 text-sm sm:text-base">

                        <button
                            onClick={() => setActiveTab("featured")}
                            className={`px-3 sm:px-8 py-3 border-r ${activeTab === "featured"
                                    ? "text-[#b8846b]"
                                    : "text-black"
                                }`}
                        >
                            Featured
                        </button>

                        <button
                            onClick={() => setActiveTab("new")}
                            className={`px-3 sm:px-8 py-3 border-r ${activeTab === "new"
                                    ? "text-[#b8846b]"
                                    : "text-black"
                                }`}
                        >
                            New Arrivals
                        </button>

                        <button
                            onClick={() => setActiveTab("sale")}
                            className={`px-3 sm:px-8 py-3 ${activeTab === "sale"
                                    ? "text-[#b8846b]"
                                    : "text-black"
                                }`}
                        >
                            Onsale
                        </button>

                    </div>

                </div>


                {/* Products */}

                <div className="w-[84%] max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {loading ? (

                        <p className="col-span-4 text-center">
                            Loading products...
                        </p>

                    ) : filteredProducts.length > 0 ? (

                        filteredProducts.map((item) => (

                            <ProductCart
                                key={item._id}

                                id={item._id}

                                title={item.name}

                                category={
                                    item.parent_category_id?.name || ""
                                }

                                oldPrice={item.actual_price}

                                newPrice={item.sale_price}

                                color={getProductColor(item, colorMap)}

                                material={getProductMaterial(item, materialMap)}

                                image={`${imagePath}/${item.image}`}
                            />

                        ))

                    ) : (

                        <p className="col-span-4 text-center text-gray-500">
                            No products found
                        </p>

                    )}

                </div>


                {/* Trending Collection */}

                <div>

                    <div className="w-full pt-7 relative overflow-hidden">

                        <img
                            src="image/collection.jpg"
                            className="w-full h-[320px] sm:h-[420px] lg:h-[510px] object-cover"
                            alt=""
                        />

                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 sm:left-[10%] sm:right-auto sm:px-0">

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#242424]">
                                New Trending Collection
                            </h2>

                            <h2 className="text-[16px] pt-5 text-[#5a5a5a]">
                                We Believe That Good Design is Always in Season
                            </h2>

                            <div>

                                <Link
                                    href="/trending-collection"
                                    className="inline-block border border-[#c98b6b] mt-6 sm:mt-10 px-7 sm:px-10 py-3 sm:py-4 text-[#c98b6b] font-semibold hover:bg-[#c98b6b] hover:text-white"
                                >
                                    Shopping Now
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}
