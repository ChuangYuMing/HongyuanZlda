import appGlobal from './app-global.js'

const apiUrl = appGlobal.orderApiUrl

const callApi = (endpoint, config, url = apiUrl) => {
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
// const callApi = (endpoint, config) => {
//     return new Promise((resolve, reject) => {
//         return fetch(`${apiUrl}${endpoint}`, config)
//         .then(res => {
//           return res.json()
//         })
//         .then(obj => {
//             return Promise.resolve(obj)
//         })
//         .catch(e => {
//             console.log(e)
//             console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
//           })
//     })
// }
