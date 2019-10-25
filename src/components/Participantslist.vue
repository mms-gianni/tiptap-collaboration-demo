<template>
      <div class="user-list">
        <div class="count">
          {{ count }} {{ count === 1 ? 'user' : 'users' }} connected
        </div>

        <b-alert show :class="count > 1 ? 'hide' : ''">You are alone. Open another Browser to see the collaboration feature. <a href="/" target="_blank">click here</a></b-alert>
        <div v-for="participant in participants" class="user-block" :class="MyClientID === participant.clientID ? 'me' : ''">
          <img class="img-circle" :src="participant.thumbnail" alt="user image" :style="{ border: '2px solid '+participant.displaycolor}">
          <span class="username">
              <a href="#">{{participant.displayname}} {{ MyClientID === participant.clientID ? '(YOU)' : '' }}</a>
          </span>
        </div>
      </div>

</template>


<script>
export default {
  name: 'Participantslist',
  props: {
    participants: Object,
    count: Number,
    MyClientID: String,
  }
}
</script>

<style>
.img-circle {
  border-radius: 50%;
  border: 2px solid #d2d6de;
  padding: 2px;
}

.username {
  margin: 10px;
}
.user-block {
  margin-bottom: 10px;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: .25rem;
}
.user-block.me {
  background-color: #D5D5D5;
}
.hide {
  display: none;
}
</style>