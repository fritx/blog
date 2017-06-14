# 移动端webapp适配笔记

*2017-06-11*

**1. 引入fastclick 改善移动端click响应**  
[Eliminate 300ms delay on click events in mobile Safari](https://stackoverflow.com/questions/12238587/eliminate-300ms-delay-on-click-events-in-mobile-safari)

最佳答案提到的`touch-action: manipulation`，我用成功，我还是用的fastclick。  
[vux](https://github.com/airyland/vux/blob/0142c9f236ee7bd1648a70d3a595d376afc75ea4/src/main.js#L121)和[vue-weui](https://github.com/adcentury/vue-weui/blob/49cecade9b759fc18b127c4610feb4dfe6e1cbe5/examples/main.js#L69)都在用。

```js
// main.js
import fastclick from 'fastclick'
fastclick.attach(document.body)
```

---

**2. iOS fastclick+select标签 键盘弹出又自动收起bug**  
https://github.com/ftlabs/fastclick/issues/268: [Safari iOS] Select inputs closes on fast tap since issue #226 fix

```diff
// 把#226 revert掉就好了 
// lib/fastclick.js
   // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
   // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
-  if (!deviceIsIOS || targetTagName !== 'select') {
+  // if (!deviceIsIOS || targetTagName !== 'select') {
+
+  // iOS select focus problem
+  // https://github.com/ftlabs/fastclick/issues/446#issuecomment-200849406
+  if (!deviceIsIOS4 || targetTagName !== 'select') {
     this.targetElement = null;
     event.preventDefault();
   }
```

```sh
# 或者直接安装修复了的fork
npm i -S "git+https://github.com/fritx/fastclick.git#fix/ios-select"
```

---

**3. 修复iOS touch会触发全局灰色的overlay**  
[Prevent grey overlay on touchstart in mobile Safari/Webview](https://stackoverflow.com/questions/5106934/prevent-grey-overlay-on-touchstart-in-mobile-safari-webview)

```css
a {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
```

---

**4. 修复iOS “x月x日周x”被识别 并弹出面板影响点击**  
[How can I disable meta format-detection on iOS for dates?](https://stackoverflow.com/questions/8249770/how-can-i-disable-meta-format-detection-on-ios-for-dates)

`<meta name="format-detection" content="date=no">`  
在iOS-8及以下貌似不起作用，因此改为向text中添加0宽度特殊字符。

```html
<span>{{ avoidDetection(tab.name) }}</span>
```

```js
function avoidDetection (text) {
  return text.split('').join('\u200B')
}
```

---

**5. 修复iOS 局部滚动 易触发页面整体滚动**  
[iOS Safari – How to disable overscroll but allow scrollable divs to scroll normally?](https://stackoverflow.com/questions/10238084/ios-safari-how-to-disable-overscroll-but-allow-scrollable-divs-to-scroll-norma)

关于scrollfix，可参考：  
https://github.com/fritx/scrollfix / 
https://github.com/mobkits/scrollfix / 
https://github.com/joelambert/ScrollFix

```sh
npm i -S "git+https://github.com/fritx/scrollfix.git"
```

```html
<template>
  <div ref="appCont">
    <ul ref="scrollCont"></ul>
    <ul ref="scrollCont"></ul>
  </div>
</template>

<script>
export default {
  mixins: [ScrollfixMixin]
}
</script>
```

```js
// Scrollfix.mixin.js
// todo: 封装成库 vue-scrollfix-mixin
import scrollfix from 'scrollfix'

export default {
  computed: {
    appCont () {
      return this.$refs.appCont
    },
    scrollContArr () {
      let { scrollCont } = this.$refs
      let arr = []
      if (scrollCont) {
        if (Array.isArray(scrollCont)) {
          arr = scrollCont
        } else {
          arr = [scrollCont]
        }
      }
      return arr
    }
  },

  mounted () {
    if (this.appCont) scrollfix.setup()
    this.scrollContArr.forEach(scrollfix.bind)
  },
  beforeDestroy () {
    this.scrollContArr.forEach(scrollfix.unbind)
    if (this.appCont) scrollfix.cleanup()
  }
}
```

---

**6. (未完待续...)**

---

**-1. 延伸阅读: [iOS与Android平台上问题列表](https://github.com/AlloyTeam/Mars/tree/master/issues)**
