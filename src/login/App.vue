<template>
  <div id="app">
     <Login />
  </div>
</template>

<script>
import Login from "./components/Login";

export default {
  name: "app",
  components: {
    Login
  }
};
</script>

<style>
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  margin: 0px;
  padding: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
#app {
  color: #2c3e50;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #545c64;
  justify-content: center;
  align-items: center;
}
</style>
