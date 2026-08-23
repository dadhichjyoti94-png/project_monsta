import ProductCart from '../componets/common/ProductCart'
import { products } from '../Data/products'

export default async function SearchPage({ searchParams }) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q.trim() : ''
  const normalizedQuery = query.toLowerCase()
  const results = normalizedQuery
    ? products.filter((product) => {
        const searchableContent = [
          product.title,
          product.category,
          product.description,
          ...product.tags,
        ].join(' ').toLowerCase()

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