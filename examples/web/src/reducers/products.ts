import { combineReducers } from 'redux'
import { RECEIVE_PRODUCTS, ADD_TO_CART, LOAD_PRODUCTS } from '../actions/types'

const request = (state: Record<any, any> = {}, action: ProductActions) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      return {
        ...state,
        state: 'loading',
      }
    default:
      return {
      ...state,
      state: 'ready',
    }
  }
}

const products = (state: Products, action: ProductActions) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        inventory: state.inventory - 1,
      }
    default:
      return state
  }
}

const byId = (state: Record<any, any> = {}, action: ProductActions) => {
  console.log(action)
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return {
        ...state,
        ...action.products.reduce((obj: Record<any, any>, product) => {
          obj[product.id] = product
          return obj
        }, {}),
        state: 'ready',
      }
    default:
      const { productId } = action
      if (productId) {
        return {
          ...state,
          [productId]: products(state[productId], action),
        }
      }
      return state
  }
}

const visibleIds = (state = [], action: ProductActions) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return action.products.map((product: Products) => product.id)
    default:
      return state
  }
}

export const getProduct = (state: ProductsState, id: number) => state.byId[id]

export const getVisibleProducts = (state: ProductsState) => state.visibleIds.map((id: number) => getProduct(state, id))

export default combineReducers({ byId, visibleIds, request } as any)
