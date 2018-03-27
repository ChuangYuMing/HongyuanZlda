import * as types from './action-types'

export const logout = () => {
  return {
    type: types.LOG_OUT
  }
}

export const updateFilterSetting = (tag, value) => {
  return {
    type: types.UPDATE_FILTER_SETTING,
    tag,
    value
  }
}

export const updateTodaySymbol = data => {
  return {
    type: types.UPDATE_TODAY_SYMBOL,
    data
  }
}

export const setTodaySymbol = data => {
  return {
    type: types.SET_TODAY_SYMBOL,
    data
  }
}
