import mock from 'mockjs'

var post = {
    id:1,
    create_time:(new Date()).getTime(),
    edit_time:(new Date()).getTime(),
    category_id:1,
    title:'Title',
    cover:'https://pigjian.com/storage/post_img/2017-04-09/deployer.jpg',
    content:'一个简单易用的 Vue 组件 V - Distpicker',
    tag:[0,1,2,3],
    type:0, //html、makdown、等
    status:0, //0, 未发布, 1、发布, 2、删除
    flag:0, //置顶、加精等
}

mock.mock('/posts', {
  list:[post]
})

export default mock