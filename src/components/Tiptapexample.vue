<template>
  <div class="editor">
    <b-alert variant="success" show dismissible>
      You are automaticly logged in as : {{ editor.extensions.options.participants.me.displayname }}
    </b-alert>

    <template v-if="editor && !loading">
    <b-container class="bv-row">
      <b-row>
        <b-col cols="8">
          <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
            <div class="menubar">
              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <i class="fa fa-bold"></i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <i class="fa fa-italic"></i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
              >
                <i class="fa fa-strikethrough"></i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
              >
                <i class="fa fa-underline"></i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >
                <i class="fa fa-header">1</i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >
                <i class="fa fa-header">2</i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
              >
                <i class="fa fa-header">3</i>
              </button>
<!--
              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <i class="fa fa-list-ul"></i>
              </button>

              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <i class="fa fa-list-ol"></i>
              </button>
-->
              <button
                class="menubar__button btn btn-default"
                :class="{ 'is-active': isActive.blockquote() }"
                @click="commands.blockquote"
              >
                <i class="fa fa-quote-right"></i>
              </button>
            </div>
          </editor-menu-bar>

          <editor-content class="editor__content" :editor="editor" />
        </b-col>
        <b-col>
          <participantslist :participants="participants" :count="count" :MyClientID="socket.id" />
        </b-col>
      </b-row>
    </b-container>

    </template>
    <em v-else>
      Connecting to Heroku socket server … it may take a moment to spin it up.
    </em>
  </div>
</template>

<script>

import io from 'socket.io-client'
import axios from 'axios'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
    //OrderedList,
    //BulletList,
    Blockquote,
  History,
  Collaboration,
} from 'tiptap-extensions'
import Participants from './extensions/Participants.js'
import Participantslist from './Participantslist.vue'

export default {
  name: 'Tiptapexample',
  components: {
    EditorContent,
    EditorMenuBar,
    Participantslist,
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
          new Strike(),
          new Underline(),
          //new OrderedList(),
          //new BulletList(),
          new Blockquote(),
          new History(),
          new Participants({
            socket: this.socket,
            /*
            me: {
              //displayname: document.querySelector('meta[name="userName"]').getAttribute('content'),
              //displayname: this.randomuser.name.first+" "+this.randomuser.name.last,
              displayname: "bla",
              displaycolor: this.getDisplaycolor(this.socket.id),
            },
            */
            //me: {},
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

      // Load Random Userdata, after Editor is intiated
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
    console.log(process.env)
    this.socket = io(process.env.VUE_APP_SOCKETSERVER_HOST+':'+process.env.VUE_APP_SOCKETSERVER_PORT+'/doc-99')
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

.editor__content {
  border: 1px solid #ced4da;
  border-radius: .25rem;
  padding: .375rem .75rem;
  background-color: #f5f5f5;
}

.bv-row {
  padding-top: 20px;
}
.ProseMirror-widget {
  position:absolute;
  

  width: 0.1px;
  /*border-style: solid;*/
}

button .is-active {
  font-color:#FFF;
  background-color: #000;
  font-weight: bold;
}

blockquote {
    border-radius: 3px;
    position: relative;  /*  <--- */
    font-style: italic;
    text-align: center;
    padding: 1rem 1.2rem;
    width: 70%;  /* create space for the quotes */
    color: #4a4a4a;
    margin: 1rem auto 2rem;
    color: #4a4a4a;
    background: #E8E8E8;
    left: 50px;
}
blockquote p{
  margin-bottom: 0px;
}
/* -- create the quotation marks -- */
blockquote:before,
blockquote:after{
    font-family: FontAwesome;
    position: absolute;
    /* -- inside the relative position of blockquote -- */
    top: 13px;
    color: #E8E8E8;
    font-size: 34px;
}
blockquote:before{
    content: "\f10d";
    margin-right: 13px;
    right: 100%;
}
blockquote:after{
    content: "\f10e";
    margin-left: 13px;
    left: 100%;  
}
</style>