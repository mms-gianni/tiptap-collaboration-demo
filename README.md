# TipTap Collaboration [Demo](https://tiptap-collaboration-demo.netlify.com/)

This demo shows how to implement a collaboration editor with participants in tiptap. 


![Netlify Status](https://api.netlify.com/api/v1/badges/a09ae0aa-a7fa-4432-9538-0b0661c2ac03/deploy-status)
![GitHub issues badge](https://img.shields.io/github/issues/mms-gianni/tiptap-collaboration-demo) ![GitHub forks badge](https://img.shields.io/github/forks/mms-gianni/tiptap-collaboration-demo) ![GitHub stars badge](https://img.shields.io/github/stars/mms-gianni/tiptap-collaboration-demo) ![GitHub issues license](https://img.shields.io/github/license/mms-gianni/tiptap-collaboration-demo) 

![screencapture](https://github.com/mms-gianni/tiptap-collaboration-demo/raw/master/doc/collaboration_new.gif "Preview collaborative editing")

Based on VueJS and TipTap: https://tiptap.scrumpy.io/

Live demo here: 
https://tiptap-collaboration-demo.netlify.com/

Video demo here: 
https://www.youtube.com/watch?v=hC37irpHv0U 

Uses the prosemirror collaborationserver here: 
https://github.com/mms-gianni/tiptap-collaborationserver 

## React on incomming messages

    mounted() {
        this.socket = io(process.env.VUE_APP_SOCKETSERVER_HOST+':'+process.env.VUE_APP_SOCKETSERVER_PORT+'/doc-99')
        // get the current document and its version
        .on('init', data => this.onInit(data))
        // send all updates to the collaboration extension
        .on('update', data => {
            this.editor.extensions.options.collaboration.update(data)
            this.editor.extensions.options.collaboration.updateCursors(data)
        })
        // get count of connected users
        .on('getCount', count => this.setCount(count))
        // update Cursor position of collaborators
        .on('cursorupdate', data => {
            this.editor.extensions.options.collaboration.updateCursors(data)
            this.setParticipants(data.participants)
        })
    },


## Initialize TipTap editor

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
          new Collaboration({
            socket: this.socket,
            clientID: this.socket.id,
            /*
            me: {
              //displayname: document.querySelector('meta[name="userName"]').getAttribute('content'),
              //displayname: this.randomuser.name.first+" "+this.randomuser.name.last,
              displayname: "bla",
              //displaycolor: '#555';
              displaycolor: this.getDisplaycolor(this.socket.id),
            },
            */
            //me: {},

            // the initial version we start with
            // version is an integer which is incremented with every change
            version,
            // debounce changes so we can save some requests
            debounce: 0,
            // onSendable is called whenever there are changed we have to send to our server
            onSendable: ({ sendable }) => {
              //this.socket.emit('update', sendable)
            },
          }),
        ],
      })

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```
