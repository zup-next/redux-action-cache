import React, { FC } from 'react'

interface Props {
  price: number,
  quantity: number,
  title: string,
}

const Product: FC<Props> = ({ price, quantity, title }) => (
  <div>
    {title} - &#36;{price}{quantity ? ` x ${quantity}` : null}
  </div>
)

export default Product
