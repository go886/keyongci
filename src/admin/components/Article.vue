<template>
  <div class="root">
    <div class='toolbar'>
      <el-button type="primary" @click="onadd" style="margin-left:10px;margin-right:10px;">添加<i class="el-icon-edit el-icon--right"></i></el-button>
    </div>
    <div class='content'>
      <el-table
        :data="list"
        style="width: 100%;overflow-y: auto;"
        stripe
        >
        <el-table-column type="expand">
          <template scope="props">
            <ArticlePannel :info="props.row"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="150">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          >
           <template slot-scope="scope">
           <el-button
            @click.native.prevent="$store.openPost(scope.row)"
            type="text"
            size="small">
            {{scope.row.title}}
          </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="category_title"
          label="分类"
          >
           <template slot-scope="scope">
           <el-button
            @click.native.prevent="$store.openCate(scope.row.category_name)"
            type="text"
            size="small">
            {{scope.row.category_title}}
          </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="category_tags"
          label="标签"
          >
           <template slot-scope="scope">
             <a v-for="tag in scope.row.tags" :key="tag"  :href="$store.tagURL(tag)" target="_blank">
               <el-tag  style="margin:2px 3px;" size="mini" type="danger">{{tag}}</el-tag>
            </a>
          </template>
        </el-table-column>
         <el-table-column
          prop="comment"
          label="允许评论"
          width="80">
          <template slot-scope="scope" > 
            <i v-if="scope.row.comment == true" class="el-icon-check"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="pv"
          label="Pv"
          width="80">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="left" width="85" :filters="status" :filter-method="filterStatus">
          <template scope="scope">
            <div>
             <el-tag v-if="scope.row.status == 0"  size="small" type="danger">未发布</el-tag>
             <el-tag v-else-if="scope.row.status == 1"  size="small">发布</el-tag>
            </div>
          </template>
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
        <el-table-column label="操作"         
          width="180"
        >
          <template scope="scope">
              <el-button size="small" @click="onedit(scope.row)">编辑</el-button>
              <el-dropdown trigger="click">
                  <el-button size="small">
                      更多<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="onpublish(scope.row)" >{{scope.row.status == 0 ? "发布" : "撤回"}}</el-dropdown-item>
                    <el-dropdown-item @click.native="onremove(scope.row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  <el-pagination
    :page-size="pageSize"
    :current-page.sync="page"  
    layout="total, prev, pager, next"
    :total="total"
    @current-change="onPageChanged"
    background>
  </el-pagination>

    <ArticelEditor ref="posteditor"/>
  </div>
</template>

<script>
import moment from "moment";
import ArticlePannel from "./ArticlePannel";
import ArticelEditor from "./ArticleEditor";
export default {
  components: {
    ArticlePannel,
    ArticelEditor
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      page: 1,
      total: 0,
      status: [
        {
          value: 0,
          text: "待发布"
        },
        {
          value: 1,
          text: "发布"
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.page = parseInt(this.$route.params.page || 1);
    this.load();
  },
  methods: {
    load() {
      this.$http("/api/mgr/article/query", {
        params: {
          pageSize: this.pageSize,
          page: this.page
        }
      }).then(res => {
        if (!res.error) {
          this.list = res.list;
          this.total = res.total;
          this.page = res.page;
        }
      });
    },
   
    filterStatus(value, row) {
      return value == row.status;
    },
    onadd() {
      this.$refs["posteditor"].show(null, result => {
        this.load();
      });
    },
    onedit(post) {
      this.$refs["posteditor"].show(post, result => {
        this.load();
      });
    },
    onremove(post) {
      this.$confirm("此操作将永久删除 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http("/api/mgr/article/remove", {
          params: {
            id: post.id
          }
        }).then(res => {
          if (!res.error) {
            this.$message("成功删除");
            this.list.splice(this.list.indexOf(post), 1);
          }
        });
      });
    },
    onpublish(post) {
      const publish = post.status == 0;
      this.$http("/api/mgr/article/publish", {
        params: {
          id: post.id,
          publish
        }
      }).then(res => {
        if (!res.error) {
          this.$message(publish ? "发布成功" : "已撤回");
          post.status = publish ? 1 : 0;
        }
      });
    },
    onPageChanged(page) {
      this.$router.push({ path: "/article/" + page });
      this.load();
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
  /* background-color: bisque; */
}
.toolbar {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 50px;
  max-height: 50px;
  min-height: 50px;
  background: #f2f2f2;
  margin-bottom: 10px;
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
  background-color: aqua;
  overflow-y: scroll;
}
.navi {
  display: flex;
  flex-direction: row;
}
</style>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
