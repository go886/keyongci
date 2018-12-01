const Router = require('koa-router')
const manager = require('./api/manager')
const api = require('./api')

const router = new Router();
const r = [
  {
    target: manager.user,
    prefix: '/api/mgr/user',
    paths: [
      '/update',
      '/get',
      '/login',
      '/logout',
    ]
  },
  {
    target: manager.cate,
    prefix: '/api/mgr/cate',
    paths: [
      '/add',
      '/remove',
      '/update',
      '/get',
      '/query',
    ]
  },
  {
    target: manager.tag,
    prefix: '/api/mgr/tag',
    paths: [
      '/query',
    ]
  },
  {
    target: manager.article,
    prefix: '/api/mgr/article',
    paths: [
      '/add',
      '/remove',
      '/update',
      '/get',
      '/query',
      '/view',
      '/first',
      '/last',
      '/next',
      '/prev',
      '/count',
      '/publish',
      '/search',
    ]
  },
  {
    target: manager.link,
    prefix: '/api/mgr/link',
    paths: [
      '/add',
      '/remove',
      '/update',
      '/get',
      '/query'
    ]
  },
  {
    target: manager.setting,
    prefix: '/api/mgr/setting',
    paths: [
      '/update',
      '/get',
    ]
  },
  {
    target: manager.about,
    prefix: '/api/mgr/about',
    paths: [
      '/update',
      '/get',
    ]
  },
  {
    target: api.cate,
    prefix: '/api/cate',
    paths: [
      '/get',
      '/query',
    ]
  },
  {
    target: api.article,
    prefix: '/api/article',
    paths: [
      '/get',
      '/query',
      '/archives',
    ]
  },
  {
    target: api.link,
    prefix: '/api/link',
    paths: [
      '/query'
    ]
  },
  {
    target: api.about,
    prefix: '/api/about',
    paths: [
      '/get',
    ]
  },
  {
    target: api.blog,
    prefix: '/api/blog',
    paths: [
      '/query'
    ]
  }
]

r.forEach(v => {
  (function (o) {
    const r = new Router({
      prefix: o.prefix
    });
    o.paths && o.paths.forEach(path => {
      r.all(path, async ctx => {
        try {
          ctx.q = ctx.request.body.params || ctx.query
          var fun = o.target[path.substr(1)]
          var result = await fun.call(o.target, ctx);//await o.target[path.substr(1)].call(o.target, ctx)
          ctx.response.type = 'json'
          ctx.response.body = result||{}
        } catch (error) {
          console.log(error)
        }
      });
    })
    router.use(r.routes())
    router.use(r.allowedMethods())
  })(v)
});
module.exports = router