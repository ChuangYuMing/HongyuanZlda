import { connect } from 'react-redux'
import Inventory from './Inventory'
import { getInventory } from 'modules/inventory/actions.js'

const mapStateToProps = state => {
  return {
    targetAccount: state.main.get('targetAccount'),
    customerInfo: state.main.get('customerInfo'),
    inventory: state.inventory.get('inventory'),
    token: state.app.get('userToken')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getInventory: params => {
      dispatch(getInventory(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)
