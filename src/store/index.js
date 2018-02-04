import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import reducers from '../reducers'

const apiUrl = 'http://192.168.12.134:8080'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app']
}
const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
  persistedReducer,
  undefined,
  compose(
    applyMiddleware(thunk.withExtraArgument(apiUrl)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
const persistor = persistStore(store)

export { store, persistor }
