<template>
      <div class="user-list">
        <div class="count">
          {{ count }} {{ count === 1 ? 'user' : 'users' }} connected
        </div>
        <div v-for="participant in participants" class="user-block">
          <img class="img-circle" :src="participant.thumbnail" alt="user image" :style="{ border: '2px solid '+participant.displaycolor}">
            <span class="username">
                <a href="#">{{participant.displayname}}</a>
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
  },
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
}
</style>