<template>
<div class='root'>
 <el-form ref="form" style="width:90%;"  label-position="right" label-width="100px" :rules="rules" :model="info" class="demo-ruleForm">
      <el-form-item label="允许评论" >
        <el-switch v-model="info.comment"></el-switch>
      </el-form-item>
        <el-form-item label="正文" prop='content'>
          <el-input type="textarea" :rows="18"  v-model="info.content" ></el-input>
        </el-form-item>     
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存设置</el-button>
     </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        comment: true,
        content: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, message: "至少输入 3 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.$http("/api/mgr/about/get").then(res => {
        if (!res.error) {
          this.info = res;
        }
      });
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$http.post("/api/mgr/about/update", {
            params: this.info
          }).then(res => {
            if (!res.error) {
              this.$message({
                message: "保存成功"
              });
            }
          });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  margin-top: 20px;
  margin-left: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
</style>
