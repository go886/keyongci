const mgr = require('./manager')

module.exports = {
    async query(ctx) {
        const cates = await mgr.cate.query()
        const link = await mgr.link.query()
        const setting = await mgr.setting.get()
        const tags = await mgr.tag.query()
        return { cates, link, setting, tags }
    },
}