import React from 'react'
import styles from './temp.css'
import classNames from 'classnames/bind'
import { getCookie, setCookie } from 'tools/cookie.js'
import xml2js from 'xml2js'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import PropTypes from 'prop-types'
import image from 'static/image/icons/booking.png'
import image2 from 'static/image/ct2.png'
import { fromJS } from 'immutable'

let cx = classNames.bind(styles)
class Temp extends React.PureComponent {
  constructor() {
    super()
    this.times = 0
    this.toggle = false
    this.state = {
      count: 0,
      data: fromJS({
        count: 0,
        school: {
          high: 'sc1',
          moddle: 'sc2',
          friends: [1, 2, 3, 4],
          test: [{ a: 1 }, { a: 2 }]
        }
      })
    }
    // console.log(this.state)
    // var rows = []
    // for (var i = 0; i < 10; i++) {
    //   rows.push(
    //     <Row key={i}>
    //       <Cell>a {i}</Cell>
    //       <Cell>b {i}</Cell>
    //     </Row>
    //   )
    // }

    // this.state = { rows }
  }
  test = () => {
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
  imtest = () => {
    let c = this.state.data
    console.log(c.toJS())
    // this.setState({
    //   count: c,
    //   school: {
    //     high: 'sc2'
    //   }
    // })
    // let tt = this.state.data.getIn(['school', 'moddle'])
    // console.log(tt)
    if (!this.toggle) {
      this.setState(({ data }) => {
        let newfriend = data.getIn(['school', 'friends'])
        return {
          data: data.setIn(['school', 'test', 1, 'a'], 5)
        }
      })
      this.toggle = true
    } else {
      this.setState(({ data }) => {
        let newfriend = data.getIn(['school', 'friends'])
        return {
          data: data.setIn(['school', 'test', 1, 'a'], 5)
        }
      })
    }
  }
  // shouldComponentUpdate(nextProp, nextState) {
  //   let a = this.state
  //   console.log(a.data === nextState.data)
  //   return true
  // }
  render() {
    var rows = []
    var cells
    this.times = this.times + 1
    for (var r = 0; r < 50; r++) {
      cells = []

      for (var c = 0; c < 20; c++) {
        cells.push(<Cell key={c}>{(r === 0 ? 'Header ' : 'Cell ') + c}</Cell>)
      }

      rows.push(<Row key={r}>{cells}</Row>)
    }
    console.log(this.state)
    let data = this.state.data
    return (
      <div className={cx('main')}>
        {/* <span className={cx('test')} onClick={this.test}>
          login
        </span> */}
        {/* <br />
        <img src={image} />
        <img src={image2} />
        <br /> */}
        <span>render: {this.times}</span>
        <span>count: {data.get('count')}</span>
        <button onClick={this.imtest}>test</button>
        {/* <div style={{ width: '100%', height: '200px' }}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div> */}
      </div>
    )
  }
}

Temp.propTypes = {}

export default Temp
