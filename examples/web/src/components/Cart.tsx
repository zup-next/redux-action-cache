import React, { FC } from 'react'
import Product from './Product'

interface Props {
  products: ProductComponent[],
  total: string,
  onCheckoutClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

const Cart: FC<Props> = ({ products, total, onCheckoutClicked }) => {
  const hasProducts = products.length > 0
  const nodes = hasProducts ? (
    products.map(product =>
      <Product
        title={product.title}
        price={product.price}
        quantity={product.quantity}
        key={product.id}
      />
    )
  ) : (
    <em>Please add some products to cart.</em>
  )

  return (
    <div>
      <h3>Your Cart</h3>
      <div>{nodes}</div>
      <p>Total: &#36;{total}</p>
      <button onClick={onCheckoutClicked} disabled={!hasProducts}>
        Checkout
      </button>
    </div>
  )
}

export default Cart
