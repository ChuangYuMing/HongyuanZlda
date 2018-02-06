import React from 'react'
import styles from './temp.css'
import classNames from 'classnames/bind'
import { getCookie, setCookie } from 'tools/cookie.js'
import xml2js from 'xml2js'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import PropTypes from 'prop-types'
import image from 'static/image/icons/booking.png'
import image2 from 'static/image/ct2.png'

let cx = classNames.bind(styles)
class Temp extends React.Component {
  constructor() {
    super()
    var rows = []
    for (var i = 0; i < 10; i++) {
      rows.push(
        <Row key={i}>
          <Cell>a {i}</Cell>
          <Cell>b {i}</Cell>
        </Row>
      )
    }

    this.state = { rows }
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
  render() {
    var rows = []
    var cells

    for (var r = 0; r < 50; r++) {
      cells = []

      for (var c = 0; c < 20; c++) {
        cells.push(<Cell key={c}>{(r === 0 ? 'Header ' : 'Cell ') + c}</Cell>)
      }

      rows.push(<Row key={r}>{cells}</Row>)
    }
    return (
      <div className={cx('main')}>
        <span className={cx('test')} onClick={this.test}>
          login
        </span>
        <br />
        <img src={image} />
        <img src={image2} />
        <br />

        {/* <div style={{ width: '100%', height: '200px' }}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div> */}
      </div>
    )
  }
}

Temp.propTypes = {}

export default Temp
