import { Extension, Plugin } from 'tiptap'
import {Decoration, DecorationSet} from "prosemirror-view"

export default class Participants extends Extension {

  get name() {
    return 'participants'
  }

  init() {
    this.editor.on('init', ({ state }) => {
      // let other participants know you are here
      this.options.me['cursor'] = state.selection.anchor
      this.options.me['focused'] = state.selection.focused
      this.options.socket.emit("cursorchange", this.options.me)
    })
    
    // send an update on every transaction.
    this.editor.on('transaction', ({ state }) => {
        this.options.me['cursor'] = state.selection.anchor
        this.options.me['focused'] = state.selection.focused
        this.options.socket.emit("cursorchange", this.options.me)
    })
    
  }

  get defaultOptions() {
    return {
      participants: {},
      me: {},
      socket: '',
      update: ( participants ) => {
        const { state, view, schema } = this.editor

        this.participants = participants

        //Set the decorations in the editor
        var clientID = this.editor.extensions.options.collaboration.clientID
        let props = {
          decorations(state) {
            var decos = []
            for (const [id, dec] of Object.entries(participants)){
              var cursorclass = 'cursor'
              var displayname = dec.displayname
              var displaycolor = 'style="background-color:'+dec.displaycolor+'; border-top-color:'+dec.displaycolor+'"'

              const dom = document.createElement('div')
              if(dec.focused==false) {
                cursorclass += ' inactive'
              }
              
              if (dec.clientID == clientID){
                cursorclass += ' me'
              }
              if (displayname == false){
                displayname = dec.clientID
              } 

              dom.innerHTML = '<span class="'+cursorclass+'" '+displaycolor+'>'+displayname+'</span>'
              dom.style.display = 'inline'
              dom.class = 'tooltip'
              decos.push(Decoration.widget(dec.cursor, dom))
            }
            return DecorationSet.create(state.doc, decos);
          }
        }
        view.setProps(props)

      },

    }
  }

}