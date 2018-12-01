<template>
  <div class="root">
    <UserInfo />
  </div>
</template>

<script>
import UserInfo from './UserInfo'
export default {
  components:{
    UserInfo,
  },
  data: function() {
    return {
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.item {
  margin-left: 35px;
}
</style>
