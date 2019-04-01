import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import API from '../api/shop'
import { receiveProducts } from '../actions'
import * as types from '../actions/types'

function* getAllProducts() {
  try {
    const products = yield call(API.getProducts)
    yield put(receiveProducts(products))
  } catch (err) {
    console.log(err)
  }
}

function* mySaga() {
  yield takeLatest(types.LOAD_PRODUCTS, getAllProducts);
}

export default mySaga;