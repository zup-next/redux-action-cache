import React, { FC } from 'react'

interface Props {
  title: string,
  children: any,
}

const ProductsList: FC<Props> = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
)

export default ProductsList
