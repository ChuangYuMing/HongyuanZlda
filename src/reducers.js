import { combineReducers } from 'redux'
import app from './modules/app'
import order from 'modules/order'

const manipulator = combineReducers({
  [app.constants.NAME]: app.reducer,
  [order.constants.NAME]: order.reducer
})

export default manipulator
