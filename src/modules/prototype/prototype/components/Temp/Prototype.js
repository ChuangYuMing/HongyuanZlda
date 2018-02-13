import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './prototype.css'
import classNames from 'classnames/bind'
import { fromJS } from 'immutable'

let cx = classNames.bind(styles)
class Prototype extends PureComponent {
  constructor() {
    super()
  }
  render() {
    return <div>test</div>
  }
}

Prototype.propTypes = {}

export default Prototype
