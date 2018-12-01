const mgr = require('./manager')

module.exports = {
    async get(ctx) {
        return await mgr.about.get(ctx)
    },
}