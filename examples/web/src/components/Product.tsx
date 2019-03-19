import React from 'react'

interface Props {
  price: number,
  quantity: number,
  title: string,
}

const Product = ({ price, quantity, title }: Props) => (
  <div>
    {title} - &#36;{price}{quantity ? ` x ${quantity}` : null}
  </div>
)

export default Product
