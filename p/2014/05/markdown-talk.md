# 浅谈Markdown

*2014-05-28*

## 概述

> Markdown是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的HTML文档。

大家都知道HTML，超文本标记语言，各种`<xx>`标签，构成了网页的内容，再加上样式和脚本，就构成了完整的网页。

“Markdown”，与“HTML”中的“Markup”相对，大概作者认为它是HTML“卸妆”后的朴素原型吧。

## 应用

> 世界上最流行的博客平台WordPress和大型CMS如joomla、drupal都能很好的支持Markdown。

程序员的天堂Github，也大量使用Markdown，用户都在用它来发Issue和写README。
一段时间的“照猫画虎”，我也成忠实粉丝了。

现在能轻松写出[高大上的README][6]，对了，我的[整个博客][7]都是Markdown。

如果你还不会Markdown，这是不错的[新手教程][2]。

## 优势

### 化繁为简——简洁

Markdown省略了HTML中的开闭标签，取而代之以简单形象的符号，使书写和阅读更加轻松、愉悦。

### 有舍有得——专注

Markdown自身语法仅涵盖了最基本的格式，如标题、粗斜体、超链接、图片、列表、引用、代码等。
一般情况下，尽量不去额外嵌入HTML。

因此在写作时，我们可以更专注于“力所能及”的文章内容本身，而非繁杂的标签和过多的排版甚至样式。

### 有迹可循——版本跟踪

- 使用Word，是二进制文件，没有有效的版本比对
- 使用HTML，由于冗余性，版本比对的清晰度不如Markdown

版本跟踪用于掌握文件的更改历史，正如我们在Github上见到的。

## 要点

其实只是我个人的Markdown风格指示，供参考，理由略：

1. 文件后缀名使用`.md`

1. 使用`<br>`换行，而不是尾随的空格

1. 使用`#`/`##`表示标题，而不是紧跟一行`===`/`---`

1. 有序列表前缀全部使用`1.`，而不是`1.`/`2.`/`3.`

1. 无序列表前缀使用`-`，而不是`*`/`+`

1. 渲染器采用如下选项，[marked渲染器选项说明][4]：

  ```js
  {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  }
  ```

## 参考资料

- [Markdown - 维基百科][1]
- [Markdown - 百度百科][5]
- [献给写作者的 Markdown 新手指南][2]
- [Markdown写作浅谈][3]

[1]: http://zh.wikipedia.org/wiki/Markdown
[2]: http://jianshu.io/p/q81RER
[3]: http://jianshu.io/p/PpDNMG
[4]: https://github.com/chjj/marked#options
[5]: http://baike.baidu.com/view/2311114.htm
[6]: ../../projects.md
[7]: https://github.com/fritx/blog
