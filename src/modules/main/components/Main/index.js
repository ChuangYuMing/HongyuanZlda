import { connect } from 'react-redux'
import Main from './Main'
import {
  closeMainPopup,
  getProds,
  updateProdList,
  getCustomerInfo,
  getOrderStatus,
  getExchange,
  getProds2,
  getTradeUnit
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
      return new Promise(resolve => {
        Promise.all(promises)
          .then(res => {
            res.forEach((item, i) => {
              prodList[countrys[i]] = res[i]
            })
            dispatch(updateProdList(prodList))
            console.log('prodList: ', prodList)
            resolve(true)
          })
          .catch(e => {
            console.log(e)
          })
      })
    },
    getCustomerInfo: params => {
      return new Promise(resolve => {
        dispatch(getCustomerInfo(params)).then(res => {
          resolve(true)
        })
      })
    },
    getOrderStatus: params => {
      return new Promise(resolve => {
        dispatch(getOrderStatus(params)).then(res => {
          resolve(true)
        })
      })
    },
    getExchange: params => {
      dispatch(getExchange(params))
    },
    getProd2: params => {
      dispatch(getProds2(params))
    },
    getTradeUnit: params => {
      dispatch(getTradeUnit(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
