<template>
  <div class="root">
    <el-table
        :data="tags"
        style="width: 100%;overflow-y: scroll;"
        stripe>
       <el-table-column
        type="index"
        width="100" />
        <el-table-column
          prop="id"
          label="名称"
          >
          <template slot-scope="scope">
            <a :href="$store.tagURL(scope.row.id)" target="_blank" >
              <el-tag style="margin:5px;">{{scope.row.id}}</el-tag>
            </a>
          </template>
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
      </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tags: []
    };
  },
  created() {
    this.$http("/api/mgr/tag/query").then(res => {
      if (!res.error) {
        this.tags = res.list;
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
