import React, { PureComponent } from 'react'
import styles from './popup.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class PopUp extends PureComponent {
  constructor(props) {
    super(props)
    // console.log(props)
  }
  render() {
    let show = this.props.show
    let { width, height, top, zIndex, bottom } = this.props
    let style = {
      width,
      height,
      top,
      zIndex,
      bottom
    }
    return (
      <div className={show ? cx('popup-wrap') : cx('hide')} style={style}>
        {this.props.children}
      </div>
    )
  }
}

export default PopUp
