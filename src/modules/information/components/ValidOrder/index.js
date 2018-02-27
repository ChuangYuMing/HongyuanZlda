import { connect } from 'react-redux'
import ValidOrder from './ValidOrder'
import { cancelOrder, changeOrder } from '../../actions'
import { order } from 'modules/order/actions.js'

const mapStateToProps = state => {
  return {
    list: state.order.getIn(['orderList'])
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cancelOrder: params => {
      dispatch(cancelOrder(params))
    },
    changeOrder: ({ targetRow, value, type }) => {
      dispatch(cancelOrder(targetRow))
      let price,
        volume = ''
      if (type === 'price') {
        price = value
        volume = targetRow.get('LeavesQty')
      } else if (type === 'volume') {
        price = targetRow.get('Price')
        volume = value
      }
      let params = {
        Mode: 22,
        Symbol: targetRow.get('Symbol'),
        Account: targetRow.get('Account'),
        Side: targetRow.get('Side'),
        OrdType: targetRow.get('OrdType'),
        Price: price,
        OrderQty: volume,
        Branch: 'branch01',
        Username: targetRow.get('Username')
      }
      dispatch(order(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidOrder)
