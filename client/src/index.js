import 'materialize-css/dist/css/materialize.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { StripeProvider } from 'react-stripe-elements'

import reducers from './reducers'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(reducers, {}, applyMiddleware(reduxThunk))

ReactDOM.render(
  <Provider store={store}>
    <StripeProvider apiKey='pk_test_DAO8P8WngDQ7I4bl9Qfv2Q8Z'>
      <App />
    </StripeProvider>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
