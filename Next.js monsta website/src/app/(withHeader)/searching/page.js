import ProductCart from '../componets/common/ProductCart'
import { getAdminApiUrl } from '../utils/api'
import { createNameMap, getProductColor, getProductMaterial } from '../utils/product'

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
    console.log('PRODUCT SEARCH ERROR =', error)
    return []
  }
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams
  const query = typeof params?.q === 'string' ? params.q.trim() : ''
  const normalizedQuery = query.toLowerCase()
  
  const allProducts = await getProducts()
  const results = normalizedQuery
    ? allProducts.filter((product) => {
        const searchableContent = [
          product.title,
          product.category,
        ]
          .join(' ')
          .toLowerCase()

        return searchableContent.includes(normalizedQuery)
      })
    : []

  return (
    <section className='w-[83%] mx-auto py-10 min-h-[420px]'>
      <div className='border-b border-gray-300 pb-8 text-center'>
        <h1 className='text-4xl font-bold text-[#242424]'>Search Products</h1>
        {query && (
          <p className='mt-3 text-gray-600'>
            {results.length} {results.length === 1 ? 'product' : 'products'} found for "{query}"
          </p>
        )}
      </div>

      {!query ? (
        <p className='py-16 text-center text-gray-600'>Search for a product using the search box above.</p>
      ) : results.length === 0 ? (
        <p className='py-16 text-center text-gray-600'>No products found for "{query}". Try another search term.</p>
      ) : (
        <div className='grid grid-cols-1 justify-items-center gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-4'>
          {results.map((product) => <ProductCart key={product.id} {...product} />)}
        </div>
      )}
    </section>
  )
}
