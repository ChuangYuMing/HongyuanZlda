import { connect } from 'react-redux'
import Order from './Order'
import { order, getQuote } from '../../actions.js'
import { changeTargetAccount } from 'modules/main/actions.js'

const mapStateToProps = state => {
  return {
    prodList: state.main.get('prodList'),
    customerInfo: state.main.get('customerInfo'),
    tradeUnit: state.main.get('tradeUnit'),
    exchange: state.main.get('exchange')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    order: params => {
      dispatch(order(params))
    },
    getQuote: symbol => {
      dispatch(getQuote(symbol))
    },
    changeTargetAccount: params => {
      dispatch(changeTargetAccount(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
