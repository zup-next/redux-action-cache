declare interface Products {
  id: number,
  title: string,
  price: number,
  inventory: number,
}

interface CartActions {
  type: string,
  productId: number,
  cart: any,
}

interface CartState {
  addedIds: number[],
  quantityById: Record<number, number>,
}

interface ProductActions {
  type: string,
  products: Products[],
  productId: number,
}

interface ProductsState {
  byId: Record<any, any>,
  visibleIds: number[],
}

interface ProductComponent {
  id: number,
  title: string,
  price: number,
  quantity: number,
}
