<template>
<el-form ref="form" :model="form" :rules="rules" label-width="80px" class="content">
    <el-form-item label="用户名：" prop="name">
      <el-input 
          v-model="form.name" 
          autofocus
          placeholder="请输入用户名"
          @keyup.enter.native="onlogin"
      />
  </el-form-item>
      <el-form-item label="密码：" prop="pwd">
     <el-input 
        v-model="form.pwd"                 
        type='password'
        placeholder="请输入密码"
        @keyup.enter.native="onlogin"
     />
  </el-form-item>
  <el-form-item label="记住我" prop="remember">
    <el-checkbox 
        v-model="form.remember"                 
    />
  </el-form-item>
   <el-form-item>
       <el-button type="primary" @click="onlogin">登录</el-button>
  </el-form-item>
</el-form>

</template>

<script>
import sha256 from "sha256";
export default {
  data() {
    return {
      form: {
        remember: true
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onlogin() {
      this.$refs["form"].validate(valid => {
        if (!valid) return;

        const encrypt = (name, pwd) => {
          return sha256(sha256(pwd) + name.length + sha256(name));
        };

        this.$http.post("/api/mgr/user/login", {
          params: {
            name: this.form.name,
            pwd: encrypt(this.form.name, this.form.pwd),
            remember: this.form.remember ? 1 : 0
          }
        }).then(res => {
          if (!res.error) {
            location.href = "/admin.html";
          }
        });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  padding: 40px 40px 10px 40px;
  display: flex;
  flex-direction: column;
  width: 400px;
  background-color: rgba(240, 255, 255, 0.5);
  border-radius: 10px;
  margin-bottom: 100px;
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
