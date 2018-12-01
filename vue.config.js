module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/home/index.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html'
    },
    // login:{
    //   entry: 'src/login/index.js',
    //   template: 'public/login.html',
    //   filename: 'login.html'
    // },
    // admin: {
    //   entry: 'src/admin/index.js',
    //   template: 'public/admin.html',
    //   filename: 'admin.html'
    // },
  },
  devServer: {
    proxy: 'http://localhost:3080',
  }
}