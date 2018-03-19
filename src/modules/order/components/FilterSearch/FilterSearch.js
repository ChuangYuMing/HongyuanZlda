import React, { PureComponent } from 'react'
import styles from './filter-search.css'
import classNames from 'classnames/bind'
import { keyWordStockFilter, text_truncate } from 'tools/other.js'

let cx = classNames.bind(styles)
class FilterSearch extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }
  updateData = (list, endIndex) => {
    this.setState({
      list: list.slice(0, endIndex)
    })
  }
  render() {
    let { keyword, type, onClick, listRef } = this.props
    let { list } = this.state
    let items = list.map((item, index) => {
      let { Symbol, SName, filterInfo } = item
      let { firstHalf, secondHalf, key } = filterInfo
      return (
        <li onClick={onClick} data-symbol={Symbol} key={index}>
          <div className={cx('symbol-wrap')}>
            {firstHalf}
            <span className={cx('key')}>{key}</span>
            {secondHalf}
          </div>
          <span title={SName}>{text_truncate(SName, 15)}</span>
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

export default FilterSearch
