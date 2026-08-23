'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCart from '../componets/common/ProductCart'
import { hasProductFlag, mapProductCard } from '../utils/product'
import { getAdminApiUrl } from '../utils/api'

// export const metadata = {
//   title: 'Trending Collection',
//   description: 'Explore the latest trending furniture collection'
// }

const categoryGroups = [
  {
    title: 'Tables',
    items: ['Side and End Tables', 'Nest Of Tables', 'Coffee Table Sets', 'Coffee Tables']
  },
  {
    title: 'Mirror',
    items: ['Wooden Mirrors']
  },
  {
    title: 'Living Storage/collections',
    items: ['Prayer Units', 'Display Unit', 'Shoe Racks', 'Chest Of Drawers', 'Cabinets and Sideboard', 'Bookshelves', 'TV units']
  },
  {
    title: 'Sofa Cum Bed',
    items: ['Wooden Sofa Cum Bed']
  },
  {
    title: 'Sofa Sets',
    items: ['Sofa Cover', 'L Shape Sofa', '1 Seater Sofa', '2 Seater Sofa', '3 Seater Sofa', 'Wooden Sofa Set']
  },
  {
    title: 'Swing',
    items: ['Wooden Jhula']
  }
]

const materials = ['Rose Wood', 'Teak Wood', 'Satin Wood', 'Sal Wood', 'Marandi Wood', 'Mahogany Wood']

const categoryLinks = {
  'Side and End Tables': '/category/SideAndTables',
  'Nest Of Tables': '/category/NestOfTables',
  'Coffee Table Sets': '/category/CoffeeTableSets'
}

function FilterList({ title, items }) {

  return (
    <div>
      <h3 className='pb-3 pt-5 text-[20px] font-bold text-[#242424]'>{title}</h3>
      <ul>
        {items.map((item) => {
          const href = categoryLinks[item]

          return (
            <li key={item} className='flex items-center gap-3 pb-4 text-[16px] text-[#5a5a5a]'>
              {href ? (
                <Link href={href} className='flex items-center gap-3 hover:text-[#c89a74]'>
                  <span className='h-[18px] w-[18px] rounded border border-gray-300'></span>
                  <span>{item}</span>
                </Link>
              ) : (
                <>
                  <input type='checkbox' className='h-[18px] w-[18px] rounded border border-gray-300 accent-[#c89a74]' />
                  <span>{item}</span>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function TrendingCollectionPage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [apiProducts, setApiProducts] = useState([])
  const [imagePath, setImagePath] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(getAdminApiUrl('product/view'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: true,
            limit: 100,
          }),
        })

        const data = await response.json()

        if (data?._status && Array.isArray(data?._data)) {
          setApiProducts(data._data)
          setImagePath(data._image_path || '')
        } else {
          setApiProducts([])
        }
      } catch (error) {
        console.log('TRENDING PRODUCT ERROR =', error)
        setApiProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const selectedProducts = apiProducts
    .filter((product) => {
      if (activeTab === 'best') {
        return hasProductFlag(product, [
          'is_best_selling',
          'is_bestselling',
          'best_selling',
          'bestselling',
        ])
      }

      return hasProductFlag(product, [
        'is_trending',
        'is_tranding',
        'is_trinding',
        'trending',
      ])
    })
    .map((product) => mapProductCard(product, imagePath))

  const products = [...selectedProducts].sort((firstProduct, secondProduct) => {
    const firstPrice = Number(String(firstProduct.newPrice || 0).replace(/,/g, ''))
    const secondPrice = Number(String(secondProduct.newPrice || 0).replace(/,/g, ''))

    if (activeTab === 'price-low') {
      return firstPrice - secondPrice
    }

    if (activeTab === 'price-high') {
      return secondPrice - firstPrice
    }

    return 0
  })

  
  return (
    <div className='bg-white'>
      <div className='border-b border-[#eeeeee] pb-10 pt-12 text-center'>
        <h1 className='font-serif text-[42px] font-bold leading-tight text-[#242424]'>Trending Collection</h1>
        <div className='flex items-center justify-center gap-3 pt-3 text-[16px]'>
          <Link href='/' className='text-black hover:text-[#c89a74]'>Home</Link>
          <span className='text-[#c89a74]'>&gt;</span>
          <span className='text-[#c89a74]'>Trending Collection</span>
        </div>
      </div>

      <div className='mx-auto flex w-[88%] flex-col gap-10 pt-14 lg:flex-row lg:gap-14'>
        <aside className='w-full shrink-0 lg:w-[330px]'>
          <div className='max-h-[760px] overflow-y-auto border-b-[6px] border-[#c89a74] pb-8 lg:h-[760px] lg:border-b-0 lg:border-r-[6px] lg:pb-0 lg:pr-10'>
            <h2 className='font-serif text-[30px] font-bold text-[#242424]'>Categories</h2>
            {categoryGroups.map((group) => (
              <FilterList key={group.title} title={group.title} items={group.items} />
            ))}
          </div>

          <div className='border-b border-gray-300 pb-4 pr-8'>
            <FilterList title='Material' items={materials} />
          </div>
        </aside>

        <main className='min-w-0 flex-1 pb-12'>
          <div className='mb-11 flex flex-col items-start gap-5 border border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:gap-12 lg:px-10'>
            <div className='flex items-center gap-5'>
              <span className='font-serif text-[16px] text-[#5a5a5a]'>Sort By :</span>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="h-[44px] border border-gray-200 px-5 text-[16px] text-[#5a5a5a] outline-none"
              >
                <option value="trending">Trending Product</option>
                <option value="best">Best Selling Product</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>
            </div>
            <p className='text-[16px] text-[#5a5a5a]'>Showing {products.length} results</p>
          </div>

          <div className='grid justify-items-center gap-x-9 gap-y-10 sm:grid-cols-2 xl:grid-cols-3'>
            {loading ? (
              <p className='col-span-full text-center text-gray-500'>Loading products...</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCart key={product.id || product.title} {...product} />
              ))
            ) : (
              <p className='col-span-full text-center text-gray-500'>No products found</p>
            )}
          </div>
        </main>
      </div >
    </div >
  )
}
