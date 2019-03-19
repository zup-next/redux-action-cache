import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers'
import App from './containers/App'
import CartContainer from './containers/CartContainer'
import ProductsContainer from './containers/ProductsContainer'
import mySaga from './sagas'
import cacheManager from './cache'

const sagaMiddleware = createSagaMiddleware()
const middleware = [ cacheManager.getMiddleware(), sagaMiddleware ]

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware)),
)

sagaMiddleware.run(mySaga)

render(
  <Provider store={store}>
    <Router>
      <Switch>
          <Route path="/" exact={true} component={App} />
          <Route path="/cart" component={CartContainer} />
          <Route path="/products" component={ProductsContainer} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'))
