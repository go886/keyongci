const kv = require('../../model/index').kv
module.exports = {
    async update(ctx) {
        return await kv.set('about', ctx.q)
    },
    async get(ctx) {
        return await kv.get('about')
    },
}