import React from 'react'
import SlideBar from '../category/[...slug]/SlideBar'
import ProductCart from '../componets/common/ProductCart'
import { createNameMap, getProductColor, getProductMaterial } from '../utils/product'
import { getAdminApiUrl } from '../utils/api'

const mapProduct = (product, imagePath = '', colorMap = {}, materialMap = {}) => {
  const imageName = product.image || ''
  const image = imageName.startsWith('http')
    ? imageName
    : `${imagePath}/${imageName}`

  return {
    id: product._id || product.id || product.slug,
    title: product.name || product.title || 'Product',
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

      const data = await response.json()

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

    const data = await response.json()

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

    const data = await response.json()

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
} = {}) {
  const storeProducts = Array.isArray(products) ? products : await getProducts()
  const resultText = storeProducts.length === 1
    ? 'Showing 1 result'
    : `Showing ${storeProducts.length} results`

  return (
    <>
      <section>
        <div className='border-b border-gray-300 w-[83%] mx-auto pb-8'>
          <h1 className='text-center pt-10 text-4xl text-[#242424] font-bold'>{listingTitle}</h1>
          <p className='text-center mt-3 text-sm text-gray-600'>Home <span className='mx-2 text-[#c89a74]'>&gt;</span> {listingTitle}</p>
        </div>

        <div className='w-[83%] mx-auto flex flex-col gap-8 pt-10 lg:flex-row lg:gap-10'>
          <aside className='w-full lg:w-[270px] shrink-0'>
            <SlideBar />
          </aside>

          <div className='flex-1 min-w-0'>
            <div className='border border-gray-200 px-4 py-3 mb-7 flex flex-col items-start gap-3 sm:flex-row sm:justify-end sm:items-center sm:gap-7'>
              <div className='flex flex-wrap items-center gap-3'>
                <label htmlFor='product-sort' className='text-sm text-gray-700'>Sort By :</label>
                <select id='product-sort' className='border border-gray-200 px-4 py-2 text-sm outline-none'>
                  <option>Sort By</option>
                  <option>Latest</option>
                  <option>Price Low to High</option>
                  <option>Price High to Low</option>
                </select>
              </div>
              <p className='text-sm text-gray-700'>{resultText}</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7'>
              {storeProducts.length > 0 ? (
                storeProducts.map((product) => <ProductCart key={product.id || product.title} {...product} />)
              ) : (
                <p className='col-span-full text-center text-gray-500 py-10'>No products found</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className='w-full border-b border-gray-300 mt-8' />
    </>
  )
}
