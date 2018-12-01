<template>
<el-dialog
    :title="edit ? '修改 - 友情连接' : '新增 - 友情连接'"
    :visible.sync="visible"
    width="600px;"
    :fullscreen='false' >
    <el-form ref="form"  label-position="right" label-width="80px" :rules="rules" :model="item" class="demo-ruleForm">
        <el-form-item  prop="name">
            <el-input v-model.trim="item.name">
              <template slot="prepend">名称:</template>
            </el-input>
        </el-form-item>
        <el-form-item  prop="url">
            <el-input v-model.trim="item.url">
               <template slot="prepend">URL:</template>
            </el-input>
        </el-form-item>
        <el-form-item prop="desc">
            <el-input v-model="item.desc">
               <template slot="prepend">备注:</template>
            </el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="oncommit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      edit: false,
      visible: false,
      item: {},
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        url: [
          { required: true, type: "url", message: "请输入有效URL", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  created() {},
  methods: {
    show(item, finished) {
      this.edit = !!item;
      this.item = JSON.parse(JSON.stringify(item || {}));
      this.finished = finished;
      this.visible = true;
    },
    oncommit() {
      this.$refs["form"].validate(valid => {
        if (valid)  {
          const item = {
            id: this.item.id,
            name: this.item.name,
            url: this.item.url,
            desc: this.item.desc
          };

          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.$http.post(this.edit ? "/api/mgr/link/update" : "/api/mgr/link/add", {
            params: item
          }).then(res => {
            loading.close();
            if (!res.error) {
              this.$message({
                message: this.edit ? "修改成功" : "新增成功"
              });
              this.visible = false;
              this.finished && this.finished.call(null, res);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
/* .root {
    width: 100%;
} */
.el-textarea__inner {
  height: 100%;
  min-height: 200px;
}
</style>
