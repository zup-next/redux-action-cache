import { createStore, applyMiddleware } from 'redux'

export const NOT_LOADED = 'NOT_LOADED'
export const LOADING = 'LOADING'
export const ERROR = 'ERROR'
export const SUCCESS = 'SUCCESS'

const initialState = {
  balance: { status: NOT_LOADED, data: null },
  userData: { status: NOT_LOADED, data: null, saveStatus: null },
  products: { status: NOT_LOADED, data: null },
  order: { status: NOT_LOADED, createStatus: null },
}

const reducer = (state = initialState, action) => {
  const map = {
    'BALANCE/LOAD': () => ({ ...state, balance: { ...state.balance, status: LOADING } }),
    'BALANCE/ERROR': () => ({ ...state, balance: { ...state.balance, status: ERROR } }),
    'BALANCE/SUCCESS': ({ data }) => ({ ...state, balance: { status: SUCCESS, data } }),
    'USER_DATA/LOAD': () => ({ ...state, userData: { ...state.userData, status: LOADING } }),
    'USER_DATA/ERROR': () => ({ ...state, userData: { ...state.userData, status: ERROR } }),
    'USER_DATA/SUCCESS': ({ data }) => ({ ...state, userData: { ...state.userData, status: SUCCESS, data } }),
    'USER_DATA/SAVE': () => ({ ...state, userData: { ...state.userData, saveStatus: LOADING } }),
    'USER_DATA/SAVE_ERROR': () => ({ ...state, userData: { ...state.userData, saveStatus: ERROR } }),
    'USER_DATA/SAVE_SUCCESS': () => ({ ...state, userData: { ...state.userData, saveStatus: SUCCESS } }),
    'PRODUCTS/LOAD': () => ({ ...state, products: { ...state.products, status: LOADING } }),
    'PRODUCTS/ERROR': () => ({ ...state, products: { ...state.products, status: ERROR } }),
    'PRODUCTS/SUCCESS': ({ data }) => ({ ...state, products: { status: SUCCESS, data } }),
    'ORDER/LOAD': () => ({ ...state, order: { ...state.order, status: LOADING } }),
    'ORDER/ERROR': () => ({ ...state, order: { ...state.order, status: ERROR } }),
    'ORDER/SUCCESS': ({ data }) => ({ ...state, order: { ...state.order, status: SUCCESS, data } }),
    'ORDER/CREATE': () => ({ ...state, order: { ...state.order, createStatus: LOADING } }),
    'ORDER/CREATE_ERROR': () => ({ ...state, order: { ...state.order, createStatus: ERROR } }),
    'ORDER/CREATE_SUCCESS': () => ({ ...state, order: { ...state.order, createStatus: SUCCESS } }),
  }

  const fn = map[action.type]
  return fn ? fn(action) : state
}

export default (cacheManager) => createStore(reducer, applyMiddleware(cacheManager.getMiddleware()))
