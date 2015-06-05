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
          stack.replace(/\/$/, '')
        ];
      } else {
        stack = [
          stack,
          stack + '/index'
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
          var $el = $(sel);
          $el.hide().html(html);

          $el.find('[src]').each(function () {
            var $el = $(this);
            $el.attr('src', function (x, old) {
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
    document.title = mainTitle;
    $('#disqus_thread').empty();
    comments();
    shares();
  }

  function onNotFound() {
    if ($('#main-page').hasAttr('data-loaded')) {
      onMainRendered();
    } else {
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

    // fucking wechat pending
    // like /?from=singlemessage&isappinstalled=0
    if (/=/.test(seg)) seg = null
    mainPage = resolve(seg || defaultPage);

    load('#sidebar-page', 'sidebar');
    load('#main-page', mainPage, true);
  }

  function config() {
    marked.setOptions({
      renderer: new marked.Renderer(),
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
    defaultPage = 'tech';
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
