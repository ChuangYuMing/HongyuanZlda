import { connect } from 'react-redux'
import ValidOrder from './ValidOrder'
import { cancelOrder, changeOrder } from '../../actions'
import {
  order,
  checkDeleteRow,
  inflatDealHistory
} from 'modules/order/actions.js'
import appGlobal from 'modules/common/app-global.js'

console.log(appGlobal)
const mapStateToProps = state => {
  return {
    // list: state.order.getIn(['orderList'])
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cancelOrder: params => {
      dispatch(cancelOrder(params))
    },
    changeOrderVol: ({ targetRow, value }) => {
      dispatch(cancelOrder(targetRow))
      let price = targetRow.get('Price')
      let volume = value
      let orderId = targetRow.get('OrderID')

      let params = {
        MsgType: 'D',
        Symbol: targetRow.get('Symbol'),
        Account: targetRow.get('Account'),
        Side: targetRow.get('Side'),
        OrdType: targetRow.get('OrdType'),
        Price: price,
        OrderQty: volume,
        Branch: 'branch01',
        Username: targetRow.get('Username')
      }
      appGlobal.addOrderPending(orderId, () => {
        dispatch(order(params))
      })
    },
    checkDeleteRow: (orderId, value) => {
      dispatch(checkDeleteRow(orderId, value))
    },
    inflatDealHistory: (orderId, flag) => {
      dispatch(inflatDealHistory(orderId, flag))
    },
    changeOrderPrice: ({ targetRow, value }) => {
      dispatch(cancelOrder(targetRow))
      let originPrice = targetRow.get('Price')
      let originVol = targetRow.get('LeavesQty')
      let price = value.price
      let volume = value.vol
      let orderId = targetRow.get('OrderID')

      let params1 = {
        MsgType: 'D',
        Symbol: targetRow.get('Symbol'),
        Account: targetRow.get('Account'),
        Side: targetRow.get('Side'),
        OrdType: targetRow.get('OrdType'),
        Price: price,
        OrderQty: volume,
        Branch: 'branch01',
        Username: targetRow.get('Username')
      }
      let params2 = {
        MsgType: 'D',
        Symbol: targetRow.get('Symbol'),
        Account: targetRow.get('Account'),
        Side: targetRow.get('Side'),
        OrdType: targetRow.get('OrdType'),
        Price: originPrice,
        OrderQty: originVol - volume,
        Branch: 'branch01',
        Username: targetRow.get('Username')
      }
      appGlobal.addOrderPending(orderId, () => {
        dispatch(order(params1))
        dispatch(order(params2))
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidOrder)
