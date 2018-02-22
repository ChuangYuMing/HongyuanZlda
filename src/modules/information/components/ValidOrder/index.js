import { connect } from 'react-redux'
import ValidOrder from './ValidOrder'

const mapStateToProps = state => {
  return {
    list: state.order.getIn(['orderList'])
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTest: () => {
      alert('test')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidOrder)
