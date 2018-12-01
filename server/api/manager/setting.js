const kv = require('../../model/index').kv
module.exports = {
    async update(ctx) {
        return await kv.set('syssetting', ctx.q)
    },
    async get(ctx) {
        return await kv.get('syssetting', {
            name: 'lege2005 blog',
            title: 'hello 2018',
            desc: 'c++/java ',
            keywords: '互联网|区块连',
            theme: 'default',
            plugin_tracker: 'var _hmt = _hmt || []; \
            (function() {\
              var hm = document.createElement("script"); \
              hm.src = "https://hm.baidu.com/hm.js?aa92d109cb6e0d52a672e26e4515c0a9";\
              var s = document.getElementsByTagName("script")[0]; \
              s.parentNode.insertBefore(hm, s);\
            })();',
        });
    },
}