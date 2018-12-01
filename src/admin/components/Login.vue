<template>
  <div class="root">
      <div class='content'>
          <div class='pannel'>
            <div class='txt'> 用户名：</div>
            <el-input 
                placeholder="请输入用户名"
                v-model="name"
                size="small"
                clearable>
            </el-input>
          </div>
          <div class='pannel'>
            <div class='txt'> 密码：</div>
            <el-input 
                placeholder="请输入用密码"
                v-model="pwd"
                type='password'
                size="small"
                clearable>
            </el-input>
          </div>
          <div class='loginpannel'>
                <el-button type="primary" @click="onlogin">登录</el-button>
          </div>
      </div>
  </div>
</template>

<script>
const md5 = require("md5");

export default {
  data() {
    return {
      name: "",
      pwd: ""
    };
  },
  methods: {
    onlogin() {
      this.$http("/api/mgr/user/login", {
        params: { name: this.name, pwd: md5(this.pwd) }
      }).then(res => {
        if (!res.error) {
          // this.$message({ message: JSON.stringify(res.data) });
          location.href ='/admin.html'
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.content {
  padding: 40px;
  margin-bottom: 260px;
  /* padding-bottom: 300px; */
  display: flex;
  flex-direction: column;
  width: 360;
  min-width: 360px;
  max-width: 360px;

  background-color: rgba(240, 255, 255, 0.5);
  border-radius: 10px;
}
.pannel {
  display: flex;
  flex: row;
  margin-bottom: 20px;
  align-items: center;
}

.txt {
  width: 80px;
}
.loginpannel {
  display: flex;
  flex-direction: row-reverse;
}
</style>
