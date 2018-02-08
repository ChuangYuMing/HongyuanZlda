import { createStore, applyMiddleware, compose } from 'redux'
import { autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import reducers from '../reducers'

const apiUrl = 'http://192.168.12.134:8080'

const store = createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(thunk.withExtraArgument(apiUrl)),
    // autoRehydrate({log:true}),
    autoRehydrate(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export { store, apiUrl }
