import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './temp3.css'

class HelloWorldComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      a: 2
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        a: 1
      })
    }, 3000)
    let a = document.getElementById('a')
    var source = Rx.Observable.fromEvent(a, 'wheel')
    var source2 = Rx.Observable.fromEvent(a, 'scroll')
    var merge = Rx.Observable.merge(source, source2)
    var example = merge.auditTime(1000).map(e => {
      //   console.log(Date.now())
      return 1
    })

    example.subscribe(() => {
      let a = new Date()
      console.log(a.getSeconds())
    })
  }
  render() {
    return (
      <div id="a">
        <div id="b">{this.state.a}</div>
      </div>
    )
  }
}

export default HelloWorldComponent
