import React, { FC } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { checkout } from '../actions'
import { getTotal, getCartProducts } from '../reducers'
import Cart from '../components/Cart'

interface Props {
  products: ProductComponent[],
  total: string,
  checkout: (products: ProductComponent[]) => void,
}

const CartContainer: FC<Props> = ({ products, total, checkout }) => (
  <div>
    <Link to="/products">Go to Products Page</Link>
    <Cart
      products={products}
      total={total}
      onCheckoutClicked={() => checkout(products)}
    />
  </div>
)

const mapStateToProps = (state: any) => ({
  products: getCartProducts(state),
  total: getTotal(state),
})

export default connect(
  mapStateToProps,
  { checkout }
)(CartContainer)
