import React from 'react'

interface Props {
  title: string,
  children: any,
}

const ProductsList = ({ title, children }: Props) => (
  <div>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
)

export default ProductsList
