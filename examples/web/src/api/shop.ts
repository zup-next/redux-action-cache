import products from './products.json'

const TIMEOUT = 2000

export default {
  getProducts: () => new Promise(resolve => setTimeout(() => resolve(products), TIMEOUT)),
  buyProducts: () => new Promise(resolve => setTimeout(() => resolve(), TIMEOUT)),
}
