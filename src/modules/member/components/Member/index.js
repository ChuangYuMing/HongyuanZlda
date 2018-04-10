import { connect } from 'react-redux'
import Member from './Member'
import { changeTargetAccount } from 'modules/main/actions.js'
import { getInventory } from 'modules/inventory/actions.js'
import { getPurchasing } from '../../actions.js'
import { updateFilterSetting } from 'modules/menu/actions.js'
import { showBashDeletePopup } from 'modules/information/actions.js'
import { checkToBashCancelByAccount } from 'modules/order/actions.js'

const mapStateToProps = state => {
  return {
    customerInfo: state.main.get('customerInfo'),
    targetAccount: state.main.get('targetAccount'),
    userToken: state.app.get('userToken'),
    purchasing: state.member.get('purchasing')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTargetAccount: data => {
      dispatch(changeTargetAccount(data))
    },
    getInventory: params => {
      dispatch(getInventory(params))
    },
    getPurchasing: params => {
      dispatch(getPurchasing(params))
    },
    updateFilterSetting: (tag, value) => {
      dispatch(updateFilterSetting(tag, value))
    },
    toggleBashDeletePopup: value => {
      dispatch(showBashDeletePopup(value))
    },
    checkToBashCancelByAccount: account => {
      dispatch(checkToBashCancelByAccount(account))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Member)
