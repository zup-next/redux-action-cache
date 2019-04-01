import { combineReducers } from 'redux'
import cart, * as fromCart from './cart'
import products, * as fromProducts from './products'

export default combineReducers({ cart, products } as any)

const getAddedIds = (state: Record<any, any>) => fromCart.getAddedIds(state.cart)
const getQuantity = (state: Record<any, any>, id: number) => fromCart.getQuantity(state.cart, id)
const getProduct = (state: Record<any, any>, id: number) => fromProducts.getProduct(state.products, id)

export const getTotal = (state: Record<any, any>) =>
  getAddedIds(state)
    .reduce((total, id) => total + getProduct(state, id).price * getQuantity(state, id), 0)
    .toFixed(2)

export const getCartProducts = (state: Record<any, any>) =>
  getAddedIds(state).map(id => ({
    ...getProduct(state, id),
    quantity: getQuantity(state, id),
  }))
