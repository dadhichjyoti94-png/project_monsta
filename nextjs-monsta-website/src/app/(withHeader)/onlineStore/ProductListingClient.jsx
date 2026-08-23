"use client";

import { useEffect, useMemo, useState } from "react";
import SlideBar from "../category/[...slug]/SlideBar";
import ProductCart from "../componets/common/ProductCart";

const PRODUCTS_PER_PAGE = 9;
const normalize = (value) => String(value || "").trim().toLowerCase();
const productPrice = (product) => Number(String(product.newPrice ?? product.price ?? 0).replace(/,/g, "")) || 0;
const matchesCategory = (product, selectedCategory) => {
  const selected = normalize(selectedCategory);
  const productText = [product.category, product.title].map(normalize).join(" ");
  const selectedWords = selected.split(/\s+/).filter((word) => word.length > 2 && !["and", "of", "the"].includes(word));
  return productText.includes(selected) || selectedWords.some((word) => productText.includes(word));
};

export default function ProductListingClient({ products = [], filterProducts = products }) {
  const priceLimits = useMemo(() => {
    const prices = products.map(productPrice).filter((price) => price > 0);
    return { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 };
  }, [products]);
  const [filters, setFilters] = useState({ categories: [], materials: [], colors: [], price: null });
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const visibleProducts = useMemo(() => {
    const hasCategoryFilters = filters.categories.length || filters.materials.length || filters.colors.length;
    const sourceProducts = hasCategoryFilters ? filterProducts : products;
    const result = sourceProducts.filter((product) => {
      const price = productPrice(product);
      return (!filters.price || (price >= filters.price.min && price <= filters.price.max)) && (!filters.categories.length || filters.categories.some((value) => matchesCategory(product, value))) && (!filters.materials.length || filters.materials.some((value) => normalize(value) === normalize(product.material))) && (!filters.colors.length || filters.colors.some((value) => normalize(value) === normalize(product.color)));
    });
    return [...result].sort((a, b) => sort === "low" ? productPrice(a) - productPrice(b) : sort === "high" ? productPrice(b) - productPrice(a) : 0);
  }, [products, filterProducts, filters, sort]);
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const firstResult = visibleProducts.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const lastResult = Math.min(currentPage * PRODUCTS_PER_PAGE, visibleProducts.length);
  useEffect(() => { setCurrentPage(1); }, [filters, sort]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => totalPages <= 5 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

  return <div className="mx-auto flex w-[92%] max-w-[1440px] flex-col gap-8 py-10 lg:flex-row lg:gap-10"><aside className="w-full shrink-0 lg:w-[290px]"><SlideBar products={filterProducts} filters={filters} onFiltersChange={setFilters} priceLimits={priceLimits} /></aside><main className="min-w-0 flex-1"><div className="mb-7 flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-stone-600">{visibleProducts.length ? <>Showing <span className="font-semibold text-stone-900">{firstResult}–{lastResult}</span> of <span className="font-semibold text-stone-900">{visibleProducts.length}</span> products</> : "No products found"}</p><label className="flex items-center gap-3 text-sm font-medium text-stone-700">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-normal outline-none transition focus:border-[#c09578] focus:ring-2 focus:ring-[#c09578]/20"><option value="latest">Latest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select></label></div><div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">{paginatedProducts.length ? paginatedProducts.map((product) => <ProductCart key={product.id || product.title} {...product} />) : <div className="col-span-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center"><p className="text-lg font-semibold text-stone-800">No products match these filters.</p><button type="button" onClick={() => setFilters({ categories: [], materials: [], colors: [], price: null })} className="mt-3 text-sm font-semibold text-[#b77d5a] hover:underline">Clear all filters</button></div>}</div>{visibleProducts.length > PRODUCTS_PER_PAGE && <nav aria-label="Product pagination" className="mt-10 flex items-center justify-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-[#c09578] hover:text-[#a96745] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>{pageNumbers.map((page, index) => <span key={page} className="contents">{index > 0 && pageNumbers[index - 1] !== page - 1 && <span className="px-1 text-stone-400">…</span>}<button type="button" onClick={() => setCurrentPage(page)} aria-current={currentPage === page ? "page" : undefined} className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${currentPage === page ? "bg-[#c09578] text-white shadow-sm" : "border border-stone-300 text-stone-700 hover:border-[#c09578] hover:text-[#a96745]"}`}>{page}</button></span>)}<button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-[#c09578] hover:text-[#a96745] disabled:cursor-not-allowed disabled:opacity-40">Next</button></nav>}</main></div>;
}
