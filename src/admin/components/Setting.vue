<template>
<div class='root'>
 <el-form ref="form" style="width: 70%;"  label-position="right" label-width="100px" :rules="rules" :model="setting" class="demo-ruleForm">
      <el-form-item label="网站名称" prop="name" >
          <el-input v-model="setting.name"></el-input>
      </el-form-item>
      <el-form-item label="网站描述" prop="desc">
          <el-input v-model="setting.desc"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字" prop="keywords">
          <el-input v-model="setting.keywords"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="url">
          <el-input v-model="setting.url"></el-input>
      </el-form-item>
      <el-form-item label="加速地址" prop="cdn">
          <el-input v-model="setting.cdn"></el-input>
      </el-form-item>
      <el-form-item label="主题选择" prop="theme">
          <el-input v-model="setting.theme"></el-input>
      </el-form-item>
      <el-form-item label="Banner" prop="banner">
          <el-input v-model="setting.banner"></el-input>
      </el-form-item>
      <el-form-item label="统计" >
        <el-switch v-model="setting.enabled_tracker"></el-switch>
      </el-form-item>
       <el-form-item label="统计代码" prop="plugin_tracker" v-if="setting.enabled_tracker == true">
         <el-input type="textarea" v-model="setting.plugin_tracker" :rows="5" ></el-input>
      </el-form-item>
      <el-form-item label="广告" >
        <el-switch v-model="setting.enabled_ad"></el-switch>
      </el-form-item>
      <el-form-item label="广告插件" prop="plugin_ad" v-if="setting.enabled_ad == true">
         <el-input type="textarea" v-model="setting.plugin_ad" :rows="5" ></el-input>
      </el-form-item>
       <el-form-item label="分享" >
        <el-switch v-model="setting.enabled_share"></el-switch>
      </el-form-item>
      <el-form-item label="分享插件" prop="plugin_share" v-if="setting.enabled_share == true">
         <el-input type="textarea" v-model="setting.plugin_share" :rows="5" ></el-input>
      </el-form-item>
      <el-form-item label="评论" >
        <el-switch v-model="setting.enabled_comment"></el-switch>
      </el-form-item>
      <el-form-item label="评论插件" prop="plugin_comment" v-if="setting.enabled_comment == true">
         <el-input type="textarea" v-model="setting.plugin_comment" :rows="5" ></el-input>
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
      setting: {},
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, message: "至少输入 3 个字符", trigger: "blur" }
        ],
        plugin_tracker: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        plugin_ad: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        plugin_share: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        plugin_comment: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.$http("/api/mgr/setting/get").then(res => {
        if (!res.error) {
          this.setting = res;
        }
      });
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.$http.post("/api/mgr/setting/update", {
            params: this.setting
          })
            .then(res => {
              loading.close();
              if (!res.error) {
                this.$message({
                  message: "保存成功"
                });
              }
            })
            .catch(() => {
              loading.close();
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
  margin-top: 10px;
  margin-left: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
</style>
