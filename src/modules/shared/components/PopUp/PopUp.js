import React, { PureComponent } from 'react'
import styles from './popup.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class PopUp extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    let show = this.props.show
    let { width, height } = this.props
    let style = {
      width: width + 'px',
      height: height + 'px'
    }
    return (
      <div className={show ? cx('popup-wrap') : cx('hide')} style={style}>
        {this.props.children}
      </div>
    )
  }
}

export default PopUp
