import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import Home from './components/Home'

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/',
            name: '首页',
            component: Home,
        }
    ]
});

router.beforeEach((to, from, next) => {
    next();
})

export default router;
