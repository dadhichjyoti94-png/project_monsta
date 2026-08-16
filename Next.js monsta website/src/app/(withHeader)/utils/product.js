export const getDisplayName = (value) => {
  if (!value) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.map(getDisplayName).filter(Boolean).join(', ')
  }

  if (typeof value === 'object') {
    return (
      value.name ||
      value.title ||
      value.color_name ||
      value.colour_name ||
      value.colorName ||
      value.colourName ||
      value.colorname ||
      value.colourname ||
      value.material_name ||
      value.materialName ||
      value.materialname ||
      value.label ||
      getDisplayName(value.color) ||
      getDisplayName(value.colour) ||
      getDisplayName(value.material) ||
      ''
    )
  }

  return String(value)
}

export const getItemId = (value) => {
  if (!value) {
    return ''
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return String(value._id || value.id || value.color_id || value.colour_id || value.material_id || value.value || '').trim()
  }

  return String(value).trim()
}

export const isLikelyId = (value) => {
  const text = String(value || '').trim()

  return /^[a-f0-9]{24}$/i.test(text) || /^[0-9]+$/.test(text)
}

export const createNameMap = (items = []) => {
  return items.reduce((map, item) => {
    const id = getItemId(item)
    const name = getDisplayName(item)

    if (id && name) {
      map[id] = name
    }

    return map
  }, {})
}

export const resolveName = (value, nameMap = {}) => {
  if (!value) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveName(item, nameMap)).filter(Boolean).join(', ')
  }

  const id = getItemId(value)

  if (id && nameMap[id]) {
    return nameMap[id]
  }

  const displayName = getDisplayName(value)

  if (displayName && !isLikelyId(displayName)) {
    return displayName
  }

  return ''
}

export const getProductColorSource = (product = {}) => {
  return (
    product.color_id ||
    product.colour_id ||
    product.color ||
    product.colour ||
    product.color_name ||
    product.colour_name ||
    product.colorName ||
    product.colourName
  )
}

export const getProductColor = (product = {}, colorMap = {}) => {
  return resolveName(
    getProductColorSource(product),
    colorMap
  )
}

export const getProductMaterialSource = (product = {}) => {
  return (
    product.material_id ||
    product.material ||
    product.material_name ||
    product.materialName
  )
}

export const getProductMaterial = (product = {}, materialMap = {}) => {
  return resolveName(
    getProductMaterialSource(product),
    materialMap
  )
}

export const getProductImageUrl = (imagePath = '', image = '') => {
  if (!image || typeof image !== 'string') {
    return '/image/logo.png'
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('/')
  ) {
    return image
  }

  return imagePath ? `${imagePath}/${image}` : `/${image}`
}

export const mapProductCard = (product = {}, imagePath = '', colorMap = {}, materialMap = {}) => ({
  id: product._id || product.id || product.slug,
  title: product.name || product.title || 'Product',
  category: product.sub_sub_category_id?.name || product.sub_category_id?.name || product.parent_category_id?.name || product.category || '',
  oldPrice: product.actual_price || product.mrp || product.oldPrice || '0',
  newPrice: product.sale_price || product.price || product.newPrice || '0',
  image: getProductImageUrl(imagePath, product.image),
  color: getProductColor(product, colorMap),
  material: getProductMaterial(product, materialMap),
})

export const isEnabledValue = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value === 1
  }

  const text = String(value || '').trim().toLowerCase()

  return ['1', 'true', 'yes', 'y', 'on', 'active'].includes(text)
}

export const hasProductFlag = (product = {}, fieldNames = []) => {
  return fieldNames.some((fieldName) => isEnabledValue(product[fieldName]))
}

export const makePriceNumber = (value) => {
  return Number(String(value || 0).replace(/,/g, ''))
}

export const isOnSaleProduct = (product = {}) => {
  if (hasProductFlag(product, [
    'is_on_sale',
    'is_onsale',
    'on_sale',
    'onsale',
    'is_sale',
    'sale',
  ])) {
    return true
  }

  const actualPrice = makePriceNumber(product.actual_price || product.mrp || product.oldPrice)
  const salePrice = makePriceNumber(product.sale_price || product.new_price || product.newPrice)

  return actualPrice > 0 && salePrice > 0 && salePrice < actualPrice
}
