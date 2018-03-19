import { combineReducers } from 'redux'
// not use this, because using react-persist with immutable
// import { combineReducers } from 'redux-immutable'

import app from './modules/app'
import order from 'modules/order'
import login from 'modules/login'
import main from 'modules/main'
import inventory from 'modules/inventory'

const manipulator = combineReducers({
  [app.constants.NAME]: app.reducer,
  [order.constants.NAME]: order.reducer,
  [login.constants.NAME]: login.reducer,
  [main.constants.NAME]: main.reducer,
  [inventory.constants.NAME]: inventory.reducer
})

export default manipulator
