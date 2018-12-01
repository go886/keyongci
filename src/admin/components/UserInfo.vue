<template>
  <div class="root">
      <span>{{welcome}}</span>
      <el-dropdown trigger="click" @command="onCommand">
        <img class="logo" :src="user.logo" />
        <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
      }
    };
  },
  computed: {
    welcome() {
      const user = this.user
      const time = this.$store.gmtDateFormatter(this.user.edit_time, "YYYY/MM/DD")
      return  `${user.nick}[${user.name}] , 欢迎光临 | 上次登录：${time}`
    },
  },
  created(){
    this.$http('/api/mgr/user/get').then(res=>{
      if (!res.error) {
        this.user = res;
      }
    })
  },
  methods: {
    onCommand(cmd) {
      if ("logout" == cmd) {
        this.onlogout();
      }
    },
    onlogout() {
      this.$http('/api/mgr/user/logout').then(res=>{
        if (!res.error) {
          window.location.href ='/login.html'
        }
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* background-color: #ccc; */
  padding: 10px 50px;
  font-size: 12px;
  color: #fff;
}
.logo {
  width: 38px;
  height: 38px;
  border-radius: 19px;
  transition: all 0.5s ease;

  /* background-color: #ccc; */
  box-shadow: 8px 14px 38px rgba(39, 44, 49, 0.06),
    1px 3px 8px rgba(39, 44, 49, 0.03);
}
.logo:hover {
  transform: translate3D(0, -1px, 0) scale(1.02);
}
.el-dropdown {
  height: 40px;
  margin-left: 10px;
}
</style>
