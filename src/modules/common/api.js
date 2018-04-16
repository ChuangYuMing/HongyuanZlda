import appGlobal from './app-global.js'
import { store } from 'store/index.js'
import { logout } from 'modules/menu/actions.js'

const callApi = (endpoint, config, url) => {
  if (!url) {
    url = appGlobal.orderApiUrl
  }
  return fetch(`${url}${endpoint}`, config)
    .then(res => {
      return res.json()
    })
    .then(obj => {
      if (obj.hasOwnProperty('373')) {
        console.log('異常！', obj)
        if (obj['373'] === '98') {
          alert(`Token驗證錯誤，請重新登入！`)
          store.dispatch(logout())
          window.location.replace('/order/login')
        } else {
          console.log('123123')
          alert(`系統異常！ ${obj['58'] ? obj['58'] : ''}`)
        }
        return
      }

      return Promise.resolve(obj)
    })
    .catch(e => {
      console.log(e)
      console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
    })
}
export { callApi }
