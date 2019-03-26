import { createStore, applyMiddleware } from 'redux'

export const NOT_LOADED = 'NOT_LOADED'
export const LOADING = 'LOADING'
export const ERROR = 'ERROR'
export const SUCCESS = 'SUCCESS'

type status = 'NOT_LOADED' | 'LOADING' | 'ERROR' | 'SUCCESS'

interface ResourceState {
  status: status
  data: null | any
}

interface UserData extends ResourceState {
  saveStatus: status
}

interface Order {
  createStatus: status
  status: status
}

interface initialState {
  balance: ResourceState
  userData: UserData
  products: ResourceState
  order: Order
}

const initialState: initialState = {
  balance: { status: NOT_LOADED, data: null },
  userData: { status: NOT_LOADED, data: null, saveStatus: NOT_LOADED },
  products: { status: NOT_LOADED, data: null },
  order: { status: NOT_LOADED, createStatus: NOT_LOADED },
}

const reducer = (state = initialState, action: string) => {
  const map = {
    'BALANCE/LOAD': () => ({ ...state, balance: { ...state.balance, status: LOADING } }),
    'BALANCE/ERROR': () => ({ ...state, balance: { ...state.balance, status: ERROR } }),
    'BALANCE/SUCCESS': ({ data }: any) => ({ ...state, balance: { status: SUCCESS, data } }),
    'USER_DATA/LOAD': () => ({ ...state, userData: { ...state.userData, status: LOADING } }),
    'USER_DATA/ERROR': () => ({ ...state, userData: { ...state.userData, status: ERROR } }),
    'USER_DATA/SUCCESS': ({ data }: any) => ({ ...state, userData: { ...state.userData, status: SUCCESS, data } }),
    'USER_DATA/SAVE': () => ({ ...state, userData: { ...state.userData, saveStatus: LOADING } }),
    'USER_DATA/SAVE_ERROR': () => ({ ...state, userData: { ...state.userData, saveStatus: ERROR } }),
    'USER_DATA/SAVE_SUCCESS': () => ({ ...state, userData: { ...state.userData, saveStatus: SUCCESS } }),
    'PRODUCTS/LOAD': () => ({ ...state, products: { ...state.products, status: LOADING } }),
    'PRODUCTS/ERROR': () => ({ ...state, products: { ...state.products, status: ERROR } }),
    'PRODUCTS/SUCCESS': ({ data }: any) => ({ ...state, products: { status: SUCCESS, data } }),
    'ORDER/LOAD': () => ({ ...state, order: { ...state.order, status: LOADING } }),
    'ORDER/ERROR': () => ({ ...state, order: { ...state.order, status: ERROR } }),
    'ORDER/SUCCESS': ({ data }: any) => ({ ...state, order: { ...state.order, status: SUCCESS, data } }),
    'ORDER/CREATE': () => ({ ...state, order: { ...state.order, createStatus: LOADING } }),
    'ORDER/CREATE_ERROR': () => ({ ...state, order: { ...state.order, createStatus: ERROR } }),
    'ORDER/CREATE_SUCCESS': () => ({ ...state, order: { ...state.order, createStatus: SUCCESS } }),
  }

  const fn = map[action.type]
  return fn ? fn(action) : state
}

export default (cacheManager) => createStore(reducer, applyMiddleware(cacheManager.getMiddleware()))
