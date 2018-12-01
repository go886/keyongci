const mgr = require('../../model/index').tag
module.exports = {
    async query(ctx) {
        return mgr.search()
    },
}