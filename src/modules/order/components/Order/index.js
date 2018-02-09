import { connect } from 'react-redux'
import Order from './Order'
import { order, getQuote } from '../../actions.js'

const mapStateToProps = state => {
  return {
    // quote: state.order.orderQuote
  }
}

const mapDispatchToProps = dispatch => {
  return {
    order: params => {
      dispatch(order(params))
    },
    getQuote: symbol => {
      dispatch(getQuote(symbol))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
