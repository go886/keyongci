<template>
  <div class="root">
    <div class='toolbar'>
      <el-button type="primary" @click="onadd" style="margin-left:10px;margin-right:10px;">添加<i class="el-icon-edit el-icon--right"></i></el-button>
    </div>
    <div class='content'>
      <el-table
        :data="list"
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
        </el-table-column>
         <el-table-column
          prop="url"
          label="URL"
          >
           <template slot-scope="scope">
              <el-button
              @click.native.prevent="onlink(scope.row.url)"
              type="text"
              size="small">
              {{scope.row.url}}
            </el-button>
            </template>
        </el-table-column>
        <el-table-column
          prop="desc"
          label="备注"
          >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="180"
          :formatter="dateFormatter">
        </el-table-column>
        <el-table-column
          label="最后更新时间"
          width="180"
          :formatter="dateFormatter">
            <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ dateFormatter(scope.row.add_time)}}</span>
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
    <LinkForm ref="linkform"/>
  </div>
</template>

<script>
import moment from "moment";
import LinkForm from "./LinkForm";
export default {
  components: {
    LinkForm
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.load();
  },
  methods: {
    dateFormatter(row, column, cellValue) {
      return moment(cellValue).format("YYYY/MM/DD HH:mm");
    },
    load() {
      this.$http("/api/mgr/link/query").then(res => {
        if (!res.error) this.list = res.list;
      });
    },
    onadd() {
      this.$refs["linkform"].show(null, r => {
        this.load();
      });
    },
    onedit(item) {
      this.$refs["linkform"].show(item, r => {
        this.load();
      });
    },
    onremove(item) {
      this.$confirm("此操作将永久删除 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http("/api/mgr/link/remove", {
          params: { id: item.id }
        }).then(res => {
          if (!res.error) {
            this.$message("删除成功");
            this.list.splice(this.list.indexOf(item), 1);
          }
        });
      });
    },
    onlink(url) {
      window.open(url);
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
