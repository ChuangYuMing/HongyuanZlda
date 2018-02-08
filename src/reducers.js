import { combineReducers } from 'redux'
import app from './modules/app'

const manipulator = combineReducers({
  [app.constants.NAME]: app.reducer
})

export default manipulator
