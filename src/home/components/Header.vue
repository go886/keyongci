<template>
  <div class="root">
    <div>
        <a href="http://localhost:3000/api/mgr/article/view" target="_blank">view</a>
      </div>
      <div>
        <a href="http://localhost:3000/api/mgr/article/add" target="_blank">article_add</a>
      </div>
            <div>
        <a href="http://localhost:3000/api/mgr/article/first" target="_blank">article_first</a>
      </div>
            <div>
        <a href="http://localhost:3000/api/mgr/article/last" target="_blank">article_last</a>
      </div>
         <div>
        <a href="/login.html" target="_blank">login</a>
      </div>
      <div>
        <a href="/admin.html" target="_blank">admin</a>
      </div>
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
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
  /* background-color: red; */
  /* min-width: 300px;
  max-width: 300px;
  width: 300px; */
  display: flex;
  flex-direction: column;
}
</style>
