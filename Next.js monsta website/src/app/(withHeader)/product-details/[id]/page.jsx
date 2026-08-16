'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ProductCart from '../../componets/common/ProductCart'
import {
    createNameMap,
    getDisplayName,
    getItemId,
    getProductColor,
    getProductColorSource,
    getProductMaterial,
    getProductMaterialSource,
    hasProductFlag,
    mapProductCard,
} from '../../utils/product'
import { getAdminApiUrl } from '../../utils/api'

const fieldLabels = {
    _id: 'Product ID',
    name: 'Name',
    slug: 'Slug',
    parent_category_id: 'Parent Category',
    sub_category_id: 'Sub Category',
    sub_sub_category_id: 'Sub Sub Category',
    color_id: 'Color',
    material_id: 'Material',
    actual_price: 'Actual Price',
    sale_price: 'Sale Price',
    product_type: 'Product Type',
    is_trending: 'Trending',
    is_best_selling: 'Best Selling',
    product_code: 'Code',
    dimenstion: 'Dimension',
    dimension: 'Dimension',
    estimate_delivery_days: 'Estimate Delivery Days',
    sort_description: 'Short Description',
    description: 'Description',
    long_description: 'Long Description',
    image: 'Main Image',
    images: 'Gallery Images',
    status: 'Status',
    order: 'Order',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
}

const getLabel = (key) => {
    return fieldLabels[key] || key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

const getName = (value) => {
    return getDisplayName(value)
}

const formatValue = (key, value) => {
    if (value === undefined || value === null || value === '') {
        return '-'
    }

    if (key === 'product_type') {
        if (Number(value) === 1) {
            return 'Featured'
        }

        if (Number(value) === 2) {
            return 'New Arrival'
        }
    }

    if (key === 'is_best_selling') {
        return Number(value) === 1 ? 'Yes' : 'No'
    }

    if (key === 'is_trending') {
        return Number(value) === 1 ? 'Yes' : 'No'
    }

    if (key === 'status') {
        if (value === true || value === 1 || value === '1') {
            return 'Active'
        }

        if (value === false || value === 0 || value === '0') {
            return 'Inactive'
        }
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '-'
        }

        return value.map((item) => formatValue('', item)).join(', ')
    }

    if (typeof value === 'object') {
        return getDisplayName(value) || value._id || JSON.stringify(value)
    }

    return String(value)
}

const getImageUrl = (imagePath, image) => {
    if (!image) {
        return ''
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('data:') ||
        image.startsWith('/')
    ) {
        return image
    }

    return `${imagePath}/${image}`
}

const getCleanCode = (value) => {
    return String(value || '').replace(/^code:\s*/i, '')
}

const getProductId = (product = {}) => {
    return String(product._id || product.id || product.slug || product.name || '')
}

const getCategoryKey = (product = {}) => {
    return (
        getItemId(product.sub_sub_category_id) ||
        getItemId(product.sub_category_id) ||
        getItemId(product.parent_category_id) ||
        getDisplayName(product.sub_sub_category_id) ||
        getDisplayName(product.sub_category_id) ||
        getDisplayName(product.parent_category_id) ||
        product.category ||
        ''
    )
}

function ProductRail({ title, products }) {
    if (!products.length) {
        return null
    }

    return (
        <section className="mt-12">
            <div className="mb-7 flex items-center gap-5">
                <h2 className="shrink-0 font-serif text-[30px] font-bold text-[#111]">
                    {title}
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                {products.map((item) => (
                    <div key={item.id || item.title}>
                        <ProductCart {...item} />
                    </div>
                ))}
            </div>
        </section>
    )
}

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

const fetchColorDetails = async (colorId) => {
    const endpoints = ['colour', 'color']

    for (const endpoint of endpoints) {
        try {
            const result = await axios.post(getAdminApiUrl(`${endpoint}/details/${colorId}`))

            if (result.data?._status && result.data?._data) {
                return result.data._data
            }
        } catch (error) {
            console.log(`${endpoint.toUpperCase()} DETAILS ERROR =`, error)
        }
    }

    return null
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

const fetchMaterialDetails = async (materialId) => {
    try {
        const result = await axios.post(getAdminApiUrl(`material/details/${materialId}`))

        if (result.data?._status && result.data?._data) {
            return result.data._data
        }
    } catch (error) {
        console.log('MATERIAL DETAILS ERROR =', error)
    }

    return null
}

export default function ProductDetails({ params }) {
    const [product, setProduct] = useState(null)
    const [imagePath, setImagePath] = useState('')
    const [selectedImage, setSelectedImage] = useState('')
    const [colorMap, setColorMap] = useState({})
    const [materialMap, setMaterialMap] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])
    const [upsellProducts, setUpsellProducts] = useState([])

    const { id } = React.use(params)

    useEffect(() => {
        Promise.all([
            axios.post(getAdminApiUrl(`product/details/${id}`)),
            fetchColorList(),
            fetchMaterialList(),
            axios.post(getAdminApiUrl('product/view'), {
                status: true,
                limit: 100,
            }),
        ])
            .then(([result, colorList, materialList, productListResult]) => {
                console.log("PRODUCT DETAILS:", result.data)

                const nextColorMap = createNameMap(colorList)
                const nextMaterialMap = createNameMap(materialList)

                setColorMap(nextColorMap)
                setMaterialMap(nextMaterialMap)

                if (result.data._status) {
                    const data = result.data._data
                    const colorId = getItemId(getProductColorSource(data))
                    const materialId = getItemId(getProductMaterialSource(data))
                    const productList = Array.isArray(productListResult.data?._data)
                        ? productListResult.data._data
                        : []
                    const listImagePath = productListResult.data?._image_path || result.data._image_path || ''
                    const currentProductId = getProductId(data)
                    const currentCategoryKey = getCategoryKey(data)
                    const otherProducts = productList.filter((item) => getProductId(item) !== currentProductId)
                    const matchedRelatedItems = currentCategoryKey
                        ? otherProducts.filter((item) => getCategoryKey(item) === currentCategoryKey)
                        : []
                    const relatedItems = [
                        ...matchedRelatedItems,
                        ...otherProducts.filter((item) => !matchedRelatedItems.some((relatedItem) => getProductId(relatedItem) === getProductId(item))),
                    ].slice(0, 10)
                    const relatedIds = new Set(relatedItems.map(getProductId))
                    const flaggedUpsellItems = otherProducts
                        .filter((item) => !relatedIds.has(getProductId(item)))
                        .filter((item) => hasProductFlag(item, [
                            'is_best_selling',
                            'is_bestselling',
                            'best_selling',
                            'bestselling',
                            'is_trending',
                            'is_tranding',
                            'is_trinding',
                            'trending',
                        ]))
                    const upsellItems = [
                        ...flaggedUpsellItems,
                        ...otherProducts.filter((item) => {
                            const itemId = getProductId(item)

                            return !relatedIds.has(itemId) && !flaggedUpsellItems.some((upsellItem) => getProductId(upsellItem) === itemId)
                        }),
                    ]
                        .slice(0, 10)

                    setProduct(data)
                    setImagePath(result.data._image_path)
                    setRelatedProducts(
                        relatedItems.map((item) => mapProductCard(item, listImagePath, nextColorMap, nextMaterialMap))
                    )
                    setUpsellProducts(
                        upsellItems.map((item) => mapProductCard(item, listImagePath, nextColorMap, nextMaterialMap))
                    )

                    // Main image ko initially selected rakho
                    setSelectedImage(data.image || data.images?.[0] || '')

                    if (colorId && !getProductColor(data, nextColorMap)) {
                        fetchColorDetails(colorId)
                            .then((colorDetails) => {
                                if (colorDetails) {
                                    setColorMap((oldColorMap) => ({
                                        ...oldColorMap,
                                        ...createNameMap([colorDetails]),
                                    }))
                                }
                            })
                    }

                    if (materialId && !getProductMaterial(data, nextMaterialMap)) {
                        fetchMaterialDetails(materialId)
                            .then((materialDetails) => {
                                if (materialDetails) {
                                    setMaterialMap((oldMaterialMap) => ({
                                        ...oldMaterialMap,
                                        ...createNameMap([materialDetails]),
                                    }))
                                }
                            })
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [id])

    if (!product) {
        return <div className="p-10">Loading...</div>
    }

    //  YE YAHAN LAGANA HAI
    const allImages = [
        product.image,
        ...(product.images || [])
    ].filter(Boolean)

    const categoryName =
        getName(product.sub_sub_category_id) ||
        getName(product.sub_category_id) ||
        getName(product.parent_category_id) ||
        product.category ||
        ''

    const hasColorField = Boolean(getProductColorSource(product))
    const colorName = getProductColor(product, colorMap)
    const hasMaterialField = Boolean(getProductMaterialSource(product))
    const materialName = getProductMaterial(product, materialMap)

    const extraKeys = Object.keys(product).filter((key) => ![
        '_id',
        'name',
        'slug',
        'parent_category_id',
        'sub_category_id',
        'sub_sub_category_id',
        'color_id',
        'colour_id',
        'color',
        'colour',
        'color_name',
        'colour_name',
        'colorName',
        'colourName',
        'material_id',
        'material',
        'material_name',
        'materialName',
        'actual_price',
        'sale_price',
        'product_type',
        'is_trending',
        'is_best_selling',
        'order',
        'status',
        'image',
        'images',
        'sort_description',
        'description',
        'long_description',
        'product_code',
        'dimenstion',
        'dimension',
        'estimate_delivery_days',
        'created_at',
        'updated_at',
        'deleted_at',
        '__v',
    ].includes(key))

    const extraFields = extraKeys
        .map((key) => ({
            key,
            label: getLabel(key),
            value: formatValue(key, product[key]),
        }))
        .filter((field) => field.value !== '-')

    const addToCart = () => {
        const productImage = getImageUrl(imagePath, product.image)
        const productId = product._id || product.slug || product.name
        const cartProduct = {
            id: productId,
            image: productImage,
            category: categoryName,
            title: product.name || '',
            oldPrice: Number(String(product.actual_price || 0).replace(/,/g, '')),
            newPrice: Number(String(product.sale_price || 0).replace(/,/g, '')),
            color: colorName,
            material: materialName,
            quantity: 1,
        }

        const oldCart = JSON.parse(localStorage.getItem('cart')) || []
        const exist = oldCart.find((item) => item.id === cartProduct.id)
        const newCart = exist
            ? oldCart.map((item) => (
                item.id === cartProduct.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ))
            : [...oldCart, cartProduct]

        localStorage.setItem('cart', JSON.stringify(newCart))
        toast.success('Product added to cart')
    }

    return (
        <div className="max-w-[1680px] mx-auto py-10 px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10">

                {/* LEFT SIDE IMAGES */}
                <div>

                    {/* MAIN IMAGE */}
                    <div className="border border-gray-200 flex justify-center bg-white">
                        {selectedImage ? (
                            <img
                                src={getImageUrl(imagePath, selectedImage)}
                                alt={product.name}
                                className="w-full h-[360px] md:h-[520px] object-cover"
                            />
                        ) : (
                            <div className="w-full h-[360px] md:h-[520px] flex items-center justify-center text-gray-500">
                                No image available
                            </div>
                        )}
                    </div>

                    {/* SMALL IMAGES */}
                    {allImages.length > 0 && (
                        <div className="flex justify-center gap-5 mt-7 overflow-x-auto pb-2">

                            {allImages.map((img, index) => (
                                <button
                                    key={`${img}-${index}`}
                                    type="button"
                                    onClick={() => setSelectedImage(img)}
                                    className={`shrink-0 border p-1 bg-white ${selectedImage === img ? 'border-[#c98b6b]' : 'border-gray-200'}`}
                                >
                                    <img
                                        src={getImageUrl(imagePath, img)}
                                        alt={`${product.name}-${index}`}
                                        className="w-[135px] h-[90px] object-cover cursor-pointer"
                                    />
                                </button>
                            ))}

                        </div>
                    )}

                </div>

                {/* RIGHT SIDE DETAILS */}
                <div className="pt-0 lg:pt-1">
                    <h1 className="text-4xl font-serif font-bold text-[#111]">
                        {product.name}
                    </h1>

                    <div className="mt-7 flex flex-wrap items-center gap-5">
                        <span className="text-gray-400 line-through text-2xl">
                            Rs. {product?.actual_price}
                        </span>

                        <span className="text-[#c09473] font-bold text-3xl">
                            Rs. {product?.sale_price}
                        </span>
                    </div>

                    <p className="text-gray-700 mt-12 text-xl leading-8">
                        {product.sort_description}
                    </p>

                    <div className="border-t border-gray-200 mt-12 pt-12">
                        <button
                            type="button"
                            onClick={addToCart}
                            className="w-full max-w-[405px] h-[62px] bg-[#c09473] text-white text-2xl font-semibold hover:bg-[#a97859] transition"
                        >
                            Add To Cart
                        </button>
                    </div>

                    <div className="mt-10 space-y-6 text-2xl text-black">
                        {product.product_code && (
                            <p>Code: {getCleanCode(product.product_code)}</p>
                        )}

                        {(product.dimenstion || product.dimension) && (
                            <p>Dimension: {product.dimenstion || product.dimension}</p>
                        )}

                        {product.estimate_delivery_days && (
                            <p>Estimate Delivery Days: {product.estimate_delivery_days}</p>
                        )}

                        {categoryName && (
                            <p>Category: {categoryName}</p>
                        )}

                        {hasColorField && (
                            <p>Color: {colorName || '-'}</p>
                        )}

                        {hasMaterialField && (
                            <p>Material: {materialName || '-'}</p>
                        )}

                        {extraFields.map((field) => (
                            <p key={field.key}>
                                {field.label}: {field.value}
                            </p>
                        ))}
                    </div>
                </div>

            </div>

            {(product.long_description || product.description) && (
                <div className="mt-14 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-serif font-bold mb-4">
                        Description
                    </h2>

                    <p className="text-gray-700 text-lg leading-8 whitespace-pre-line">
                        {product.long_description || product.description}
                    </p>
                </div>
            )}

            <ProductRail title="Related Products" products={relatedProducts} />
            <ProductRail title="Upsell Products" products={upsellProducts} />

        </div>
    )
}
