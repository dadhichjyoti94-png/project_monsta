"use client";

import { useEffect, useMemo, useState } from "react";

const getUniqueValues = (products, key) => [...new Set(products.map((product) => String(product[key] || "").trim()).filter(Boolean))].sort();
const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

function FilterSection({ title, values, selectedValues, onToggle }) {
  const [isOpen, setIsOpen] = useState(true);
  if (!values.length) return null;

  return <section className="border-b border-stone-200 py-4 last:border-0"><button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between text-left text-sm font-bold uppercase tracking-wide text-stone-800">{title}<span className="text-xl font-normal text-[#c09578]">{isOpen ? "−" : "+"}</span></button>{isOpen && <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">{values.map((value) => <li key={value}><label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600 transition hover:text-[#a96745]"><input type="checkbox" checked={selectedValues.includes(value)} onChange={() => onToggle(value)} className="h-4 w-4 rounded accent-[#c09578]" /><span>{value}</span></label></li>)}</ul>}</section>;
}

function CategoryGroups({ groups, selectedValues, onToggle }) {
  if (!groups.length) return null;

  return <section className="border-b border-stone-200 py-4"><h3 className="text-sm font-bold uppercase tracking-wide text-stone-800">Categories</h3><div className="mt-4 space-y-6">{groups.map(({ name, values }) => <div key={name}><h4 className="font-serif text-xl font-bold text-stone-800">{name}</h4><ul className="mt-3 space-y-2.5">{values.map((value) => <li key={value}><label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600 transition hover:text-[#a96745]"><input type="checkbox" checked={selectedValues.includes(value)} onChange={() => onToggle(value)} className="h-4 w-4 rounded accent-[#c09578]" /><span>{value}</span></label></li>)}</ul></div>)}</div></section>;
}

export default function SlideBar({ products = [], filters, onFiltersChange, priceLimits = { min: 0, max: 0 } }) {
  const categoryGroups = useMemo(() => {
    const groups = new Map();
    products.forEach((product) => {
      const categoryName = String(product.category || "").trim();
      const isWoodenMirror = /wooden\s*mirrors?/i.test(categoryName);
      const groupName = isWoodenMirror ? "Wooden Mirror" : (String(product.categoryGroup || "Other").trim() || "Other");
      if (!categoryName) return;
      if (!groups.has(groupName)) groups.set(groupName, new Set());
      groups.get(groupName).add(categoryName);
    });
    return [...groups.entries()].map(([name, values]) => ({ name, values: [...values].sort() })).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);
  const materials = useMemo(() => getUniqueValues(products, "material"), [products]);
  const colors = useMemo(() => getUniqueValues(products, "color"), [products]);
  const [minPrice, setMinPrice] = useState(priceLimits.min);
  const [maxPrice, setMaxPrice] = useState(priceLimits.max);
  const safeFilters = { categories: [], materials: [], colors: [], price: null, ...filters };

  useEffect(() => { setMinPrice(priceLimits.min); setMaxPrice(priceLimits.max); }, [priceLimits.min, priceLimits.max]);

  const toggleFilter = (key, value) => onFiltersChange({ ...safeFilters, [key]: safeFilters[key].includes(value) ? safeFilters[key].filter((item) => item !== value) : [...safeFilters[key], value] });
  const applyPriceFilter = () => {
    const min = Math.max(priceLimits.min, Number(minPrice) || 0);
    const max = Math.min(priceLimits.max, Number(maxPrice) || priceLimits.max);
    onFiltersChange({ ...safeFilters, price: { min: Math.min(min, max), max: Math.max(min, max) } });
  };
  const clearFilters = () => { setMinPrice(priceLimits.min); setMaxPrice(priceLimits.max); onFiltersChange({ categories: [], materials: [], colors: [], price: null }); };
  const selectedCount = safeFilters.categories.length + safeFilters.materials.length + safeFilters.colors.length + (safeFilters.price ? 1 : 0);

  return <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_8px_30px_rgba(76,51,37,0.08)] lg:sticky lg:top-6"><div className="max-h-[calc(100vh-3rem)] overflow-y-auto p-5"><div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-4"><div><h2 className="text-xl font-bold text-stone-900">Filter products</h2><p className="mt-1 text-xs text-stone-500">Find exactly what you need</p></div>{selectedCount > 0 && <button type="button" onClick={clearFilters} className="text-sm font-semibold text-[#b77d5a] hover:underline">Clear all</button>}</div><section className="border-b border-stone-200 py-5"><h3 className="text-sm font-bold uppercase tracking-wide text-stone-800">Filter by price</h3><div className="mt-4 flex items-center gap-2"><input aria-label="Minimum price" type="number" min={priceLimits.min} max={maxPrice} value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-[#c09578] focus:ring-2 focus:ring-[#c09578]/20" /><span className="text-stone-400">–</span><input aria-label="Maximum price" type="number" min={minPrice} max={priceLimits.max} value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-[#c09578] focus:ring-2 focus:ring-[#c09578]/20" /></div><div className="mt-3 flex items-center justify-between text-xs font-medium text-stone-500"><span>{formatPrice(minPrice)}</span><span>{formatPrice(maxPrice)}</span></div><button type="button" onClick={applyPriceFilter} disabled={!priceLimits.max} className="mt-4 w-full rounded-lg bg-[#242424] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#c09578] disabled:cursor-not-allowed disabled:opacity-50">Apply price filter</button></section><CategoryGroups groups={categoryGroups} selectedValues={safeFilters.categories} onToggle={(value) => toggleFilter("categories", value)} /><FilterSection title="Material" values={materials} selectedValues={safeFilters.materials} onToggle={(value) => toggleFilter("materials", value)} /><FilterSection title="Color" values={colors} selectedValues={safeFilters.colors} onToggle={(value) => toggleFilter("colors", value)} /></div></div>;
}
