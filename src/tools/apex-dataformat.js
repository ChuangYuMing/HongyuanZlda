import { getDateFromFormat } from './date'

// for request
function quoteFormatEven(symbol, quote) {
  for (let key in quote) {
    if (quote[key] === 'null') {
      quote[key] = '--'
    }
  }
  let priceDec = quote['20113']
  let obj = {
    Symbol: symbol,
    Name: quote['55'],
    Exch: quote['17'],
    APrice: numAddDecimal(quote['646'], priceDec) || '--',
    AVol: quote['648'],
    BPrice: numAddDecimal(quote['645'], priceDec) || '--',
    BVol: quote['647'],
    Open: numAddDecimal(quote['1025'], priceDec) || '--',
    Price: numAddDecimal(quote['31'], priceDec),
    TotVol: quote['14'],
    TradeStat: quote['20203'],
    TradeStatCode: quote['340'],
    UpDown: numAddDecimal(quote['12002'], priceDec),
    UpDownRate: quote['12003'],
    high: numAddDecimal(quote['332'], priceDec) || '--',
    low: numAddDecimal(quote['333'], priceDec) || '--',
    PriceDec: quote['20113'],
    StrikeDec: quote['20114'],
    HighLimitPrice: numAddDecimal(quote['1149'], priceDec),
    LowLimitPrice: numAddDecimal(quote['1148'], priceDec),
    BuyCnt: quote['12006'],
    SellCnt: quote['12007'],
    DealType: quote['12031'],
    StaBorder: quote['20301'],
    StaBvol: quote['20302'],
    StaAorder: quote['20303'],
    StaAvol: quote['20304'],
    nowPrice: quote['20115'], //期貨現貨價格
    nonCover: quote['20116'], //未平倉
    StockCode: quote['20117'],
    ProdType: quote['1151'],
    lastCoverTickTime: quote['273'], //上次交易時間
    Vol: quote['1020'],
    StrikePrice: quote['202'],
    PutOrCall: quote['201'],
    FBidPrice: numAddDecimal(quote['29000'], priceDec),
    FBidVol: quote['29001'],
    FAskPrice: numAddDecimal(quote['29002'], priceDec),
    FAskVol: quote['29003'],
    PrePrice: numAddDecimal(quote['1150'], priceDec),
    openTime: quote['342'],
    closeTime: quote['344'],
    symbolDate: quote['SymbolDate']
  }
  return obj
}

function tickFormatEven(symbol, tick) {
  let allProds = window.allprodsforstock
  let priceDec = allProds.prodList[symbol].PriceDec
  let date = tick['273'].substring(0, tick['273'].length - 4)
  let datetime = getDateFromFormat(date, 'yMMdd_HH:mm:ss')
  datetime = datetime + parseInt(tick['273'].substr(tick['273'].length - 3))
  let obj = {
    APrice: numAddDecimal(tick['646'], priceDec),
    BPrice: numAddDecimal(tick['645'], priceDec),
    Price: numAddDecimal(tick['31'], priceDec),
    Vol: tick['1020'],
    tickTime: tick['273'].substr(9, 8),
    DealType: tick['12031'],
    datetime: datetime
  }

  return obj
}

function KlineFormatEven(symbol, tick) {
  let allProds = window.allprodsforstock
  let priceDec = allProds.prodList[symbol].PriceDec
  let date = tick['273'].substring(0, tick['273'].length - 4)
  let datetime = getDateFromFormat(date, 'yMMdd_HH:mm:ss')
  let obj = {
    symbol: symbol,
    tickTime: datetime,
    open: numAddDecimal(tick['1025'], priceDec),
    high: numAddDecimal(tick['332'], priceDec),
    low: numAddDecimal(tick['333'], priceDec),
    price: numAddDecimal(tick['31'], priceDec),
    vol: tick['1020']
  }
  return obj
}

function bidAskFormatEven(symbol, data) {
  let allProds = window.allprodsforstock
  let priceDec = allProds.prodList[symbol].PriceDec
  data = data.map((item, index) => {
    return {
      Price: numAddDecimal(item.Price, priceDec),
      Vol: item.Vol
    }
  })
  return data
}

//========================================================

// for socket data
function quoteFormatOdd(symbol, quote, priceDec) {
  // console.log(quote)
  // let allProds = window.allprodsforstock
  // let priceDec = allProds.prodList[symbol].PriceDec
  // let name = allProds.prodList[symbol].Name
  let obj = {
    Symbol: symbol,
    // Name: name,
    APrice: numAddDecimal(quote['646'], priceDec) || '--',
    AVol: quote['648'],
    BPrice: numAddDecimal(quote['645'], priceDec) || '--',
    BVol: quote['647'],
    Open: numAddDecimal(quote['1025'], priceDec) || '--',
    Price: numAddDecimal(quote['31'], priceDec),
    TotVol: quote['14'],
    TradeStatCode: quote['340'],
    UpDown: numAddDecimal(quote['12002'], priceDec),
    UpDownRate: quote['12003'],
    high: numAddDecimal(quote['332'], priceDec) || '--',
    low: numAddDecimal(quote['333'], priceDec) || '--',
    BuyCnt: quote['12006'],
    SellCnt: quote['12007'],
    DealType: quote['12031'],
    PrePrice: numAddDecimal(quote['1150'], priceDec)
  }
  if (quote['268'] && quote['268'].length > 0) {
    let quoAttType = {}
    for (let item of quote['268']) {
      switch (item['269']) {
        case '20201':
          quoAttType.SettPrice = item['271']
          break
        case '20203':
          quoAttType.TradeStat = item['271']
          break
      }
    }
    obj = Object.assign(obj, quoAttType)
  }
  return obj
}

function tickFormatOdd(symbol, tick, priceDec) {
  // let allProds = window.allprodsforstock
  // let priceDec = allProds.prodList[symbol].PriceDec
  let obj = {
    Vol: tick['12010'][0]['1020'],
    TotVol: tick['14'],
    tickTime: tick['273'],
    plottable: tick['12000'],
    Price: numAddDecimal(tick['12010'][0]['31'], priceDec) || '--',
    NoVol: []
  }
  if (tick['12028'] && tick['12028'].length > 0) {
    for (let item of tick['12028']) {
      obj.NoVol.push({
        price: numAddDecimal(item['12029'], priceDec),
        volume: parseInt(item['12030'])
      })
    }
  }
  return obj
}
function klineFormatOdd(symbol, tick) {
  let allProds = window.allprodsforstock
  let priceDec = allProds.prodList[symbol].PriceDec
  let obj = {
    symbol: symbol,
    tickTime: tick['11504']['273'],
    open: numAddDecimal(tick['11504']['1025'], priceDec),
    high: numAddDecimal(tick['11504']['332'], priceDec),
    low: numAddDecimal(tick['11504']['333'], priceDec),
    price: numAddDecimal(tick['11504']['31'], priceDec),
    vol: tick['11504']['1020']
  }
  return obj
}
function bidAskFormatOdd(symbol, data = []) {
  let allProds = window.allprodsforstock
  let priceDec = allProds.prodList[symbol].PriceDec
  if (data.length === 0) {
    return []
  }
  data = data.map((item, index) => {
    return {
      Price: numAddDecimal(item['270'], priceDec),
      Vol: item['271']
    }
  })
  return data
}
function volumeFormat(volume) {
  let vol = parseInt(volume)
  if (!vol) {
    return volume
  }
  if (vol < 99999) {
    return vol
  } else {
    vol = (vol / 1000000).toFixed(2)
    return `${vol}M`
  }
}

function numAddDecimal(str, dec, type = 'string') {
  let isNegative, zeroNum, negativeDec, integer, decimal, res

  if (dec === undefined || dec === '') {
    return str
  }
  if (isNaN(parseInt(str)) || dec.toString() === '0') {
    return str
  }
  if (str.toString() === '999999999' || str.toString() === '-999999999') {
    return 'M'
  }
  isNegative = parseInt(str) < 0
  str = str.toString()
  if (isNegative) {
    str = str.substr(1, str.length)
  }
  zeroNum = dec >= str.length ? dec - str.length + 1 : 0
  negativeDec = parseInt('-' + dec.toString())
  str = '0'.repeat(zeroNum) + str
  //   console.log(zeroNum)
  integer = str.slice(0, negativeDec)
  if (isNegative) {
    integer = '-' + integer
  }
  decimal = str.slice(str.length - parseInt(dec), str.length)
  res = `${integer}.${decimal}`
  //   console.log(str, negativeDec, integer, str.slice(0, negativeDec));

  switch (type) {
    case 'string':
      return res
      break
    case 'float':
      return parseFloat(res)
      break
    case 'int':
      return parseInt(res)
      break
    default:
      return res
  }
}

export {
  quoteFormatEven,
  quoteFormatOdd,
  tickFormatOdd,
  tickFormatEven,
  bidAskFormatEven,
  bidAskFormatOdd,
  volumeFormat,
  klineFormatOdd,
  KlineFormatEven,
  numAddDecimal
}
