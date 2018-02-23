import React, { PureComponent } from 'react'
import classNames from 'classnames/bind'
import styles from './action-btn.css'

let cx = classNames.bind(styles)
class ActionBtn extends PureComponent {
  constructor() {
    super()
  }
  render() {
    return (
      <div className={cx('btns-wrap')}>
        <span onClick={this.props.showCancel} className={cx('btn')}>
          刪
        </span>
        <span className={cx('btn')}>量</span>
        <span className={cx('btn')}>價</span>
      </div>
    )
  }
}

export default ActionBtn
