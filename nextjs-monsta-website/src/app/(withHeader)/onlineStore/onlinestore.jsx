import React from 'react'
import ProductListingClient from './ProductListingClient'
import { createNameMap, getProductColor, getProductMaterial } from '../utils/product'
import { getAdminApiUrl } from '../utils/api'

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

const mapProduct = (product, imagePath = '', colorMap = {}, materialMap = {}) => {
  const imageName = product.image || ''
  const image = imageName.startsWith('http')
    ? imageName
    : `${imagePath}/${imageName}`

  return {
    id: product._id || product.id || product.slug,
    title: product.name || product.title || 'Product',
    categoryGroup: product.parent_category_id?.name || product.categoryGroup || '',
    category: product.sub_sub_category_id?.name || product.sub_category_id?.name || product.parent_category_id?.name || '',
    oldPrice: product.actual_price || product.mrp || product.oldPrice || '0',
    newPrice: product.sale_price || product.price || product.newPrice || '0',
    image,
    color: getProductColor(product, colorMap),
    material: getProductMaterial(product, materialMap),
  }
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

      if (data?._status && Array.isArray(data?._data)) {
        return createNameMap(data._data)
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

    if (data?._status && Array.isArray(data?._data)) {
      return createNameMap(data._data)
    }
  } catch (error) {
    console.log('MATERIAL LIST ERROR =', error)
  }

  return {}
}

const getProducts = async () => {
  try {
    const [response, colorMap, materialMap] = await Promise.all([
      fetch(getAdminApiUrl('product/view'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: true,
          limit: 100,
        }),
        cache: 'no-store',
      }),
      getColorMap(),
      getMaterialMap(),
    ])

    const data = await readJson(response)

    if (!data?._status || !Array.isArray(data?._data)) {
      return []
    }

    return data._data.map((product) => mapProduct(product, data._image_path || '', colorMap, materialMap))
  } catch (error) {
    console.log('PRODUCT LISTING ERROR =', error)
    return []
  }
}

export default async function OnlineStore({
  listingTitle = 'Online Store',
  products,
  filterProducts,
} = {}) {
  const storeProducts = Array.isArray(products) ? products : await getProducts()
  const sidebarProducts = Array.isArray(filterProducts) ? filterProducts : storeProducts
  return (
    <>
      <section>
        <div className='border-b border-gray-300 w-[83%] mx-auto pb-8'>
          <h1 className='text-center pt-10 text-4xl text-[#242424] font-bold'>{listingTitle}</h1>
          <p className='text-center mt-3 text-sm text-gray-600'>Home <span className='mx-2 text-[#c89a74]'>&gt;</span> {listingTitle}</p>
        </div>

        <ProductListingClient products={storeProducts} filterProducts={sidebarProducts} />
      </section>

      <div className='w-full border-b border-gray-300 mt-8' />
    </>
  )
}
