import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        config: {
            setting: {},
            cates: { list: [] },
            link: { list: [] },
            tags: { list: [] },
        },
    },
    mutations: {
    },
    getters: {

    },

})

const plugins = {}
const methods = {
    postURL(post) {
        return `/p/${post._k}`
    },
    cateURL(post) {
        return `/c/${post.category_name}`
    },
    tagURL(tag) {
        return `/tag/${tag}`
    },
    gmtDateFormatter(time, fmt) {
        return moment(time).format(fmt || "YYYY/MM/DD");
    },
    loadScript(url, callback) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (typeof callback == "function") {
            script.onload = script.onreadystatechange = function () {
                if (
                    !this.readyState ||
                    this.readyState === "loaded" ||
                    this.readyState === "complete"
                ) {
                    callback();
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        head.appendChild(script);
    },
    register(name, code) {
        if (!plugins[name]) {
            plugins[name] = { code };
        }
    },
    loadPlugin(name) {
        const p = plugins[name]
        if (!p.instance && p.code && p.code.length > 0) {
            try {
                const fn = new Function("context", "return " + code);
                fn.call(this, { loadScript });
                p.instance = true
            } catch (error) {
                // console.log('load plugin error:', error)
            }
        }
    }
}


Object.keys(methods).forEach((key) => {
    store[key] = methods[key];
});
export default store;
