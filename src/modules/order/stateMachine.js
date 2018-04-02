import StateMachine from 'javascript-state-machine'

let orderStateMachine = initState => {
  return StateMachine.factory({
    init: initState,
    transitions: [
      { name: 'do-order-reject', from: 'init', to: 'order-reject' },
      { name: 'do-order-reject', from: 'order-reject', to: 'order-reject' },
      { name: 'do-sync-success', from: 'init', to: 'sync-order-success' },
      {
        name: 'do-order-reject',
        from: 'sync-order-success',
        to: 'order-reject'
      },
      {
        name: 'do-sync-success',
        from: 'sync-order-success',
        to: 'sync-order-success'
      },
      { name: 'do-error', from: 'sync-order-success', to: 'error' },
      { name: 'do-order-outtime', from: 'init', to: 'sync-order-outtime' },
      { name: 'do-async-new', from: 'sync-order-success', to: 'new-order' },
      { name: 'do-partial-deal', from: 'new-order', to: 'partial-deal' },
      { name: 'do-partial-deal', from: 'partial-deal', to: 'partial-deal' },
      {
        name: 'do-partial-deal',
        from: 'sync-order-success',
        to: 'partial-deal'
      },
      { name: 'do-partial-deal', from: 'cancel-fail', to: 'partial-deal' },
      { name: 'do-cancel', from: 'partial-deal', to: 'cancel-wait' },
      { name: 'do-cancel', from: 'new-order', to: 'cancel-wait' },
      { name: 'do-cancel-success', from: 'cancel-wait', to: 'cancel-success' },
      { name: 'do-cancel-success', from: 'new-order', to: 'cancel-success' },
      { name: 'do-cancel-success', from: 'partial-deal', to: 'cancel-success' },
      { name: 'do-cancel-fail', from: 'cancel-wait', to: 'cancel-fail' },
      { name: 'do-cancel-fail', from: 'new-order', to: 'cancel-fail' },
      { name: 'do-cancel-fail', from: 'partial-deal', to: 'cancel-fail' },
      { name: 'do-all-deal', from: 'new-order', to: 'all-deal' },
      { name: 'do-all-deal', from: 'cancel-fail', to: 'all-deal' },
      { name: 'do-all-deal', from: 'partial-deal', to: 'all-deal' },
      { name: 'do-all-deal', from: 'sync-order-success', to: 'all-deal' },
      { name: 'do-order-reject', from: 'none', to: 'order-reject' },
      { name: 'do-sync-success', from: 'none', to: 'sync-order-success' },
      { name: 'do-order-outtime', from: 'none', to: 'sync-order-outtime' },
      { name: 'do-async-new', from: 'none', to: 'new-order' },
      { name: 'do-partial-deal', from: 'none', to: 'partial-deal' },
      { name: 'do-cancel', from: 'none', to: 'cancel-wait' },
      { name: 'do-cancel-success', from: 'none', to: 'cancel-success' },
      { name: 'do-cancel-fail', from: 'none', to: 'cancel-fail' },
      { name: 'do-all-deal', from: 'none', to: 'all-deal' }
    ]
  })
}

export { orderStateMachine }
