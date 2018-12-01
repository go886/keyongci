<template>
  <div id="app">
    <Header/>
    <div class="container">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  name: "app",
  components: {
    Header
  },
  data() {
    return {
      data: null
    };
  },
  computed: {},

  created() {}
};
</script>

<style scoped>
#app {
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #f0f2f5;
  align-items: center;
}

.headerbg {
  height: 260px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100;
}
.container {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: stretch;
}

.left {
  padding: 30px 18px 30px 18px;
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  max-width: 65%;
  /* max-width: 960px; */
}

.sider {
  flex-basis: 10%;
  max-width: 320px;
}

@media screen and (max-width: 1199px) {
  .left {
    max-width: 80%;
  }
}

@media (max-width: 767px) {
  .sider {
    max-width: 0px;
  }
  .left {
    max-width: 90%;
  }
  .headerbg {
    height: 220px;
  }
}

.footer {
  display: flex;
  flex-direction: row;
  height: 45px;
  min-height: 45px;
  max-height: 45px;
  line-height: 45px;
}
.slide-fade {
  position: absolute;
  left: 0;
  right: 0;
}
.slide-fade-enter-active {
  transition: all 1.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(2, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  left: 0;
  right: 0;
  transform: translateX(50px);
  opacity: 0;
}
</style>
<style>
body {
  margin: 0px;
  padding: 0px;
  min-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  background-color: rgba(0, 0, 0, 0.65);
}
a {
  color: #0099ff;
  text-decoration: none;
}
a:hover {
  color: #ff6600;
  text-decoration: none;
}
h {
  color: #333;
  color: #111111;
}
</style>

