import { connect } from 'react-redux'
import Order from './Order'
import { order } from '../../actions.js'

const mapStateToProps = state => {
  return {
    test: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    order: params => {
      dispatch(order(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
