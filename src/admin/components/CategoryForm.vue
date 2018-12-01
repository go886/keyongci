<template>
<el-dialog
    :title="edit ? '修改 - 分类' : '新增 - 分类'"
    :visible.sync="visible"
    width="600px;"
    :fullscreen='false' >
    <el-form ref="form"  label-position="right" label-width="80px" :rules="rules" :model="item" class="demo-ruleForm">
        <el-form-item label="" prop="name">
            <el-input  v-model.trim="item.name" :disabled='edit'>
                <template slot="prepend">名称:</template>
            </el-input>
        </el-form-item>
        <el-form-item label="" prop="title">
            <el-input v-model.trim="item.title">
                <template slot="prepend">标题:</template>
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
          { min: 1, message: "请至少输入 1 个字符", trigger: "blur" },
          {
            pattern: /^[a-z]+$/,
            message: "仅可输入小写字母",
            trigger: "blur"
          }
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, message: "请至少输入 1 个字符", trigger: "blur" }
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
        if (!valid) {
        } else {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.$http.post(this.edit ? "/api/mgr/cate/update" : "/api/mgr/cate/add", {
            params: this.item
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
