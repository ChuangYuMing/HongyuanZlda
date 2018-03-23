import React, { PureComponent } from 'react'
import styles from './acc-filter-search.css'
import classNames from 'classnames/bind'
import { keyWordStockFilter, text_truncate } from 'tools/other.js'

let cx = classNames.bind(styles)
class AccountFilterSearch extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }
  updateData = (list, endIndex) => {
    console.log(list, endIndex)
    this.setState({
      list: list.slice(0, endIndex)
    })
  }
  render() {
    let { keyword, type, onClick, listRef } = this.props
    let { list } = this.state
    let items = list.map((item, index) => {
      let Account = item.get('Account')
      let Branch = item.get('Branch')
      let filterInfo = item.get('filterInfo')
      let firstHalf = filterInfo.get('firstHalf')
      let secondHalf = filterInfo.get('secondHalf')
      let key = filterInfo.get('key')
      // console.log(filterInfo, firstHalf, secondHalf)
      return (
        <li
          onClick={onClick}
          data-account={Account}
          data-branch={Branch}
          key={index}
        >
          <div className={cx('symbol-wrap')}>
            {firstHalf}
            <span className={cx('key')}>{key}</span>
            {secondHalf}
          </div>
        </li>
      )
    })
    return (
      <div className={cx('filter-wrap')}>
        <ul ref={listRef}>{items}</ul>
      </div>
    )
  }
}

export default AccountFilterSearch
