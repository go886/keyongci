const mgr = require('../../model/index').category
module.exports = {
    async add(ctx) {
        const query = ctx.q
        const item = await mgr.findOne({'name': query.name})
        if (item) return { error: 'cateory exists' }

        const id = await mgr.add({name:query.name, title:query.title})
        return { id }
    },
    async remove(ctx) {
        return { id: await mgr.remove(ctx.q.id) }
    },
    async update(ctx) {
        let id = await mgr.update(ctx.q)
        return { id }
    },
    async get(ctx) {
        return await mgr.get(ctx.q.id)
    },
    async query(ctx) {
        return await mgr.search()
    },
}