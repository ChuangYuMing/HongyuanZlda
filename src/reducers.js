import { combineReducers } from 'redux'
// not use this, because using react-persist with immutable
// import { combineReducers } from 'redux-immutable'

import app from './modules/app'
import order from 'modules/order'
import login from 'modules/login'

const manipulator = combineReducers({
  [app.constants.NAME]: app.reducer,
  [order.constants.NAME]: order.reducer,
  [login.constants.NAME]: login.reducer
})

export default manipulator
