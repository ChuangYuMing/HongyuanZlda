import React, { PureComponent } from 'react'

function InformationRow(WrapComponent) {
  return class extends PureComponent {
    constructor(props) {
      super(props)
    }
    render() {
      return <WrapComponent {...this.props} {...this.state} />
    }
  }
}

export default InformationRow
