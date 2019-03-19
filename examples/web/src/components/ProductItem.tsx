import React from 'react'
import Product from './Product'

interface Props {
  product: Products,
  onAddToCartClicked: any,
}

const ProductItem = ({ product, onAddToCartClicked }: Props) => (
  <div style={{ marginBottom: 20 }}>
    <Product
      title={product.title}
      price={product.price}
      quantity={product.inventory} />
    <button
      onClick={onAddToCartClicked}
      disabled={product.inventory <= 0}>
      {product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
    </button>
  </div>
)

export default ProductItem
