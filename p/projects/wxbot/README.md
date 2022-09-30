# wxbot 微信机器人&nbsp;&nbsp;[![](https://img.shields.io/github/stars/fritx/wxbot?style=social)](https://github.com/fritx/wxbot)

<a href="https://github.com/fritx/wxbot"><img src="../github-badge.svg" width="85" height="20"></a>
&nbsp;&nbsp;<a href="https://gitter.im/fritx"><img src="../gitter-badge.svg" width="99" height="20"></a>

- __普通个人号 微信机器人/外挂__ (不同于[webot](https://github.com/node-webot/webot)等公众号机器人)
- 意义: 个人号可充当公众号使用 关系增强/门槛降低/更多行为/依旧自动化
- 与[qqbot](https://github.com/xhan/qqbot)/[wqq](https://github.com/fritx/wqq)等不同: 基于浏览器/用户行为自动化 更贴近用户/更可靠
- 基于浏览器桌面平台[electron](https://github.com/atom/electron) 跨平台win/linux/mac
- 基于微信网页版 <https://wx.qq.com>
- 目前处于高度开发和观察阶段
- 目前代码提供自动回复 可自行定制

请使用较新版本的electron>=v0.33.2 因为下载语音需要DownloadItem

```plain
$ cd wxbot
$ npm install
$ electron .  # 运行 需扫二维码登录
```

<img width="643" src="screenshot.jpeg">

## 功能实现

- [x] 自动回复
- [x] 识别并回复相同的文本/表情/emoji
- [x] 识别图片/语音/视频/小视频
- [x] 识别位置/名片/链接/附件
- [x] 识别转账/在线聊天/实时对讲
- [x] 发送图片
- [x] 下载自定义表情/名片/图片/语音/附件
- [ ] 下载视频/小视频
- [ ] 感应系统消息 时间/邀请加群/红包等
- [x] 探索运行于无界面平台 [atom/electron#228](https://github.com/atom/electron/issues/228)

## 无界面linux运行

- 从命令行输出 获取二维码图片url 自行打开/扫描
- 参照配置 [segmentio/nightmare#224 (comment)](https://github.com/segmentio/nightmare/issues/224#issuecomment-141575361)
