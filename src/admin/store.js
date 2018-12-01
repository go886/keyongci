import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: null,
        config: {
        }
    },
    mutations: {
    },
    getters: {

    },

})

const methods = {
    postURL(post) {
        return `/p/${post._k}`
    },
    cateURL(post) {
        return `/c/${post.category_name}`
    },
    tagURL(tag){
        return `/tag/${tag}`
    },
    gmtDateFormatter(time, fmt) {
        return moment(time).format(fmt || "YYYY/MM/DD");
    },
    openCate(category_name) {
        window.open("/c/" + category_name);
    },
    openPost(post) {
        window.open(this.postURL(post))
    },
    dateFormatter(row, column, value, index) {
        return moment(value).format("YYYY/MM/DD");
    }
}


Object.keys(methods).forEach((key) => {
    store[key] = methods[key];
});
export default store;
