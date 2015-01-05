# 使用n0gx进行内部转发

*2015-01-05*

## 背景

什么是反向代理？平时所说的代理是为客户端做中介，隐藏的是客户端的身份；而反向代理则是为服务端做中介，正好相反，其功能包括内部转发(Inner Forwarding)、安全过滤、负载均衡等等。

对于我的vps来说，暂时只用到了内部转发：

- /static 静态到 ~/dev/static
- /voice1min 派遣到 监听3099端口的唱吧
- /blog 重定向到 github上的blog
- 404 重定向到 /blog

nginx配置看着蛋疼，我一直想用node实现一个，于是有了[n0gx](https://github.com/fritx/n0gx)。

## n0gx的原理

将这里用到的内部转发归纳为三点：

- 静态(static)
- 重定向(redirect)
- 派遣(dispatch)

n0gx的工作方式：

- 从json/js文件中读取配置
- 由express支撑web服务
- express顺带提供static/redirect支持
- 另由http-proxy提供dispatch支持

## n0gx的使用

n0gx更多的是作为命令行工具使用，npm全局安装：

```
$ npm i -g n0gx
```

这是个简单的[配置样例](https://github.com/fritx/n0gx/blob/master/example)：

```js
// n0gx.conf.json
{
  "static": {
    "/static": "./example/static"
  },
  "dispatch": {
    "/voice1min": "http://fritx.me/voice1min",
    "/blog_local": "http://127.0.0.1:8080/blog"
  },
  "redirect": {
    "/blog": "http://fritx.me/blog"
  },
  "404": "/blog",
  "listen": 80
}
```

启动n0gx：

```
$ n0gx ./n0gx.conf
```

如果你使用pm2管理node进程：

```
$ which n0gx
> /root/local/bin/n0gx
$ pm2 start /root/local/bin/n0gx ./n0gx.conf
```

[Unitech/PM2#917](https://github.com/Unitech/PM2/issues/917#issuecomment-68645387)我已经提了，相信不久后就可以直接：

```
$ pm2 start n0gx ./n0gx.conf
```

## 结语

这是效果：

- <http://fritx.me/voice1min> 派遣到 3099端口上的唱吧
- <http://fritx.me/blog> 重定向到 github上的blog
- <http://fritx.me/> 重定向到 /blog
- <http://fritx.me/not-found> 404依然重定向 /blog

n0gx纯属个人爱好。论性能和功能齐全，比不上nginx，还是老老实实地去学吧。

## 参考阅读

- [抛弃Nginx使用nodejs做反向代理服务器](http://www.jb51.net/article/52256.htm)
- [nginx 配置从零开始](http://www.kuqin.com/shuoit/20141229/344156.html)
- [NodeJS on Nginx: 使用nginx反向代理处理静态页面](http://ourjs.com/detail/nodejs-on-nginx-%E4%BD%BF%E7%94%A8nginx%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E5%A4%84%E7%90%86%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2)
