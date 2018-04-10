import { connect } from 'react-redux'
import BashDeletePopUp from './BashDeletePopUp'
import { cancelOrder } from '../../actions'
import { showBashDeletePopup } from 'modules/information/actions.js'
import { checkDeleteRow } from 'modules/order/actions.js'

const mapStateToProps = state => {
  return {
    showBashDeletePopup: state.information.get('showBashDeletePopup')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cancelOrder: params => {
      dispatch(cancelOrder(params))
    },
    toggleBashDeletePopup: value => {
      dispatch(showBashDeletePopup(value))
    },
    checkDeleteRow: (orderId, value) => {
      dispatch(checkDeleteRow(orderId, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BashDeletePopUp)
