import React, { PureComponent } from 'react'
import styles from './price-filter-search.css'
import classNames from 'classnames/bind'
import { keyWordStockFilter, text_truncate } from 'tools/other.js'
import { Observable } from 'rxjs'

let cx = classNames.bind(styles)
class PriceFilterSearch extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.enter.unsubscribe()
  }
  componentDidMount() {
    //last item getBoundingClientRect().top
    const LAST_ITEM_FILTER_BOUND_TOP = 527
    const FIRST_ITEM_FILTER_BOUND_TOP = 394
    let listWrap = document.querySelector(`.${styles['filter-wrap']} ul`)
    let keyDowns = Observable.fromEvent(document, 'keydown')
    let filterWrap = document.getElementById('accountFilter')
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
      <div className={cx('price-wrap')}>
        <div className={cx('left-wrap')}>
          <span
            data-price={parseFloat(BPrice) > 0 ? parseFloat(BPrice) : BPrice}
          >
            [+1]買進價
          </span>
          <span
            data-price={parseFloat(APrice) > 0 ? parseFloat(APrice) : APrice}
          >
            [+2]賣出價
          </span>
          <span data-price={parseFloat(Price) > 0 ? parseFloat(Price) : Price}>
            [+3]成交價
          </span>
          <span data-price={parseFloat(Open) > 0 ? parseFloat(Open) : Open}>
            [+4]開盤價
          </span>
          <span
            data-price={
              parseFloat(PrePrice) > 0 ? parseFloat(PrePrice) : PrePrice
            }
          >
            [+5]平盤價
          </span>
          <span data-price={parseFloat(high) > 0 ? parseFloat(high) : high}>
            [+6]今高價
          </span>
          <span data-price={parseFloat(low) > 0 ? parseFloat(low) : low}>
            [+7]今低價
          </span>
        </div>
        <div className={cx('right-wrap')}>
          <span
            data-price={parseFloat(BPrice) > 0 ? parseFloat(BPrice) : BPrice}
            style={bPriceStyle}
          >
            {BPrice}
          </span>
          <span
            data-price={parseFloat(APrice) > 0 ? parseFloat(APrice) : APrice}
            style={aPriceStyle}
          >
            {APrice}
          </span>
          <span
            data-price={parseFloat(Price) > 0 ? parseFloat(Price) : Price}
            style={pStyle}
          >
            {Price}
          </span>
          <span
            data-price={parseFloat(Open) > 0 ? parseFloat(Open) : Open}
            style={openStyle}
          >
            {Open}
          </span>
          <span
            data-price={
              parseFloat(PrePrice) > 0 ? parseFloat(PrePrice) : PrePrice
            }
          >
            {PrePrice}
          </span>
          <span
            data-price={parseFloat(high) > 0 ? parseFloat(high) : high}
            style={highStyle}
          >
            {high}
          </span>
          <span
            data-price={parseFloat(low) > 0 ? parseFloat(low) : low}
            style={lowStyle}
          >
            {low}
          </span>
        </div>
      </div>
    )
  }
}

export default PriceFilterSearch
