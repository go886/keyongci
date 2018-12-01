<template>
<div>
<el-form label-position="left" :inline="true" class="demo-table-expand">

    <el-form-item label="ID">
        <span>{{ info.id }}</span>
    </el-form-item>
    <el-form-item label="标题">
        <span>{{ info.title }}</span>
    </el-form-item>
    <el-form-item label="Key">
        <span>{{ info._k }}</span>
    </el-form-item>
   
    <!-- <el-form-item label="状态">
                            <pageStatus :info="info" size="mini"/>

    </el-form-item> -->
    <el-form-item label="创建时间">
        <span>{{ gmtDateFormatter(info.add_time) }}</span>
    </el-form-item>
    <el-form-item label="修改时间">
         <span>{{gmtDateFormatter(info.edit_time)}}</span>
    </el-form-item>
</el-form>
</div>
</template>

<script>
import moment from "moment";

export default {
  props: ["info"],
  components: {
  },
  data() {
    return {
     
    };
  },
  computed: {
    
  },
  methods: {
    gmtDateFormatter(time) {
      return moment(time).format("YYYY/MM/DD HH:mm");
    },
  }
};
</script>

<style scoped>
/* .root {
    width: 100%;
} */
</style>
