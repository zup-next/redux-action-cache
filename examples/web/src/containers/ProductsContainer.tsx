import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart, loadProducts } from '../actions'
import { getVisibleProducts } from '../reducers/products'
import ProductItem from '../components/ProductItem'
import ProductsList from '../components/ProductsList'

interface Props {
  products: Products[],
  addToCart: any,
  loadProducts: () => void,
  loading: boolean,
}

const ProductsContainer: FC<Props> = (props) => {

  const { products, addToCart, loading } = props

  useEffect(() => {
    const { loadProducts } = props
    loadProducts()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <Link to="/cart">Go to Your Cart</Link>
      <ProductsList title="Products">
        {products.map((product: Products) =>
          <ProductItem
            key={product.id}
            product={product}
            onAddToCartClicked={() => addToCart(product.id)} />
        )}
      </ProductsList>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  products: getVisibleProducts(state.products),
  loading: state.products.request.state === 'loading'
})

export default connect(
  mapStateToProps,
  { addToCart, loadProducts }
)(ProductsContainer)
