/**
 * Created by fritx on 5/7/14.
 */

;(function(){
  $.fn.addAttr = function(key){
    return $(this).attr(key, '')
  }
  $.fn.hasAttr = function(key){
    return $(this).attr(key) != null
  }
})();

;(function () {

  var pageBase;
  var pageExt;
  var defaultPage;
  var mainPage;
  var mainTitle;
  var entryUrl;
  var onlineUrl;
  var shortName;


  function load(sel, stack, isMain, callback) {
    if (typeof stack === 'string') {
      if (/\/$/.test(stack)) {
        stack = [
          stack + 'index',
          stack + 'README',
          stack.replace(/\/$/, '')
        ];
      } else {
        stack = [
          stack,
          stack + '/index',
          stack + '/README'
        ];
      }
    }

    var page = stack.shift();
    isMain = isMain || false;
    if (isMain) {
      onlineUrl = entryUrl + '?' + page;
    }

    var url = pageBase + page + pageExt;
    var dir = url.replace(
      new RegExp('[^\\/]*$', 'g'), ''
    );
    $.ajax({
      url: url,
      error: function(err) {
        if (stack.length) {
          return load(sel, stack, isMain, callback);
        }
        onNotFound(err);
      },
      success: function (data) {
        render(data, function (err, html) {
          if (err) {
            return console.error('render err', err);
          }
          var $el = $(sel);
          $el.hide().html(html);

          $el.find('[src]').each(function () {
            var $el = $(this);
            $el.attr('src', function (x, old) {
              if ($el.attr('data-noop') != null) {
                return old;
              }
              if (isAbsolute(old)) {
                return old;
              }
              return resolve(dir + old);
            });
          });

          $el.find('[href]').each(function () {
            var $el = $(this);
            $el.attr('href', function (x, old) {
              if (isAbsolute(old)) {
                $el.attr('target', '_blank');
                return old;
              }
              if (/^\?/.test(old)) {
                // supports in-site ?-search
                return old;
              }
              var prefixed = resolve(dir + old);
              var hashRegex = new RegExp('#.*');
              var hash = (function (match) {
                return match && match[0] || '';
              })(old.match(hashRegex));
              var dehashed = prefixed.replace(hashRegex, '');

              var extRegex = new RegExp(slashes(pageExt) + '$');
              if (extRegex.test(dehashed) || /\/$/.test(dehashed)) {
                return '?' + dehashed.replace(
                    new RegExp('^' + slashes(pageBase)), ''
                  ).replace(extRegex, '') + hash;
              }
              if (new RegExp('^\\.\\/').test(old)) {
                // ./ heading for new tag
                $el.attr('target', '_blank');
              }
              return prefixed;
            });
          });

          $el.find('p').each(function () {
            var $el = $(this);
            $el.html(function (x, old) {
              return old.replace(/\n+/g, '');
            });
          });

          $el.find('pre code').each(function(i, el){
            hljs.highlightBlock(el)
          })

          $el.show().addAttr('data-loaded');
          if (isMain) onMainRendered();
          if (callback) callback();
        });
      }
    });
  }

  function onMainRendered() {
    mainTitle = $('#main-page')
      .find('h1, h2, h3, h4, h5, h6')
      .first().text();
    var navTitle = autoTitleFavicon(mainTitle);
    document.title = navTitle;

    $('#disqus_thread').empty();
    comments();
    shares();
  }

  function onNotFound() {
    if ($('#main-page').hasAttr('data-loaded')) {
      onMainRendered();
    } else if (location.search) {
      location.href = '.';
    }
  }

  function slashes(str) {
    return str.replace(/([.?*+^$!:\[\]\\(){}|-])/g, '\\$1');
  }

  function isAbsolute(url) {
    return !url.indexOf('//') || !!~url.indexOf('://');
  }

  function resolve(path) {
    var segs = path.split('/');
    var buf = [];
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if (seg === '.') continue;
      var last = buf[buf.length - 1];
      if (seg === '..' && last && last !== '..') {
        buf.pop();
        continue;
      }
      buf.push(seg);
    }
    return buf.join('/') || '.';
  }

  // How to detect if the OS is in dark mode in browsers?
  // https://stackoverflow.com/questions/50840168/how-to-detect-if-the-os-is-in-dark-mode-in-browsers
  // https://caniuse.com/?search=prefers-color-scheme
  // https://caniuse.com/?search=matchMedia
  var isDarkMode = false
  var darkModeChangeHandlers = []
  if (typeof window.matchMedia === 'function') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDarkMode = true
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      isDarkMode = !!e.matches
      darkModeChangeHandlers.forEach(function (handler) {
        handler()
      })
    })
  }

  // TODO library extraction: title-favicon & text-favicon & emoji-detect
  // How to detect emoji using javascript
  // https://stackoverflow.com/questions/18862256/how-to-detect-emoji-using-javascript
  // +modification title-favicon bugfix: recognize emoji `✋🏻` `💁‍♀️` `👨‍👩‍👧‍👦`
  var emojiCellRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+/
  var emojiRegex = new RegExp(emojiCellRegex.toString().replace(/^\/(.+)\/$/, '(?:[\\u200d]*$1)+[\\ufe0f]*'))
  var emojiPrefixRegex = new RegExp(emojiRegex.toString().replace(/^\/(.+)\/$/, '^$1'))
  var anyPrefixRegex = new RegExp(emojiPrefixRegex.toString().replace(/^\/\^(.+)\/$/, '^(?:$1|.)'))

  // Use emoji as favicon in websites
  // https://stackoverflow.com/questions/59431371/use-emoji-as-favicon-in-websites
  var lastFavicon = ''
  function setFavicon(s) {
    try {
      var canvas = document.createElement('canvas')
      canvas.height = 32
      canvas.width = 32
      var ctx = canvas.getContext('2d')
      var isEmoji = emojiPrefixRegex.test(s)
      ctx.font = isEmoji ? '28px serif' : '32px serif'
      ctx.fillStyle = isDarkMode ? 'orange' : '#336699' // for text color
      ctx.textAlign = 'center'
      ctx.fillText(s, 16, 24)
      var dataUrl = canvas.toDataURL()

      var parent = document.querySelector('head') || document.documentElement
      var rels = ['icon']
      rels.forEach(key => {
        var link = document.querySelector('link[rel=' + key + ']')
        if (link) {
          link.setAttribute('href', dataUrl)
        } else {
          link = document.createElement('link')
          link.setAttribute('rel', key)
          link.setAttribute('href', dataUrl)
          parent.appendChild(link)
        }
      })

      lastFavicon = s
      return true // success flag
    } catch (err) {
      // ignore
      // keep it save in case of browser compatibility issues
      console.error('setFavicon', err)
    }
  }
  darkModeChangeHandlers.push(function () {
    if (lastFavicon) setFavicon(lastFavicon)
  })

  function detectShouldApplyFavicon() {
    var ua = navigator.userAgent
    var isMobile = /Mobile[\/ ]|Android|iPad/.test(ua) // confidence: high
    var isHuaweiBr = /HuaweiBrowser/.test(ua) // confidence: high
    var isWechat = /MicroMessenger|Wechat|Weixin/.test(ua) // confidence: high
    var isQQ = /M?QQBrowser/.test(ua) // confidence: high
    var isSafari = /Version\/[\d.]+\s+Safari/.test(ua) // confidence: low
    return !isWechat && !isSafari && (isMobile ? isHuaweiBr || isQQ : true)
  }
  var shouldApplyFavicon = detectShouldApplyFavicon()

  function autoTitleFavicon(mainTitle, emojiOnly) {
    var regex = emojiOnly ? emojiPrefixRegex : anyPrefixRegex
    var navTitle = mainTitle
    if (!shouldApplyFavicon) return navTitle

    var matched = mainTitle.match(regex)
    if (matched) {
      var prefix = matched[0]

      var success = setFavicon(prefix)
      if (success && emojiPrefixRegex.test(mainTitle)) {
        navTitle = mainTitle.replace(regex, '').trim() // replace only if emoji
      }
    }
    return navTitle
  }

  function disqus(name, title, id, url) {
    window.disqus_shortname = name;
    window.disqus_title = title;
    window.disqus_identifier = id;
    window.disqus_url = url;

    var dsq = document.createElement('script');
    dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    document.getElementsByTagName('body')[0].appendChild(dsq);
  }

  config();
  start();


  function render(data, callback) {

    //// Optional template renderer
    marked(data, callback);
  }

  function comments() {

    //// Optional comment system
    disqus(shortName, mainTitle, mainPage, onlineUrl);
  }

  function shares() {

    //// Optional share system
  }

  function start() {
    var seg = location.search.slice(1)
      .replace(/&.*$/g, '')

    // fucking wechat again
    // like /?graduation-thanks=
    // or /?graduation-thanks=/ (SublimeServer)
    seg = seg.replace(/=[\/\\]*$/, '')

    // fucking wechat pending
    // like /?from=singlemessage&isappinstalled=0
    if (/=/.test(seg)) seg = null
    mainPage = resolve(seg || defaultPage);

    load('#sidebar-page', 'sidebar');
    load('#main-page', mainPage, true);
  }

  function config() {
    var renderer = new marked.Renderer()

    // 实现trello的 超链接效果 自动识别github issues
    var _link = renderer.link
    renderer.link = function(href, title, text) {
      if (text === href) {
        var tx = ''

        var mat = href.match(/github\.com\/(.+)\/(.+)\/(issues|pull)\/(\d+)(#(.+))?/)
        if (mat) {
          // tx = mat[1] +'/'+ mat[2] +': Issue #'+ mat[4] // trello
          tx = mat[1] +'/'+ mat[2] +'#'+ mat[4] // github
          if (mat[6]) tx += ' (comment)'
        }
        else if (mat = href.match(/github\.com\/(.+)\/(.+)\/commit\/([0-9a-f]+)/)) {
          // tx = mat[1] +'/'+ mat[2] +': '+ mat[3].slice(0, 7) // trello
          tx = mat[1] +'/'+ mat[2] +'@'+ mat[3].slice(0, 7) // github
        }
        else if (mat = href.match(/github\.com\/(.+)\/(.+)\/blob\/([^/]+)\/(.+)/)) {
          tx = mat[1] +'/'+ mat[2] +' - '+ mat[4]
        }
        else if (mat = href.match(/github\.com\/(.+)\/([^/]+)/)) {
          tx = mat[1] +'/'+ mat[2]
        }

        if (tx) {
          var $a = $('<a>').text(tx)
            .attr({
              'class': 'known-service-link',
              href: href,
              title: title
            })
          var $icon = $('<img>')
            .attr({
              'data-noop': '',
              'class': 'known-service-icon',
              src: 'p/github.png'
            })
          $a.prepend($icon)
          return $a.prop('outerHTML')
        }
      }
      return _link.call(renderer, href, title, text)
    }

    marked.setOptions({
      renderer: renderer,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    //// For comment systems
    entryUrl = 'http://fritx.github.io/blog/';
    shortName = 'fritx-blog';

    pageExt = '.md';
    pageBase = 'p/';
    defaultPage = 'projects';
  }

})();


;(function(){

  $('body > .duck').remove()
  var names = [
    '2010072611150872',
    '2010072611151106',
    '2010072611151148'
  ]
  var ext = '.gif'

  var src = 'p/ducks/' + sample(names) + ext
  $('<img>').addClass('duck')
    .attr('src', src)
    .appendTo('body')


  function sample(arr){
    var idx = parseInt(Math.random() * arr.length)
    return arr[idx] || null
  }

})();
