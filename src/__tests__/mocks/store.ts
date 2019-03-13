import { createStore, applyMiddleware } from 'redux'
import cacheManager from './cache-manager'

type Action = { type: string, data?: any }

type ReducerMap = { [key:string]: Function }

const NOT_LOADED = 'NOT_LOADED'
const LOADING = 'LOADING'
const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'

const initialState = {
  balance: { status: NOT_LOADED, data: null },
  userData: { status: NOT_LOADED, data: null, saveStatus: null },
  products: { status: NOT_LOADED, data: null },
  order: { status: NOT_LOADED, createStatus: null },
}

const reducer = (state = initialState, action: Action) => {
  const map: ReducerMap = {
    'BALANCE/LOAD': () => ({ ...state, balance: { ...state.balance, status: LOADING } }),
    'BALANCE/ERROR': () => ({ ...state, balance: { ...state.balance, status: ERROR } }),
    'BALANCE/SUCCESS': ({ data }: Action) => ({ ...state, balance: { status: SUCCESS, data } }),
    'USER_DATA/LOAD': () => ({ ...state, userData: { ...state.userData, status: LOADING } }),
    'USER_DATA/ERROR': () => ({ ...state, userData: { ...state.userData, status: ERROR } }),
    'USER_DATA/SUCCESS': ({ data }: Action) => ({ ...state, userData: { ...state.userData, status: SUCCESS, data } }),
    'USER_DATA/SAVE': () => ({ ...state, userData: { ...state.userData, saveStatus: LOADING } }),
    'USER_DATA/SAVE_ERROR': () => ({ ...state, userData: { ...state.userData, saveStatus: ERROR } }),
    'USER_DATA/SAVE_SUCCESS': () => ({ ...state, userData: { ...state.userData, saveStatus: SUCCESS } }),
    'PRODUCTS/LOAD': () => ({ ...state, products: { ...state.products, status: LOADING } }),
    'PRODUCTS/ERROR': () => ({ ...state, products: { ...state.products, status: ERROR } }),
    'PRODUCTS/SUCCESS': ({ data }: Action) => ({ ...state, products: { status: SUCCESS, data } }),
    'ORDER/LOAD': () => ({ ...state, userData: { ...state.userData, status: LOADING } }),
    'ORDER/ERROR': () => ({ ...state, userData: { ...state.userData, status: ERROR } }),
    'ORDER/SUCCESS': ({ data }: Action) => ({ ...state, userData: { ...state.userData, status: SUCCESS, data } }),
    'ORDER/CREATE': () => ({ ...state, userData: { ...state.userData, createStatus: LOADING } }),
    'ORDER/CREATE_ERROR': () => ({ ...state, userData: { ...state.userData, createStatus: ERROR } }),
    'ORDER/CREATE_SUCCESS': () => ({ ...state, userData: { ...state.userData, createStatus: SUCCESS } }),
  }

  const fn = map[action.type]
  return fn ? fn(action) : state
}

export default () => createStore(applyMiddleware(reducer, cacheManager.getMiddleware()))
