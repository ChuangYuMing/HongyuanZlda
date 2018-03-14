import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './temp3.css'
import { Observable } from 'rxjs'
import { map, auditTime, debounceTime } from 'rxjs/operators'

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
    var source = Observable.fromEvent(a, 'click').pipe(debounceTime(1000))

    var source1 = Observable.fromEvent(a, 'click').pipe(debounceTime(2000))
    var source2 = Observable.fromEvent(a, 'scroll')
    // Observable.merge(source, source1).subscribe(() => {
    //   let a = new Date()
    //   console.log(a.getSeconds())
    // })

    source.concat(source1).subscribe(e => {
      let a = new Date()
      console.log(a.getSeconds())
      console.log(e)
    })

    // var merge = Observable.merge(source, source2)
    // var example = merge.auditTime(1000).map(e => {
    //   return 1
    // })

    // example.subscribe(() => {
    //   let a = new Date()
    //   console.log(a.getSeconds())
    // })
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
