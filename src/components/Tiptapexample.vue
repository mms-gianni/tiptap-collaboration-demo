<template>
  <div class="editor">
    <h2>
      Collaborative Editing
    </h2>
    <div class="message">
    </div>
    <template v-if="editor && !loading">
      <div class="user-list">
        <div v-for="participant in participants" class="user-block">
          <img class="img-circle img-bordered-sm" :src="participant.thumbnail" alt="user image" :style="{ border: '2px solid '+participant.displaycolor}">
            <span class="username">
                <a href="#">{{participant.displayname}}</a>
            </span>
        </div>
      </div>
      <div class="count">
        {{ count }} {{ count === 1 ? 'user' : 'users' }} connected
      </div>
      <editor-content class="editor__content" :editor="editor"  />
    </template>
    <em v-else>
      Connecting to socket server …
    </em>
  </div>
</template>

<script>

import io from 'socket.io-client'
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  History,
  Collaboration,
} from 'tiptap-extensions'
import Participants from './extensions/Participants.js'
//import Collaboration from '../extensions/Collaboration.js'
//import Collaborationparticipants from '../extensions/Collaborationparticipants.js'

export default {
  name: 'Tiptapexample',
  components: {
    EditorContent,
  },
  data() {
    return {
      loading: true,
      editor: null,
      socket: null,
      count: 0,
      participants: null,
    }
  },
  methods: {  
    onInit({ doc, version }) {
      this.loading = false
      if (this.editor) {
        this.editor.destroy()
      }
      this.editor = new Editor({
        content: doc,
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Code(),
          new Italic(),
          new History(),
          new Participants({
          	socket: this.socket,
          	/*
            displayname: document.querySelector('meta[name="userName"]').getAttribute('content'),
            displaycolor: this.getDisplaycolor(this.socket.id),
            */
            /*
            me: {
              //displayname: document.querySelector('meta[name="userName"]').getAttribute('content'),
              //displayname: this.randomuser.name.first+" "+this.randomuser.name.last,
              displayname: "bla",
              displaycolor: this.getDisplaycolor(this.socket.id),
            },
            */
            //me: {},
            //displaycolor: this.getDisplaycolor(document.querySelector('meta[name="userName"]').getAttribute('content')),
          }),
          new Collaboration({
          	clientID: this.socket.id,

            // the initial version we start with
            // version is an integer which is incremented with every change
            version,
            // debounce changes so we can save some requests
            debounce: 0,
            // onSendable is called whenever there are changed we have to send to our server
            onSendable: ({ sendable }) => {
              this.socket.emit('update', sendable)
            },
          }),
        ],
      })
    },
    setCount(count) {
      this.count = count
    },
    setParticipants(participants) {
      this.participants = participants
    },
    getDisplayname(){
      return this.randomuser.name.first+" "+this.randomuser.name.last
    },
    getDisplaycolor (str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;      
    },
  },
  mounted() {

    axios
      .get('https://randomuser.me/api/')
      .then(response => {
        let me = {
          displayname: response.data.results[0].name.first+" "+response.data.results[0].name.last,
          displaycolor: this.getDisplaycolor(this.socket.id),
          thumbnail: response.data.results[0].picture.thumbnail
        }
        this.editor.extensions.options.participants.me = me

        this.socket.emit("cursorchange", me)
      })

    // server implementation: https://glitch.com/edit/#!/tiptap-sockets
    this.socket = io('ws://localhost:3000/doc-99')
    //this.socket = io('ws://localhost:3000/my-namespace')
    //this.socket = io('ws://localhost:3000')
      // get the current document and its version
      .on('init', data => this.onInit(data))
      // send all updates to the collaboration extension
      .on('update', data => this.editor.extensions.options.collaboration.update(data))
      // get count of connected users
      .on('getCount', count => this.setCount(count))
      // update Cursor position of collaborators
      .on('cursorupdate', participants => {
      	this.editor.extensions.options.participants.update(participants)
      	this.setParticipants(participants)
      })

  },
  beforeDestroy() {
    this.editor.destroy()
    this.socket.destroy()
  },
}
</script>

<style lang="scss">
.selected {

  font-weight: bold;
}
.count {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #27b127;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-size: 0.7rem;
  line-height: 1;
  &:before {
    content: '';
    display: inline-flex;
    background-color: #27b127;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    margin-right: 0.3rem;
  }
}

.cursor.me {
	display: none;
    /*background-color: #F55;*/
}
.cursor.inactive {
    opacity: 0.5;
}
.cursor.me::after{
	display: none;
  	border-color: inherit;
}
.cursor.inactive::after {
    opacity: inherit;
  	border-color: inherit;
}

.cursor {
    /*background-color: #555;*/
    color: #fff;
    text-align: center;
    border-radius: 6px 6px 6px 0px;
    padding: 5px;
    margin-left: -4.5px;
    position: absolute;
    z-index: 1;
    bottom: 5px;
    left: -50%;
    opacity: 0.85;
    white-space: nowrap;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
.cursor::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0%;
  border-width: 5px;
  border-style: solid;
  border-color: inherit
  /*border-color: #555 transparent transparent transparent;*/
}

.ProseMirror-widget {
	position:absolute;
	

	width: 0.1px;
	/*border-style: solid;*/
}
</style>