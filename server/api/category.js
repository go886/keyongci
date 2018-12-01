const manager = require('./manager').cate
module.exports = {
    async get(ctx) {
        return await manager.get(ctx)
    },
    async query(ctx) {
        return await manager.query(ctx)
    },
}