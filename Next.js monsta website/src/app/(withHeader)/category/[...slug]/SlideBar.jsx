'use client'

import React, { useEffect, useState } from 'react'
import { getDisplayName } from '../../utils/product'
import { getAdminApiUrl } from '../../utils/api'

const fallbackColors = [
  'Burnt Amber',
  'Golden Teak',
  'Carbon Black',
  'Faded Oak',
  'Weathered French Grey',
  'Faded Ochre',
  'Weathered Walnut',
  'Cobalt Blue',
  'Mango Green',
  'Black Finish',
]

const fallbackMaterials = [
  'Rose Wood',
  'Teak Wood',
  'Satin Wood',
  'Sal Wood',
  'Marandi Wood',
  'Mahogany Wood',
  'Mulberry Wood',
  'JackFruit',
]

export default function SlideBar() {
  const [colors, setColors] = useState(fallbackColors)
  const [materials, setMaterials] = useState(fallbackMaterials)

  useEffect(() => {
    const fetchColors = async () => {
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
          })

          const data = await response.json()

          if (data?._status && Array.isArray(data?._data)) {
            const adminColors = data._data
              .map((item) => getDisplayName(item))
              .filter(Boolean)

            if (adminColors.length > 0) {
              setColors(adminColors)
              return
            }
          }
        } catch (error) {
          console.log(`${endpoint.toUpperCase()} LIST ERROR =`, error)
        }
      }
    }

    fetchColors()
  }, [])

  useEffect(() => {
    const fetchMaterials = async () => {
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
        })

        const data = await response.json()

        if (data?._status && Array.isArray(data?._data)) {
          const adminMaterials = data._data
            .map((item) => getDisplayName(item))
            .filter(Boolean)

          if (adminMaterials.length > 0) {
            setMaterials(adminMaterials)
          }
        }
      } catch (error) {
        console.log('MATERIAL LIST ERROR =', error)
      }
    }

    fetchMaterials()
  }, [])

  return (
    <>
      <div className='w-full'>

        <div className='h-[494px] overflow-y-auto scrollbar border-b border-[#d9d9d9] pb-4'>
          <div>
            <h2 className='text-2xl font-bold'>Categories</h2>

            <h3 className='text-[#69645F] text-xl font-medium pt-5 pb-2'>Tables</h3>

            <ul>
              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Side and End Tables</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Nest Of Tables</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Coffee Table Sets</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Coffee Tables</p>
              </li>
            </ul>

            <p className='text-xl font-medium pt-5 pb-2 text-[#69645F]'>
              Mirror
            </p>

            <ul>
              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Wooden Mirrors</p>
              </li>
            </ul>

            <p className='text-xl font-medium pt-5 pb-2 text-[#69645F]'>
              Living Storage/collections
            </p>

            <ul>
              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Prayer Units</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Display Unit</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Shoe Racks</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Chest Of Drawers</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Cabinets and Sideboard</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Bookshelves</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>TV units</p>
              </li>
            </ul>

            <p className='text-xl font-medium pt-5 pb-2 text-[#69645F]'>
              Sofa Cum Bed
            </p>

            <ul>
              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Wooden Sofa Cum Bed</p>
              </li>
            </ul>

            <p className='text-xl font-medium pt-5 pb-2 text-[#69645F]'>
              Sofa Sets
            </p>

            <ul>
              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Sofa Cover</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>L Shape Sofa</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>1 Seater Sofa</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>2 Seater Sofa</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>3 Seater Sofa</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Wooden Sofa Set</p>
              </li>

              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Normal</p>
              </li>
            </ul>

            <p className='text-xl font-medium pt-5 pb-2 text-[#69645F]'>
              Swing
            </p>

            <ul>
              <li className='flex gap-2 pb-3'>
                <input type='checkbox' />
                <p>Wooden Jhula</p>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-5 border-b border-gray-300 w-full'>
          <p className='text-2xl font-semibold pb-5'>Material</p>

          <ul>
            {materials.map((material) => (
              <li key={material} className='flex gap-2 pb-4'>
                <input type='checkbox' />
                <p>{material}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-5 pb-2 w-full'>
          <p className='text-2xl font-semibold pb-5'>Color</p>

          <ul>
            {colors.map((color) => (
              <li key={color} className='flex gap-2 pb-4'>
                <input type='checkbox' />
                <p>{color}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-2  pb-8 w-[270px]'>

          <h2 className='text-2xl font-semibold mb-6'>Filter By Price</h2>
    

        <input
          type='range'
          min='0'
          max='200000'
          className='w-full accent-[#c09073]'
        />

        <p className='font-semibold text-gray-700 mt-5'>
          Rs. 0 - Rs. 200000
        </p>

        <button className='mt-3 bg-[#1f1f1f] text-white px-5 py-2 text-sm font-semibold rounded hover:bg-[#C09578]'>
          Filter
        </button>
      </div>

    </div >
    </>
  )
}
