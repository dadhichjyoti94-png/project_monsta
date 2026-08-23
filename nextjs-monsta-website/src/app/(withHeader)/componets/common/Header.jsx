'use client'

import Link from 'next/link';
import axios from "axios";
import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaAngleDown, FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAdminApiUrl, getWebsiteApiBaseUrl } from '../../utils/api';

export default function Header() {
  const router = useRouter()
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [company, setCompany] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null)
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false)

  const islogin = useSelector((data) => {
    return data.login.value;
  })

  const slugify = (value) => {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  const getItemId = (item) => {
    return item?._id || item?.id || item;
  }

  const getParentId = (item, keys) => {
    for (const key of keys) {
      const value = item?.[key];
      const id = getItemId(value);

      if (id) {
        return String(id);
      }
    }

    return '';
  }

  const isActiveItem = (item) => {
    return item?.status === undefined || item?.status === true || item?.status === 1 || item?.status === 'true';
  }

  const getNestedCategories = (item) => {
    const children = item?.sub_categories || item?.subcategories || item?.subCategory || item?.children || item?.subcategory || item?.sub_category || [];
    return Array.isArray(children) ? children.filter(Boolean).filter(isActiveItem) : [];
  }

  const getSubCategoriesByCategory = (category) => {
    const nestedSubCategories = getNestedCategories(category);

    if (nestedSubCategories.length > 0) {
      return nestedSubCategories;
    }

    const categoryId = String(getItemId(category));

    const matchedSubCategories = subCategories.filter((subCategory) => {
      const parentId = getParentId(subCategory, [
        'parent_category_id',
        'category_id',
        'category',
        'parentCategoryId',
        'categoryId'
      ]);

      return parentId === categoryId;
    });

    if (matchedSubCategories.length > 0) {
      return matchedSubCategories;
    }

    return [];
  }

  const getSubSubCategoriesBySubCategory = (subCategory) => {
    const nestedSubSubCategories = getNestedCategories(subCategory);

    if (nestedSubSubCategories.length > 0) {
      return nestedSubSubCategories;
    }

    const subCategoryId = String(getItemId(subCategory));

    return subSubCategories.filter((subSubCategory) => {
      const parentId = getParentId(subSubCategory, [
        'parent_sub_category_id',
        'sub_category_id',
        'subcategory_id',
        'subCategoryId',
        'subCategory',
        'subcategory'
      ]);

      return parentId === subCategoryId;
    });
  }

  const getSubSubCategoriesByCategory = (category) => {
    const categoryId = String(getItemId(category));

    return subSubCategories.filter((subSubCategory) => {
      const parentId = getParentId(subSubCategory, [
        'parent_category_id',
        'category_id',
        'category',
        'parentCategoryId',
        'categoryId'
      ]);

      return parentId === categoryId;
    });
  }

  const buildCategoryUrl = (category, subCategory, subSubCategory) => {
    const slug = subSubCategory?.slug || slugify(subSubCategory?.name);
    return `/categories/${slug}`;
  }

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(wishlist);
  }, [cartOpen]);

  const removeItem = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id)
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const handleSearch = (event) => {
    event.preventDefault()

    const query = searchValue.trim()
    if (!query) {
      router.push('/searching')
      return
    }

    router.push(`/searching?q=${encodeURIComponent(query)}`)
  }

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.newPrice) * Number(item.quantity)
  }, 0)


  useEffect(() => {
    const viewData = {
      status: true,
      page: 1,
      limit: 100
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
      if (arrayFound) return arrayFound.filter(Boolean);

      return [];
    }

    const isSuccessfulApiResponse = (payload) => {
      return payload?._status === true || payload?.status === true || payload?.success === true;
    }

    const getViewData = (url) => {
      return axios.post(getAdminApiUrl(url), viewData)
        .then((result) => {
          const payload = result?.data;

          if (isSuccessfulApiResponse(payload)) {
            return normalizeApiList(payload).filter(isActiveItem);
          }

          return [];
        })
        .catch((error) => {
          console.log("CATEGORY API ERROR =", url, error);
          return [];
        })
    }

    const getFirstViewData = (urls) => {
      return urls.reduce((request, url) => {
        return request.then((data) => {
          if (data.length > 0) {
            return data;
          }

          return getViewData(url);
        });
      }, Promise.resolve([]));
    }

    Promise.all([
      getViewData('/category/view'),
      getFirstViewData(['/sub-category/view', '/subcategory/view']),
      getFirstViewData(['/sub-sub-category/view', '/sub-subcategory/view', '/subsubcategory/view'])
    ])
      .then(([categoryData, subCategoryData, subSubCategoryData]) => {
        setCategories(categoryData);
        setSubCategories(subCategoryData);
        setSubSubCategories(subSubCategoryData);
      })
      .catch((error) => {
        console.log("CATEGORY API ERROR =", error);
        setCategories([]);
        setSubCategories([]);
        setSubSubCategories([]);
      });

  }, []);

  useEffect(() => {
    axios.get(`${getWebsiteApiBaseUrl()}/company`)
      .then(({ data }) => {
        if (data?._status) setCompany(data._data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className='w-full bg-white'>
        <div className='w-full border border-gray-300 '>
          <div className='flex flex-col items-center gap-1 p-3 text-center sm:flex-row sm:justify-between sm:px-8 lg:px-30'>
            <p className='text-[14px]'>
              <Link href='/contactUs' className='hover:text-[#C09578]'>
                Contact us 24/7
              </Link>
              {' : '}{company?.mobile_number || '+91-98745612330'}{' / '}
              <a
                href={`mailto:${company?.email || 'furniture@gmail.com'}`}
                className='hover:text-[#C09578]'
              >
                {company?.email || 'furniture@gmail.com'}
              </a>
            </p>

            {
              islogin
                ?
                <Link href='/my-dashbord' className=' text-[14px] cursor-pointer hover:text-[#C09578]'>
                  My Dashboard
                </Link>
                :
                <Link href='/login-register' className=' text-[14px] cursor-pointer hover:text-[#C09578]'>
                  Login / Register
                </Link>
            }
          </div>
        </div>

        <div className='w-full border-b border-gray-300 flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between sm:px-8 lg:px-30 sm:py-0'>
          <div className='p-2 sm:p-5'>
            <img src="/image/logo.png" className='w-[130px]' />
          </div>

          <div className='flex w-full items-center justify-center gap-3 px-4 pb-3 sm:w-auto sm:px-0 sm:pb-0 sm:gap-5'>
            <form
              onSubmit={handleSearch}
              className='h-[40px] min-w-0 flex-1 sm:w-[300px] sm:flex-none flex items-center border border-gray-300 px-3 mt-0 sm:mt-3 mx-auto'
            >
              <input
                placeholder='Search product...'
                type='text'
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className='w-full outline-none'
              />
              <button type='submit' aria-label='Search products'>
                <FaSearch className='cursor-pointer hover:text-[#C09578]' />
              </button>
            </form>

            <Link href="/wishlist">
              <div className="relative ml-auto mt-3 w-[40px] h-[40px] border border-gray-400 flex items-center justify-center cursor-pointer hover:bg-[#C09578] hover:text-white">

                <FaHeart className="text-[20px]" />

                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C09578] text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}

              </div>
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className='relative mt-0 sm:mt-3 text-center mr-0 sm:mr-20 w-[40px] shrink-0 border border-gray-400 p-2'
            >
              <FaCartShopping className='text-[20px] hover:text-[#C09578]' />

              {cartItems.length > 0 && (
                <span className='absolute -top-3 -left-3 bg-[#c09578] text-white w-[22px] h-[22px] rounded-full text-[12px] flex items-center justify-center'>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="border-b border-gray-300 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-bold tracking-wide text-[#242424]"
          >
            <span>MENU</span>
            {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>

          {mobileMenuOpen && (
            <nav id="mobile-navigation" className="border-t border-gray-200 bg-white px-5 py-3">
              <ul className="divide-y divide-gray-100">
                <li><Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 font-semibold text-[#C09578]">HOME</Link></li>
                <li><Link href="/all-products" onClick={() => setMobileMenuOpen(false)} className="block py-3 font-semibold">ALL PRODUCTS</Link></li>
                {categories.map((category) => {
                  const categoryKey = category._id || category.slug || category.name
                  const isExpanded = mobileCategoryOpen === categoryKey
                  const childSubCategories = getSubCategoriesByCategory(category)
                  const menuSubCategories = childSubCategories.length > 0 ? childSubCategories : [category]

                  return <li key={categoryKey} className="py-1"><button type="button" onClick={() => setMobileCategoryOpen(isExpanded ? null : categoryKey)} aria-expanded={isExpanded} className="flex w-full items-center justify-between py-2 text-left font-semibold uppercase"><span>{category.name}</span><FaAngleDown className={`text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`} /></button>{isExpanded && <div className="space-y-3 border-l-2 border-[#c09578] py-3 pl-4">{menuSubCategories.map((subCategory) => { const subSubCategories = childSubCategories.length > 0 ? getSubSubCategoriesBySubCategory(subCategory) : getSubSubCategoriesByCategory(category); return <div key={subCategory._id || subCategory.slug || subCategory.name}><p className="text-sm font-semibold text-[#242424]">{subCategory.name}</p>{subSubCategories.length > 0 && <ul className="mt-2 space-y-2">{subSubCategories.map((subSubCategory) => <li key={subSubCategory._id || subSubCategory.slug || subSubCategory.name}><Link href={buildCategoryUrl(category, subCategory, subSubCategory)} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-[#C09578]">{subSubCategory.name}</Link></li>)}</ul>}</div>})}</div>}</li>
                })}
                <li className="py-1"><button type="button" onClick={() => setMobilePagesOpen((isOpen) => !isOpen)} aria-expanded={mobilePagesOpen} className="flex w-full items-center justify-between py-2 text-left font-semibold"><span>PAGES</span><FaAngleDown className={`text-xs transition-transform ${mobilePagesOpen ? "rotate-180" : ""}`} /></button>{mobilePagesOpen && <ul className="space-y-2 border-l-2 border-[#c09578] py-3 pl-4 text-sm text-gray-600"><li><Link href="/about-us" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li><li><Link href="/cart" onClick={() => setMobileMenuOpen(false)}>Cart</Link></li><li><Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>Checkout</Link></li><li><Link href="/faq" onClick={() => setMobileMenuOpen(false)}>Frequently Questions</Link></li></ul>}</li>
                <li><Link href="/contactUs" onClick={() => setMobileMenuOpen(false)} className="block py-3 font-semibold">CONTACT US</Link></li>
              </ul>
            </nav>
          )}
        </div>

        <div className="hidden lg:block">
          <nav>
            <ul className='flex flex-wrap gap-x-5 gap-y-4 justify-center px-4 pt-5 border-b border-gray-400 pb-5 font-semibold sm:gap-8'>

              <Link href="/">
                <li className='text-[#C09578]'>HOME</li>
              </Link>

              <Link href="/all-products">
                <li className='hover:text-[#C09578]'>ALL PRODUCTS</li>
              </Link>

              {categories.map((category) => {
                const childSubCategories = getSubCategoriesByCategory(category);
                const menuSubCategories = childSubCategories.length > 0 ? childSubCategories : [category];

                return (
                  <li
                    key={category._id || category.slug || category.name}
                    className="relative group flex items-center pb-5 -mb-5"
                  >
                    <span className="hover:text-[#C09578] cursor-pointer uppercase">
                      {category.name}
                    </span>

                    <FaAngleDown className="text-[10px] ml-1" />

                    <div
                      className="
                                  absolute left-1/2 top-full z-50 w-[min(900px,calc(100vw-2rem))] -translate-x-1/2
                                  opacity-0 invisible
                                  group-hover:opacity-100 group-hover:visible
                                "
                    >
                      <div
                        className="
                                  bg-white
                                  border-t border-gray-200
                                  shadow-lg
                                  mt-0
                                  p-8
                                  origin-top
                                  [transform:perspective(1000px)_rotateX(-90deg)]
                                  transition-all
                                  duration-500
                                  ease-out
                                  group-hover:[transform:perspective(1000px)_rotateX(0deg)]
                                "
                      >

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10">

                        {menuSubCategories.map((subCategory) => {
                          const childSubSubCategories = childSubCategories.length > 0
                            ? getSubSubCategoriesBySubCategory(subCategory)
                            : getSubSubCategoriesByCategory(category);

                          return (
                            <div key={subCategory._id || subCategory.slug || subCategory.name} className="min-w-0">
                              <p className="break-words font-bold text-[#2b2b2b] uppercase">
                                {subCategory.name}
                              </p>

                              {childSubSubCategories.length > 0 ? (
                                <ul className="mt-4 space-y-3 text-sm text-gray-500 font-normal">
                                  {childSubSubCategories.map((subSubCategory) => (
                                    <li
                                      key={subSubCategory._id || subSubCategory.slug || subSubCategory.name}
                                    >
                                      <Link
                                        href={buildCategoryUrl(category, subCategory, subSubCategory)}
                                        className="block break-words hover:text-[#C09578]"
                                      >
                                        {subSubCategory.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-4 text-sm text-gray-400 font-normal">
                                  No sub sub category
                                </p>
                              )}
                            </div>
                          );
                        })}

                      </div>

                      </div>
                    </div>
                  </li>
                );
              })}




              <div className="relative group flex items-center pb-5 -mb-5">
                <li className="hover:text-[#C09578] cursor-pointer">PAGES</li>
                <FaAngleDown className="text-[10px] ml-1" />

                <div className="absolute left-0 top-full w-[220px] bg-white border-t border-gray-200 shadow-lg mt-0 py-3 z-50 opacity-0 pointer-events-none origin-top [transform:perspective(1000px)_rotateX(-90deg)] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:pointer-events-auto group-hover:[transform:perspective(1000px)_rotateX(0deg)]">
                  <ul className="text-gray-500 text-sm">

                    <li>
                      <Link
                        href="/about-us"
                        className="block px-5 py-2 hover:text-[#C09578] cursor-pointer transition-colors duration-300"
                      >
                        About Us
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/cart"
                        className="block px-5 py-2 hover:text-[#C09578] cursor-pointer transition-colors duration-300"
                      >
                        Cart
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/checkout"
                        className="block px-5 py-2 hover:text-[#C09578] cursor-pointer transition-colors duration-300"
                      >
                        Checkout
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/faq"
                        className="block px-5 py-2 hover:text-[#C09578] cursor-pointer transition-colors duration-300"
                      >
                        Frequently Questions
                      </Link>
                    </li>

                  </ul>
                </div>
              </div>

              <Link href="/contactUs">
                <li className='hover:text-[#C09578]'>CONTACT US</li>
              </Link>

            </ul>
          </nav>
        </div>
      </header>

      {cartOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/30"
          ></div>

          <div className="absolute right-0 top-0 w-full max-w-[370px] h-full bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-serif">Cart</h2>

              <button onClick={() => setCartOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-center py-10">Your cart is empty!</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b pb-5 mb-5 relative"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-[95px] h-[70px] object-cover"
                    />

                    <div className="pr-5">
                      <h3 className="font-serif text-[15px]">
                        {item.title}
                      </h3>

                      <p className="text-[14px]">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-[#c09578] font-bold">
                        Rs. {Number(item.newPrice).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute right-0 top-0 text-[20px]"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="flex justify-between font-semibold mb-6">
                  <span>Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="bg-[#1f1f1f] p-5">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block text-center bg-[#2c2c2c] text-white py-4 mb-4 font-bold"
                  >
                    VIEW CART
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block text-center bg-[#c09578] text-white py-4 font-bold"
                  >
                    CHECKOUT
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
