import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './main.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class Main extends Component {
  constructor() {
    super()
  }
  render() {
    return <div>test</div>
  }
}

Main.propTypes = {}

export default Main
