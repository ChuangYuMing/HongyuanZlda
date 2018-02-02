import { combineReducers } from 'redux'
import app from './modules/app'
import order from './modules/order'
import orderList from './modules/order-list'
import selfStock from './modules/self-stock'
import orderHistory from './modules/order-history'
import dealList from './modules/deal-list'
import dealHistory from './modules/deal-history'
import stockInventory from './modules/stock-inventory'
import investmentAnalysis from './modules/investment-analysis'
import transferMoney from './modules/transfer-money'
import transferMoneyHistory from './modules/transfer-money-history'
import menu from './modules/menu'
import riseRankingList from './modules/rise-ranking-list'
import gameRanking from './modules/game-ranking'
import financeEntrance from './modules/finance-entrance'
import quotes from './modules/quotes'
import other from './modules/other'

const manipulator = combineReducers({
  [app.constants.NAME]: app.reducer,
  [order.constants.NAME]: order.reducer,
  [orderList.constants.NAME]: orderList.reducer,
  [selfStock.constants.NAME]: selfStock.reducer,
  [orderHistory.constants.NAME]: orderHistory.reducer,
  [investmentAnalysis.constants.NAME]: investmentAnalysis.reducer,
  [dealList.constants.NAME]: dealList.reducer,
  [dealHistory.constants.NAME]: dealHistory.reducer,
  [stockInventory.constants.NAME]: stockInventory.reducer,
  [menu.constants.NAME]: menu.reducer,
  [riseRankingList.constants.NAME]: riseRankingList.reducer,
  [gameRanking.constants.NAME]: gameRanking.reducer,
  [financeEntrance.constants.NAME]: financeEntrance.reducer,
  [quotes.constants.NAME]: quotes.reducer,
  [transferMoney.constants.NAME]: transferMoney.reducer,
  [transferMoneyHistory.constants.NAME]: transferMoneyHistory.reducer,
  [other.constants.NAME]: other.reducer
})

export default manipulator
