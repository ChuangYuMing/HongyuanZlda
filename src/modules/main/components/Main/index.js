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
import { logout } from 'modules/menu/actions.js'

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
      return new Promise((resolve, reject) => {
        dispatch(getCustomerInfo(params)).then(
          res => {
            resolve(true)
          },
          e => reject(e)
        )
      })
    },
    getOrderStatus: params => {
      return new Promise((resolve, reject) => {
        dispatch(getOrderStatus(params)).then(
          res => {
            resolve(true)
          },
          e => reject(e)
        )
      })
    },
    getExchange: params => {
      return new Promise((resolve, reject) => {
        dispatch(getExchange(params)).then(
          res => {
            resolve(true)
          },
          e => reject(e)
        )
      })
    },
    getProd2: params => {
      dispatch(getProds2(params))
    },
    getTradeUnit: params => {
      dispatch(getTradeUnit(params))
    },
    logout: () => {
      dispatch(logout())
      window.location.replace('/order/login')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
