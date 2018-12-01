const manager = require('./manager').link

module.exports = {
    async query(ctx) {
        return await manager.query(ctx)
    },
}