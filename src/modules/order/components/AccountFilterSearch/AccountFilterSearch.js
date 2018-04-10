import React, { Component } from 'react'
import styles from './acc-filter-search.css'
import classNames from 'classnames/bind'
import { keyWordStockFilter, text_truncate } from 'tools/other.js'
import { Observable } from 'rxjs'

let cx = classNames.bind(styles)
class AccountFilterSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      listLength: 0
    }
    this.focusItemIndex = 1
    this.updateList = false
  }
  updateData = (list, endIndex, type = '') => {
    let dataList = list.slice(0, endIndex)
    let listLength = dataList.size
    this.updateList = true
    this.updateType = type
    this.setState({
      list: dataList,
      listLength
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.updateList) {
      this.updateList = false
      return true
    }
    return false
  }
  componentDidUpdate() {
    let listWrap = document.querySelector(`.${styles['filter-wrap']} ul`)
    let focusItem = listWrap.querySelector(
      `li:nth-child(${this.focusItemIndex})`
    )
    if (focusItem) {
      focusItem.classList.remove(styles['focus'])
    }
    if (this.updateType === 'lazyLoad') {
      this.focusItemIndex = this.focusItemIndex + 1
    } else {
      this.focusItemIndex = 1
    }

    let nextFocusItem = listWrap.querySelector(
      `li:nth-child(${this.focusItemIndex})`
    )
    if (nextFocusItem) {
      nextFocusItem.classList.add(styles['focus'])
    }
  }
  componentWillUnmount() {
    this.enter.unsubscribe()
  }
  componentDidMount() {
    let LAST_ITEM_FILTER_BOUND_TOP
    let FIRST_ITEM_FILTER_BOUND_TOP
    let caceluteHeight = () => {
      let clientHeight = document.body.clientHeight
      LAST_ITEM_FILTER_BOUND_TOP = clientHeight - 131
      FIRST_ITEM_FILTER_BOUND_TOP = LAST_ITEM_FILTER_BOUND_TOP - 133
    }
    caceluteHeight()

    let listWrap = document.querySelector(`.${styles['filter-wrap']} ul`)
    let keyDowns = Observable.fromEvent(document, 'keydown')
    let resize = Observable.fromEvent(window, 'resize')
    let filterWrap = document.getElementById('accountFilter')

    let windowResize = resize.debounceTime(500).subscribe(e => {
      caceluteHeight()
    })

    let downByKey = keyDowns.filter(e => e.keyCode === 40).subscribe(e => {
      if (this.focusItemIndex < this.state.listLength) {
        let focusItem = listWrap.querySelector(
          `li:nth-child(${this.focusItemIndex})`
        )

        let nextFocusItem = listWrap.querySelector(
          `li:nth-child(${this.focusItemIndex + 1})`
        )
        focusItem.classList.remove(styles['focus'])
        nextFocusItem.classList.add(styles['focus'])
        if (
          nextFocusItem.getBoundingClientRect().top >=
          LAST_ITEM_FILTER_BOUND_TOP
        ) {
          filterWrap.scrollTop = nextFocusItem.offsetTop - 133
        }
        this.focusItemIndex = this.focusItemIndex + 1
      }
    })
    let upByKey = keyDowns.filter(e => e.keyCode === 38).subscribe(e => {
      if (this.focusItemIndex > 1) {
        let focusItem = listWrap.querySelector(
          `li:nth-child(${this.focusItemIndex})`
        )
        let nextFocusItem = listWrap.querySelector(
          `li:nth-child(${this.focusItemIndex - 1})`
        )
        focusItem.classList.remove(styles['focus'])
        nextFocusItem.classList.add(styles['focus'])
        if (
          nextFocusItem.getBoundingClientRect().top <=
          FIRST_ITEM_FILTER_BOUND_TOP
        ) {
          filterWrap.scrollTop = nextFocusItem.offsetTop
        }
        this.focusItemIndex = this.focusItemIndex - 1
      }
    })

    this.enter = keyDowns.filter(e => e.keyCode === 13).subscribe(e => {
      let focusItem = listWrap.querySelector(
        `li:nth-child(${this.focusItemIndex})`
      )
      if (focusItem) {
        let { account, branch } = focusItem.dataset

        this.props.onEnter(account, branch)
      }
    })
  }
  render() {
    let { keyword, type, onClick, listRef } = this.props
    let { list } = this.state
    let items = list.map((item, index) => {
      let Account = item.get('Account')
      let Branch = item.get('Branch')
      let CName = item.get('CName')
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
            {CName}
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
