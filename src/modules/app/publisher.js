import { Publisher } from 'tools/pub-sub'

const orderPub = new Publisher()
const ticksPub = new Publisher()
const eventQuotePub = new Publisher()
const bidAskPub = new Publisher()

export { orderPub, ticksPub, eventQuotePub, bidAskPub }
