import React from 'react'
import styles from './temp.scss'
import classNames from 'classnames/bind'
import { getCookie, setCookie } from 'tools/cookie.js'
import xml2js from 'xml2js'

let cx = classNames.bind(styles)
function Temp({ onTest, test }) {
  return (
    <div>
      <span onClick={login}>login</span>
      <br />
      <br />
      <br />
      <span onClick={testapi}>test</span>
      <br />
      <br />
      <br />
      <span onClick={c}>logout</span>
      <br />
      <br />
      <span onClick={d}>XXXX</span>
    </div>
  )
}

export default Temp

const login = () => {
  fetch(
    `http://203.69.48.29/redirect_dgw/BAServlet?https://192.168.200.85:8080/dachang/BAServlet?&url=login&TAAccountMode=1&comp=6460&idno=A123456789&sett=&pass=12345678&tapage=xml`,
    {
      method: 'GET'
    }
  )
    .then(res => {
      let header = res.headers
      let apex_session_id = header.get('apex_session_id')
      let apex_token = header.get('apex_token')
      window.localStorage.setItem('apex_session_id', apex_session_id)
      window.localStorage.setItem('apex_token', apex_token)
      return res.text()
    })
    .then(xml => {
      console.log(xml)
      xml2js.parseString(xml, (err, result) => {
        console.log(result)
        // 取得回傳xml裡的的sid token
        let sid = result.TARoot.TAUser[0]['$'].sid
        // 將sid token 存在localstorage
        window.localStorage.setItem('sid', sid)
      })
    })
}
const testapi = () => {
  //每次發request，從localstorage取的sid token，以post 作為參數
  let apex_session_id = window.localStorage.getItem('apex_session_id')
  let apex_token = window.localStorage.getItem('apex_token')
  var myHeaders = new Headers()
  myHeaders.append('Apex-Session-Id', apex_session_id)
  myHeaders.append('Apex-Token', apex_token)
  let sid = window.localStorage.getItem('sid')
  fetch(
    `http://203.69.48.29/redirect_dgw/BAServlet?https://192.168.200.85:8080/dachang/BAServlet?&url=GetLoginResp&sid=${sid}`,
    {
      method: 'GET',
      header: myHeaders
    }
  )
    .then(res => {
      return res.text()
    })
    .then(obj => {
      console.log(obj)
    })
}
const c = () => {
  let sid = window.localStorage.getItem('sid')
  fetch(
    `http://203.69.48.29/redirect_dgw/BAServlet?https://192.168.200.85:8080/dachang/BAServlet?&url=logout&sid=${sid}`,
    {
      method: 'get'
    }
  )
    .then(res => {
      return res.json()
    })
    .then(obj => {})
}

const d = () => {
  var formData = new FormData()
  formData.append('id', 123)
  fetch(`http://192.168.12.166:8080/api/order`, {
    method: 'POST',
    body: formData
  })
    .then(res => {
      console.log(res)
      return res.json()
    })
    .then(obj => {})
}

// const d = () => {
//   var formData = new FormData()
//   formData.append('id', 123)
//   let aa = {
//     id: '123'
//   }
//   fetch(`http://192.168.12.166:8080/api/order`, {
//     method: 'POST',
//     body: JSON.stringify(aa)
//   })
//     .then(res => {
//       console.log(res)
//       return res.json()
//     })
//     .then(obj => {})
// }

// const d = () => {
//   let aa = {
//     id: '123'
//   }
//   fetch(`http://192.168.12.128:8080/api/order`, {
//     method: 'POST',
//     body: 'id=123'
//   })
//     .then(res => {
//       console.log(res)
//       return res.json()
//     })
//     .then(obj => {})
// }
