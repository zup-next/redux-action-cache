import { LOAD_PRODUCTS, CHECKOUT_REQUEST } from '../actions/types'

export default {
  include: [ LOAD_PRODUCTS ],
  exclude: [],
  invalidations: [
    { invalidatedBy: CHECKOUT_REQUEST, invalidated: LOAD_PRODUCTS },
  ],
}
