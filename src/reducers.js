import { combineReducers } from 'redux'
// not use this, because using react-persist with immutable
// import { combineReducers } from 'redux-immutable'

import app from './modules/app'
import order from 'modules/order'
import login from 'modules/login'
import main from 'modules/main'
import inventory from 'modules/inventory'
import member from 'modules/member'
import menu from 'modules/menu'
import information from 'modules/information'
import { LOG_OUT } from 'modules/menu/action-types.js'

const appReducer = combineReducers({
  [app.constants.NAME]: app.reducer,
  [order.constants.NAME]: order.reducer,
  [login.constants.NAME]: login.reducer,
  [main.constants.NAME]: main.reducer,
  [member.constants.NAME]: member.reducer,
  [inventory.constants.NAME]: inventory.reducer,
  [menu.constants.NAME]: menu.reducer,
  [information.constants.NAME]: information.reducer
})

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
