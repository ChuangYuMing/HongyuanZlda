import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './member.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class Member extends Component {
  constructor() {
    super()
  }
  render() {
    return <div>test</div>
  }
}

Member.propTypes = {}

export default Member
