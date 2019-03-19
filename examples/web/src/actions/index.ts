import shop from '../api/shop'
import * as types from './types'

export const loadProducts = () => ({
  type: types.LOAD_PRODUCTS,
})

export const receiveProducts = (products: Products[]) => ({
  type: types.RECEIVE_PRODUCTS,
  products,
})

export const addToCart = (productId: number) => ({
  type: types.ADD_TO_CART,
  productId,
})

export const checkout = () => ({
  type: types.CHECKOUT_REQUEST
})
