# Sentry支持SourceMap指引

> Sentry是一个错误上报服务，我们让它支持SourceMap，有一些坑要踩

*2017-07-12*

1\. 确保config/index.js中，productionSourcemap开启：

```js
module.exports = {
  // ...
  productionSourceMap: true,
  // ...
}
```

2\. 进入sentry主页，点击左下角图标-Account-API<br>
（或直接打开 https://sentry.io/api/、https://sentry.mycorp.com/api/ ），<br>
新建一个token，注意带有"project:write"权限。

3\. 在项目根目录新建sentry.conf.js，存放该token以及其他sentry信息：

```js
module.exports = {
  organisation: 'myorg', // 可以从URL看出，如`sentry.io/myorg/myprj`，则org是`myorg`
  project: '{{project}}', // 如`sentry.mycorp.com/sentry/pc/`，则org是`sentry`，project是`pc`
  apiKey: '{{token}}'
}
```

4\. 安装webpack-sentry-plugin，拓展build/webpack.prod.conf.js：

```sh
npm i -D webpack-sentry-plugin
```

```js
  plugins: [
    // ...
    new SentryPlugin(Object.assign({
      release: process.env.RELEASE_VERSION,
      deleteAfterCompile: true,
      suppressErrors: true,
      filenameTransform: function (filename) {
        // pub必须是完整uri 如`//xxx.com/xx/`或`/xx/` 而不能是``或`xx/`等
        var pub = config.build.assetsPublicPath
        if (/^\/\//.test(pub)) pub = 'http:' + pub // 补全协议以解析pathname
        var urlObj = require('url').parse(pub)
        return '~' + urlObj.pathname.replace(/\/+$/, '') + '/' + filename
      }
    }, require('../sentry.conf.js')))
  ]
  如果deleteAfterCompile设为false，则必须在发布环节屏蔽sourcemap，不让终端用户接触到：
gulp.task('upload:static', function () {
  // sourcemap仅提供给sentry 不公开至cdn
  return gulp.src(['dist/static/**/*', '!dist/static/**/*.map'])
    .pipe(oss(ossConfig, {
      headers: ossHeaders,
      uploadPath: 'quiz/static/'
    }))
})
```

5\*\. 如果是内网 sentry.mycorp.com，则需补充sentry.conf.js，<br>
同时安装ssl-root-cas，并引入mycorp.crt证书，证书可保存在合适的路径：

```js
// sentry.conf.js
module.exports = {
  baseSentryURL: 'https://sentry.mycorp.com/api/0/projects', // 需要补充这行
  organisation: 'sentry',
  project: '{{project}}',
  apiKey: '{{token}}'
}
```

```sh
npm i -D ssl-root-cas
```

```js
// build/webpack.prod.conf
// ...
// node请求mycorp域名 需注入对应证书
// https://stackoverflow.com/questions/31673587/error-unable-to-verify-the-first-certificate-in-nodejs
var rootCas = require('ssl-root-cas/latest').create()
rootCas.addFile(path.resolve(__dirname, '../config/ssl/mycorp.crt'))
```

6\. 拓展config/prod.env.js：

```js
// https://stackoverflow.com/questions/34518389/get-hash-of-most-recent-git-commit-in-node
var gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()

// note: sentry raven-js release参数 被迫自动截取前7位 所以此处也应与其统一
gitSha = gitSha.substr(0, 7)
 
process.env.RELEASE_VERSION = gitSha

module.exports = {
  RELEASE_VERSION: `"${gitSha}"`,
  NODE_ENV: '"production"'
}
```

7\. 调用Raven.config时，补充release参数：

```js
Raven
  .config(dsn, {
    release: process.env.RELEASE_VERSION
  })
  .addPlugin(RavenVue, Vue)
```

完成以上步骤即可生效，npm run build构建时，会自动上传artifacts到sentry。
我们可以在项目中某个不起眼的地方，添加一处click事件，throw一个错误，用于测试。
项目示例：

**常见问题**

如果某个已上报的错误，sourcemap没生效，并展示类似如下的信息：<br>
Remote file took too long to load: (15s, http://static-cdn.myservice.org/xxxxx/static/js/vendor.4d8c7ab2977e9bf547d8.js)<br>
则可能是sentry没有及时获取到js（因为采用了不上传js到sentry的模式），导致sourcemap没及时生效<br>
解决方法：等待该错误的下一次上报，会出现一个新的event，并且sourcemap生效。<br>
https://forum.sentry.io/t/js-source-maps-issue/432/6

**参考链接**

- https://docs.sentry.io/clients/javascript/sourcemaps
- https://github.com/40thieves/webpack-sentry-plugin
- https://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps.html
- https://stackoverflow.com/questions/31673587/error-unable-to-verify-the-first-certificate-in-nodejs
- https://forum.sentry.io/t/js-source-maps-issue/432/6
