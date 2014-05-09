/**
 * Created by fritx on 5/7/14.
 */

(function () {

  var pageBase = 'p/';
  var pageExt = 'md';
  var mainUrl = location.search.slice(1);


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
  }

  function render(data, options, callback) {
    marked(data, options, callback);
  }

  function load(sel, url, options, callback) {
    url = pageBase + url;
    $.get(url, function (data) {
      render(data, options, function (err, html) {
        if (err && callback) return callback(err);
        var $el = $(sel);
        $el.hide().html(html);

        $el.find('[src]').each(function () {
          var $el = $(this);
          $el.attr('src', function (x, old) {
            if (isAbsolute(old)) {
              return old;
            }
            return url.replace(
              new RegExp('[^\\/]*$', 'g'), ''
            ) + old;
          });
        });

        $el.find('[href]').each(function () {
          var $el = $(this);
          $el.attr('href', function (x, old) {
            if (isAbsolute(old)) {
              $el.attr('target', '_blank');
              return old;
            }
            var prefixed = url.replace(
              new RegExp('^' + pageBase + '|[^\\/]*$', 'g'), ''
            ) + old;
            if (!new RegExp('\\.' + pageExt + '$').test(old)) {
              if (!/(^\.|\/\.?|\.html?)$/.test(old)) {
                $el.attr('target', '_blank');
              }
              return prefixed;
            }
            return '?' + prefixed;
          });
        });

        $el.show();
        if (callback) callback();
      });
    });
  }

  function start() {
    load('#sidebar-page', 'sidebar.md');
    load('#main-page', mainUrl || 'projects/index.md');
  }

  function isAbsolute(url) {
    return !url.indexOf('//') || !!~url.indexOf('://');
  }


  config();
  start();

})();
