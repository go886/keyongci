<template>
<el-dialog
    :title="edit ? '修改文章' : '新增文章'"
    :visible.sync="visible"
    width="85%"
    :fullscreen='false' top='40px'>
    
    <el-form  ref="form" size="mini" label-position="right" label-width="80px" :rules="rules" :model="post" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
            <el-input v-model.trim="post.title"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
            <el-input v-model="post.cover"></el-input>
        </el-form-item>
        <el-form-item label="封面位置">
          <el-radio-group v-model="post.cover_position">
            <el-radio :label="0">上</el-radio>
            <el-radio :label="4">中</el-radio>
            <el-radio :label="1">左</el-radio>
            <el-radio :label="2">右</el-radio>
            <el-radio :label="3">下</el-radio>
          </el-radio-group>
        </el-form-item>
       <el-form-item label="分类" prop="category_id">
            <el-select v-model="post.category_id" placeholder="请选择活动区域">
              <el-option v-for="item in categorys" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
       </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="post.type">
            <el-radio :label="0" >原创</el-radio>
            <el-radio :label="1" >转载</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item v-if="post.type == 1" label="来源URL" prop="source_url">
            <el-input v-model="post.source_url"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="tag in post.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="onRemoveTag(tag)"
            >
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            style="max-width:80px;"
            @keyup.enter.native="onInputConfirm"
            @blur="onInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="onShowInput">+ 新建tag</el-button>
        </el-form-item>
        <el-form-item label="摘要" prop='summary'>
          <el-input type="textarea" :rows="3"  v-model.trim="post.summary" ></el-input>
        </el-form-item>
        <el-form-item label="正文" prop='content'>
          <el-input type="textarea" :rows="18"  v-model.trim="post.content" ></el-input>
        </el-form-item>
         <el-form-item label="允许评论" >
          <el-switch v-model="post.comment"></el-switch>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="oncommit">确 定</el-button>
    </span>
    <div>{{post}}</div>
  </el-dialog>
</template>

<script>
import moment from "moment";

export default {
  components: {},
  data() {
    return {
      edit: false,
      visible: false,
      inputVisible: false,
      inputValue: null,
      categorys: [],
      post: {
        type: 0,
        cover_position: 0,
        tags: [],
        comment: true
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, max: 40, message: "长度在 3 到 40 个字符", trigger: "blur" }
        ],
        category_id: [
          { required: true, message: "请选择分类", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请输入摘要", trigger: "blur" }
          //  { min: 50, message: "至少输入50个字符", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" }
          //  { min: 50, message: "至少输入50个字符", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        source_url: [
          {
            required: true,
            type: "url",
            message: "请输入有效URL",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  created() {
    this.loadcategorys();
  },
  methods: {
    show(post, finished) {
      this.edit = !!post;
      this.post = JSON.parse(
        JSON.stringify(
          post || {
            type: 0,
            cover_position: 0,
            tags: [],
            comment: true
          }
        )
      );
      this.finished = finished;
      this.visible = true;
      const form = this.$refs["form"];
      if (form) {
        this.form.resetFields();
      }
    },
    gmtDateFormatter(time) {
      return moment(time).format("YYYY/MM/DD HH:mm");
    },
    loadcategorys() {
      this.$http("/api/mgr/cate/query").then(res => {
        if (!res.error) {
          this.categorys = res.list;
        }
      });
    },
    onRemoveTag(tag) {
      let tags = this.post.tags;
      const index = tags.indexOf(tag);
      tags.splice(index, 1);
      this.$forceUpdate();
    },
    onShowInput() {
      this.inputVisible = true;
      this.$nextTick(()=> {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    onInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        if (!this.post.tags) this.post.tags = [];
        if (this.post.tags.indexOf(inputValue) == -1) {
          this.post.tags.push(inputValue);
        } else {
          this.$message.error("已存在的标签");
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    oncommit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const post = {
            id: this.post.id,
            title: this.post.title,
            category_id: this.post.category_id,
            cover: this.post.cover,
            cover_position: this.post.cover_position,
            content: this.post.content,
            summary: this.post.summary,
            type: this.post.type,
            source_url: this.post.source_url,
            tags: this.post.tags,
            comment: this.post.comment,
          };

          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.$http
            .post(
              this.edit ? "/api/mgr/article/update" : "/api/mgr/article/add",
              {
                params: post
              }
            )
            .then(res => {
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
