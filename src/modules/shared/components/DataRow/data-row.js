import React from 'react'
import styles from './data-row.scss'
import classNames from 'classnames/bind'
import anime from 'animejs'
import isEqual from 'lodash/isEqual'

let cx = classNames.bind(styles)
class DataRow extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.item, nextProps.item)) {
      return true
    }
    return false
  }
  componentDidUpdate(prevProps) {
    let row = this.refs.row
    anime({
      targets: row,
      opacity: [{ value: 1, duration: 500 }, { value: 0, duration: 500 }],
      easing: 'linear'
    })
  }
  render() {
    let item = this.props.item
    return <span ref="row" className={cx('update-row')} />
  }
}
export default DataRow
