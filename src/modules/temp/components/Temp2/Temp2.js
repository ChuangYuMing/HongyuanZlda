import React from 'react'
import styles from './temp.scss'
import classNames from 'classnames/bind'
import { getCookie, setCookie } from 'tools/cookie.js'
import xml2js from 'xml2js'

let cx = classNames.bind(styles)
class Temp2 extends React.Component {
  constructor() {
    super()
    this.state = {
      data: {},
      account: 255428,
      symbol: '',
      volume: 0,
      price: '',
      orderType: '0',
      date: 20180131,
      items: []
    }
  }
  handleInputChange = e => {
    // console.log(this)
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (parseInt(value)) {
      this.setState({
        [name]: parseInt(value)
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }
  handleOrderAction = e => {
    let action = e.target.dataset.action
    let { account, symbol, volume, price, orderType, date } = this.state
    var formData = new FormData()
    formData.append('type', 0)
    formData.append('date', date)
    formData.append('lino', 0)
    formData.append('sbdm', 10)
    formData.append('comp', 6460)
    formData.append('sett', account)
    formData.append('mark', 'SEHK')
    formData.append('symb', symbol)
    formData.append('orls', action)
    formData.append('orpt', orderType)
    formData.append('orpr', price)
    formData.append('orsh', volume)
    fetch(`http://192.168.12.166:8080/api/order`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.text()
      })
      .then(xml => {
        console.log(xml)
        xml2js.parseString(xml, (err, result) => {
          console.log(result)
          let tastatus = result.TARoot.TAStatus[0].$
          let xbft = result.TARoot.XBFTXORD[0].$
          let tags = {
            _oxtp: '	交易類別',
            _oxtr: '	處理類別',
            domn: '	產業',
            date: '	 ⽇期',
            lino: '		盤別',
            txse: '	 交易序號',
            sbdm: '	副產業',
            comp: '	公司為⼤州內部券商編號',
            cosy: '	券商市場編號',
            sett: '		帳號',
            comm: '	委託書號',
            mark: '	市場',
            symb: '	股票代碼',
            txun: '	交易單位',
            curr: '		幣別',
            losh: '	買賣別',
            txpt: '		價格別',
            txpr: ' 		原始價格',
            txvp: '		有效價格',
            txsh: '		原始股數',
            txvs: '		有效股數',
            txcn: '		條件別',
            txtr: ' 		委託別',
            txcl: ' 		停損/利價',
            txcp: '	交易對⼿',
            txcy: '		交易幣別',
            txpp: '	交易預付',
            txpd: '	交易預收',
            txst: '		交易狀態',
            txex: '		成交股數',
            txem: '		成交價⾦',
            txsa: '		業代',
            txcl: '		櫃員',
            txme: '	⽤⼾端序號',
            txdp: '	部門',
            txad: '		位址',
            coer: '		強迫級別',
            prio: '	優先順序',
            grou: '		群組',
            clor: '		⼾端編號',
            toke: '		⽤⼾端⾃訂',
            suac: '		⼦帳號',
            dsig: '		 指定⽤參數',
            txvl: '		其它資訊⼀',
            txif: '	其它資訊⼆',
            txtx: '		其它資訊三',
            txmx: '		 其它資訊四',
            txxx: '		其它資訊五',
            txdt: '		最後異動⽇期',
            txtm: '		最後異動時間',
            txel: '		 錯誤等級',
            txen: '		錯誤序號',
            txec: '		錯誤原因',
            txea: '		錯誤處理',
            logs: '		編輯資訊',
            memo: '		備註',
            ttse: '		異動序號',
            tttp: '		本次交易類別',
            ttst: '		本次交易後委託單狀態',
            ttov: '		原始有效股數',
            ttva: '		異動後有效股數',
            ttor: '		原始有效價格',
            ttra: '		異動後有效價格'
          }
          let tags2 = {
            code: '日期',
            date: '日期',
            elapse: '日期',
            intf: '日期',
            lang: '日期',
            oper: '日期',
            syst: '日期',
            time: '時間'
          }
          let items = []
          for (const key in tags) {
            // let item = `${key}: ${xbft[key]}, ${tags[key]}`
            let item = {
              tag: key,
              value: xbft[key],
              name: tags[key]
            }
            items.push(item)
          }
          this.setState({
            items
          })
          console.log(tastatus)
          console.log(xbft)
        })
      })
  }
  render() {
    let items = this.state.items
    let output = items.map((item, index) => {
      let { tag, value, name } = item
      return (
        <div key={index} className={cx('item')}>
          <span className={cx('tag')}>{tag}: </span>
          <span className={cx('value')}>{value} </span>
          <span className={cx('name')}>{name}</span>
        </div>
      )
    })
    return (
      <div className={cx('main')}>
        <div className={cx('order-wrap')}>
          <span>帳號：</span>
          <input
            type="text"
            name="account"
            value={this.state.account}
            onChange={this.handleInputChange}
            ref="account"
          />
          <span>股票：</span>
          <input
            type="text"
            name="symbol"
            value={this.state.symbol}
            onChange={this.handleInputChange}
            ref="symbol"
          />
          <span>數量：</span>
          <input
            type="text"
            name="volume"
            value={this.state.volume}
            onChange={this.handleInputChange}
            ref="volume"
          />
          <span>價格：</span>
          <input
            type="text"
            name="price"
            value={this.state.price}
            onChange={this.handleInputChange}
            ref="price"
          />
          <span>交易種類：</span>
          <select
            name="orderType"
            value={this.state.orderType}
            onChange={this.handleInputChange}
          >
            <option key="1" value="0">
              現價
            </option>
            <option key="2" value="E">
              增強限價盤
            </option>
          </select>
          <div className={cx('action')} onClick={this.handleOrderAction}>
            <span data-action="1" className={cx('btn', 'buy')}>
              買
            </span>
            <span data-action="2" className={cx('btn', 'sell')}>
              賣
            </span>
          </div>
        </div>
        <div className={cx('output')}>{output}</div>
      </div>
    )
  }
}

export default Temp2

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
      method: 'GET'
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
