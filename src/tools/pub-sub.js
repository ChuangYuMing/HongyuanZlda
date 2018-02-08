class Publisher {
  constructor() {
    this.subscribers = []
  }
  trigger(data) {
    this.subscribers.forEach(function(fn) {
      fn.fire(data)
    })
    // console.log(this.subscribers)
    return this
  }
}

class Observer {
  constructor() {
    this.fire = ''
  }
  subscribe(publisher, callback) {
    this.fire = callback
    let _this = this
    let alreadyExists = publisher.subscribers.some(function(ob) {
      return ob.fire === _this.fire
    })

    if (!alreadyExists) {
      publisher.subscribers.push(_this)
    }

    // console.log(publisher.subscribers)
    return _this
  }
  unsubscribe(publisher) {
    let _this = this
    publisher.subscribers = publisher.subscribers.filter(function(ob) {
      return !(ob.fire === _this.fire)
    })
    // console.log(publisher.subscribers)
    return _this
  }
}

export { Publisher, Observer }
