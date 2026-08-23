import React from 'react'
import OnlineStore from '../../onlineStore/onlinestore'
import { products as localProducts } from '../../Data/products'
import { createNameMap, getProductColor, getProductMaterial } from '../../utils/product'
import { getAdminApiUrl } from '../../utils/api'

const readJson = async (response) => {
  const text = await response.text()

  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const dynamic = 'force-dynamic'

const normalizeSlug = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const mapProduct = (product, imagePath = '', colorMap = {}, materialMap = {}) => {
  const imageName = product.image || ''
  const image = imageName.startsWith('http')
    ? imageName
    : `${imagePath}/${imageName}`

  return {
    id: product._id || product.id || product.slug,
    title: product.name || product.title || 'Product',
    categoryGroup: product.parent_category_id?.name || product.categoryGroup || '',
    category: product.sub_sub_category_id?.name || product.sub_category_id?.name || product.parent_category_id?.name || product.category || '',
    oldPrice: product.actual_price || product.mrp || product.oldPrice || product.price || '0',
    newPrice: product.sale_price || product.new_price || product.newPrice || product.price || '0',
    image,
    color: getProductColor(product, colorMap),
    material: getProductMaterial(product, materialMap),
  }
}

const normalizeApiList = (payload) => {
  if (!payload || typeof payload !== 'object') return [];

  const possibleArrays = [
    payload._data,
    payload.data,
    payload._result,
    payload.result,
    payload.items,
    payload.list,
  ];

  const arrayFound = possibleArrays.find(Array.isArray);
  return arrayFound || [];
}

const getColorMap = async () => {
  const endpoints = ['colour', 'color']

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(getAdminApiUrl(`${endpoint}/view`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: true,
          limit: 100,
        }),
        cache: 'no-store',
      })

      const data = await readJson(response)
      const isSuccess = data?._status === true || data?.status === true || data?.success === true;

      if (isSuccess) {
        return createNameMap(normalizeApiList(data))
      }
    } catch (error) {
      console.log(`${endpoint.toUpperCase()} LIST ERROR =`, error)
    }
  }

  return {}
}

const getMaterialMap = async () => {
  try {
    const response = await fetch(getAdminApiUrl('material/view'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: true,
        limit: 100,
      }),
      cache: 'no-store',
    })

    const data = await readJson(response)
    const isSuccess = data?._status === true || data?.status === true || data?.success === true;

    if (isSuccess) {
      return createNameMap(normalizeApiList(data))
    }
  } catch (error) {
    console.log('MATERIAL LIST ERROR =', error)
  }

  return {}
}

const getLocalProductsBySlug = (slug) => {
  return localProducts.filter((product) => {
    const values = [
      product.id,
      product.title,
      product.category,
      ...(product.tags || []),
    ].map(normalizeSlug)

    return values.includes(normalizeSlug(slug))
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  let activeSubSubCategory = null
  let listingProducts = []
  let allProducts = []
  const colorMap = await getColorMap()
  const materialMap = await getMaterialMap()

  try {
    const response = await fetch(getAdminApiUrl('sub-sub-category/view'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: true,
        limit: 100,
      }),
      cache: 'no-store',
    })

    const data = await response.json()

    if (data?._status && Array.isArray(data?._data)) {
      activeSubSubCategory = data._data.find((item) => item.slug === slug)
    }
  } catch (error) {
    console.log('SUB SUB CATEGORY ERROR =', error)
  }

  if (activeSubSubCategory?._id) {
    try {
      const response = await fetch(getAdminApiUrl('product/view'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: true,
          limit: 100,
          sub_sub_category_id: activeSubSubCategory._id,
        }),
        cache: 'no-store',
      })

      const data = await readJson(response)

      if (data?._status && Array.isArray(data?._data)) {
        listingProducts = data._data.map((product) => mapProduct(product, data._image_path || '', colorMap, materialMap))
      }
    } catch (error) {
      console.log('CATEGORY PRODUCT LISTING ERROR =', error)
    }
  }

  try {
    const response = await fetch(getAdminApiUrl('product/view'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: true, limit: 100 }),
      cache: 'no-store',
    })
    const data = await readJson(response)

    if (data?._status && Array.isArray(data?._data)) {
      allProducts = data._data.map((product) => mapProduct(product, data._image_path || '', colorMap, materialMap))
    }
  } catch (error) {
    console.log('ALL PRODUCT LISTING ERROR =', error)
  }

  const fallbackProducts = getLocalProductsBySlug(slug).map((product) => mapProduct(product, '', colorMap, materialMap))
  const products = listingProducts.length > 0 ? listingProducts : fallbackProducts
  const filterProducts = allProducts.length > 0
    ? allProducts
    : localProducts.map((product) => mapProduct(product, '', colorMap, materialMap))

  return <OnlineStore listingTitle='Product Listing' products={products} filterProducts={filterProducts} />
}
