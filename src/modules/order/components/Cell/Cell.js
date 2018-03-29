import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './cell.css'
import anime from 'animejs'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class Cell extends PureComponent {
  componentDidUpdate(prevProps) {
    let row = this.refs.row
    anime({
      targets: this.anim,
      opacity: [{ value: 1, duration: 500 }, { value: 0, duration: 500 }],
      easing: 'linear'
    })
  }
  render() {
    let { value } = this.props
    return (
      <div data-value={value} className={cx('wrap')}>
        <span className={cx('value')}>{value}</span>
        <span ref={i => (this.anim = i)} className={cx('anim')} />
      </div>
    )
  }
}

Cell.propTypes = {}

export default Cell
