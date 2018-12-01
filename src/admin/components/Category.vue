<template>
  <div class="root">
    <div class='toolbar'>
      <el-button type="primary" @click="onadd" style="margin-left:10px;margin-right:10px;">添加<i class="el-icon-edit el-icon--right"></i></el-button>
    </div>
    <div class='content'>
      <el-table
        :data="cates"
        style="width: 100%;overflow-y: scroll;"
        stripe>
        <el-table-column
          prop="id"
          label="ID"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120">
          <template slot-scope="scope">
            <el-button
            @click.native.prevent="$store.openCate(scope.row.name)"
            type="text"
            size="small">
            {{scope.row.name}}
          </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="180"
          :formatter="$store.dateFormatter">
        </el-table-column>
        <el-table-column
          label="最后更新时间"
          width="180"
          :formatter="$store.dateFormatter">
            <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ $store.gmtDateFormatter(scope.row.add_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="onedit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="onremove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <CategoryForm ref="form"/>
  </div>
</template>

<script>
import CategoryForm from "./CategoryForm";
export default {
  components: {
    CategoryForm
  },
  data() {
    return {
      cates: [],
      edit: false,
      dialogVisible: false
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.$http("/api/mgr/cate/query").then(res => {
        if (!res.error) this.cates = res.list;
      });
    },
    onadd() {
      this.$refs["form"].show(null, r => {
        this.load();
      });
    },
    onedit(cate) {
       this.$refs["form"].show(cate, r => {
        this.load();
      });
    },
    onremove(cate) {
      this.$confirm("此操作将永久删除 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http("/api/mgr/cate/remove", {
          params: cate
        }).then(res => {
          if (!res.error) {
            this.$message("删除成功");
            this.cates.splice(this.cates.indexOf(cate), 1);
          }
        });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.toolbar {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 50px;
  max-height: 50px;
  min-height: 50px;
  margin-bottom: 10px;
  background: #f2f2f2;
}
.inputpannel {
  margin-bottom: 20px;
}
.content {
  position: relative;
  display: flex;
  top: 0px;
  bottom: 0px;
  left: 0;
  right: 0;
  overflow-y: scroll;
}
</style>
