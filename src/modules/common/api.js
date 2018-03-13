import appGlobal from './app-global.js'

const callApi = (endpoint, config, url) => {
  if (!url) {
    url = appGlobal.orderApiUrl
  }
  return fetch(`${url}${endpoint}`, config)
    .then(res => {
      return res.json()
    })
    .then(obj => {
      return Promise.resolve(obj)
    })
    .catch(e => {
      console.log(e)
      console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
    })
}
export { callApi }
