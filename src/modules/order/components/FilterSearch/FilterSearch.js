import React, { Component } from 'react'
import styles from './filter-search.css'
import classNames from 'classnames/bind'
import { keyWordStockFilter, text_truncate } from 'tools/other.js'
import { Observable } from 'rxjs'

let cx = classNames.bind(styles)
class FilterSearch extends Component {
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
    let listLength = dataList.length
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
      FIRST_ITEM_FILTER_BOUND_TOP = LAST_ITEM_FILTER_BOUND_TOP - 178
    }
    caceluteHeight()

    let listWrap = document.querySelector(`.${styles['filter-wrap']} ul`)
    let keyDowns = Observable.fromEvent(document, 'keydown')
    let resize = Observable.fromEvent(window, 'resize')
    let filterWrap = document.getElementById('orderStockFilter')

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
          filterWrap.scrollTop = nextFocusItem.offsetTop - 178
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
        let { symbol, isprofessional } = focusItem.dataset

        this.props.onEnter(symbol, isprofessional)
      }
    })
  }
  render() {
    console.log('render')
    let { keyword, type, onClick, listRef } = this.props
    let { list } = this.state
    let items = list.map((item, index) => {
      let { Symbol, SName, filterInfo, Professional } = item
      let { firstHalf, secondHalf, key } = filterInfo
      let SNameArr = SName.split('/')
      SName = SNameArr.length > 1 ? SNameArr[1] : SName
      return (
        <li
          onClick={onClick}
          data-symbol={Symbol}
          data-isprofessional={Professional}
          key={index}
        >
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
