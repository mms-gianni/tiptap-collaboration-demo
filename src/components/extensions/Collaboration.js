import { Extension } from 'tiptap'
import { Step } from 'prosemirror-transform'
import {
  collab,
  sendableSteps,
  getVersion,
  receiveTransaction,
} from 'prosemirror-collab'

export default class Collaboration extends Extension {

  get name() {
    return 'collaboration'
  }

  init() {
    this.getSendableSteps = this.debounce(({ transaction, state }) => {
      const sendable = sendableSteps(state)
      const selection = {
        from: transaction.selection.from,
        to: transaction.selection.to,
      }

      if (sendable || transaction.selectionSet) {
        this.options.onSendable({
          version: getVersion(state),
          steps: sendable ? sendable.steps.map(step => step.toJSON()) : [],
          clientID: this.options.clientID,
          selection,
        })
      }
    }, this.options.debounce)

    this.editor.on('transaction', ({ transaction, state }) => {
      this.getSendableSteps({ transaction, state })
    })
  }

  get defaultOptions() {
    return {
      version: 0,
      clientID: Math.floor(Math.random() * 0xFFFFFFFF),
      debounce: 250,
      onSendable: () => {},
      update: ({ steps, version }) => {
        const { state, view, schema } = this.editor

        if (getVersion(state) > version) {
          return
        }

        view.dispatch(receiveTransaction(
          state,
          steps.map(item => Step.fromJSON(schema, item.step)),
          steps.map(item => item.clientID),
        ))
      },
    }
  }

  get plugins() {
    return [
      collab({
        version: this.options.version,
        clientID: this.options.clientID,
      }),
    ]
  }

  debounce(fn, delay) {
    let timeout
    return function (...args) {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        fn(...args)
        timeout = null
      }, delay)
    }
  }

}