import {
  ADD_TO_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_FAILURE,
} from '../actions/types'

const initialState: CartState = {
  addedIds: [],
  quantityById: {},
}

const addedIds = (state = initialState.addedIds, action: CartActions) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { productId } = action
      if (state.indexOf(productId) !== -1) {
        return state
      }
      return [ ...state, productId ]
    default:
      return state
  }
}

const quantityById = (state = initialState.quantityById, action: CartActions) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { productId } = action
      return {
        ...state,
        [productId]: (state[productId] || 0) + 1,
      }
    default:
      return state
  }
}

export const getQuantity = (state: CartState, productId: number) => state.quantityById[productId] || 0

export const getAddedIds = (state: CartState) => state.addedIds

const cart = (state: CartState = initialState, action: CartActions) => {
  switch (action.type) {
    case CHECKOUT_REQUEST:
      return initialState
    case CHECKOUT_FAILURE:
      return action.cart
    default:
      return {
        addedIds: addedIds(state.addedIds, action),
        quantityById: quantityById(state.quantityById, action),
      }
  }
}

export default cart
