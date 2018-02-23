import { connect } from 'react-redux'
import ValidOrder from './ValidOrder'
import { cancelOrder } from '../../actions'

const mapStateToProps = state => {
  return {
    list: state.order.getIn(['orderList'])
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cancelOrder: params => {
      dispatch(cancelOrder(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidOrder)
