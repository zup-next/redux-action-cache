import React from 'react'
import { Link } from 'react-router-dom'

const App = () => (
  <div>
    <h2>Shopping Cart Example</h2>
    <hr/>
    <Link to="/products">Go to Products page</Link>
    <hr/>
    <Link to="/cart">Go to Your Cart</Link>
  </div>
)

export default App
