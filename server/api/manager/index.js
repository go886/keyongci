const mgr = require('../../model/index')
const ex = require('./example')

module.exports = {
    user: require('./user'),
    cate: require('./category'),
    tag: require('./tags'),
    article: require('./article'),
    link: require('./links'),
    setting: require('./setting'),
    about: require('./about'),
}

module.exports.cate.add({ q: { name: 'net', title: '网络' } })
module.exports.cate.add({ q: { name: 'block', title: '区块链' } })

