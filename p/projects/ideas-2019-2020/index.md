# 💡 创意产品 (2019~2020)

_2020-06-14_

#### 1. Demo 集合「Coldemo」 <sup>[源码](https://github.com/coldemo/gallery.code)</sup> <sup>[体验](https://coldemo.js.org/)</sup>

- **技术栈**：ts, react-hooks, ant-design, webworker, babel-standalone
- **功能**：类似 codepen 的 demo 集合资源站点，以及相应的实时 coding 预览功能，同 codepen jsbin jsfiddle
- **优势**：1. 同一站点，支持跨框架跨语言，如不但涵盖 react vue ts 等前端 demo，还涵盖 python markdown ppt 等其他语言，以及计划支持如 regexp sql 等 dsl 的相应可视化 2. 界面上采用极简的双栏结构，减小认知成本，响应式支持 mobile 端浏览且体验好 3. 实现上采用最简单直接的 umd 加载及解析方式，横向易拓展，复杂度可控 4. 版式固定、ROI 高，可输入资源、可输出场景多，如 demo 展示、问题演示、可视化等

<div class="cols cols-3">
<img src="https://fritx.me/resume/WX20200517-233621@2x.png">
<img src="https://fritx.me/resume/WX20200517-234821@2x.png">
<img src="https://fritx.me/resume/WX20200517-234954@2x.png">
</div>

#### 2. 桌面应用「Nofred」

- **技术栈**：ts, electron-builder, react-hooks, ant-design, resolve-link-target
- **功能**：一款 electron+node 实现的 类 Alfred 的跨平台 PC 应用(桌面 App)。支持 Alfred 的核心功能，如快捷键换出搜索框，悬浮于屏幕。可输入关键词，匹配任意插件，如 1. open/切换至应用、kill 进程/quit 应用 2. 文件搜索/计算器/翻译 3. 网址收藏夹/自定义 action 等等。包括内置基础插件，及用户自定义插件，可组建插件应用商店
- **优势**: 插件书写自由，开发便捷，60 行以内一个插件

<div class="cols cols-2">
<img src="https://fritx.me/resume/WechatIMG11.jpeg">
<img src="https://fritx.me/resume/WechatIMG12.jpeg">
</div>

#### 3. 微信小程序「内容分享」

- **技术栈**：ts, koa2, ioredis, http-proxy, cheerio, puppeteer
- **功能**：一块微信小程序，后台支持多大 50+主流站点的信息提取，如微信公众号、腾讯视频、抖音、美拍、美图、知乎、淘宝等等。复制页面 URL，即可自动识别粘贴板，提示一键进入简化重拍版后的内容页面。持续 2 年半，累计用户 5000+
- **优势**：1. 支持将抖音、淘宝等优质内容转发指微信 2. 转发展示的内容经过简化重拍版，省略一些加载慢的页面资源 3. 关键标题/描述信息上屏，呈现在分享卡片上，信息传播效果好 4. 后台多层级缓存支持，加载快，可快照 5. 安卓用户还可用作独立 App 窗口与微信聊天界面并行使用

<div class="cols cols-4">
<img src="https://fritx.me/resume/WechatIMG14.jpeg">
<img src="https://fritx.me/resume/WechatIMG9.jpeg">
<img src="https://fritx.me/resume/WechatIMG5.jpeg">
<img src="https://fritx.me/resume/WechatIMG7.jpeg">
</div>

<style>
.cols { max-width: 620px; font-size: 0; display: flex; justify-content: space-between }
.cols-2 * { width: 49% }
.cols-3 * { width: 31% }
.cols-4 * { width: 23% }
</style>
