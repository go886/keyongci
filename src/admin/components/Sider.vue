<template>
  <div class="root">
   
    <el-menu :default-active="formatPath($route.path)"  class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse">
        <el-submenu index="1" >
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">内容管理</span>
            </template>
            <el-menu-item v-for="item in managers" :index="formatPath(item.path)" :key="formatPath(item.path)">{{item.name}}</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">系统管理</span>
            </template>
            <el-menu-item v-for="item in settings" :index="item.path" :key="item.path">{{item.name}}</el-menu-item>
        </el-submenu>
    </el-menu>
  </div>
</template>

<script>
/**
 * 分类
 * 热门
 * 最近更新
 * 搜索
 */
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    managers() {
      return this.$router.options.routes.slice(0, -4);
    },
    settings() {
      return this.$router.options.routes.slice(-4);
    },
 
  },
  methods: {
    handleSelect(key) {
      this.$router.push({ path: key });
    },
    formatPath(path) {
      var p = path.split("/")[1];
      return "/" + p;
    },
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
