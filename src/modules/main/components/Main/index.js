import { connect } from 'react-redux'
import Main from './Main'
import {
  closeMainPopup,
  getProds,
  updateProdList,
  getCustomerInfo,
  getOrderStatus
} from '../../actions.js'

const mapStateToProps = state => {
  return {
    isLogin: state.app.get('isLogin'),
    mainPopupMsg: state.main.get('mainPopupMsg'),
    prodList: state.main.get('prodList'),
    userToken: state.app.get('userToken'),
    userId: state.app.get('userId')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeMainPopup: id => {
      dispatch(closeMainPopup(id))
    },
    getProds: countrys => {
      let prodList = {}
      let promises = countrys.map(item => {
        return dispatch(getProds(item))
      })
      Promise.all(promises)
        .then(res => {
          res.forEach((item, i) => {
            prodList[countrys[i]] = res[i]
          })
          dispatch(updateProdList(prodList))
          console.log('prodList: ', prodList)
        })
        .catch(e => {
          console.log(e)
        })
    },
    getCustomerInfo: params => {
      dispatch(getCustomerInfo(params))
    },
    getOrderStatus: params => {
      dispatch(getOrderStatus(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
