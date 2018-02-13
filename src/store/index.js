import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import reducers from '../reducers'
import appGlobal from 'modules/common/app-global.js'
import immutableTransform from 'redux-persist-transform-immutable'

const apiUrl = appGlobal.apiUrl

const persistConfig = {
  transforms: [immutableTransform()],
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
