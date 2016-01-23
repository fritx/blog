# Test on JavaScript

*2014/12/27*


## Assertion Libraries

- Expect
- Should
- Assert

### Expect

```js
expect(window.r).to.be(undefined); 
expect({ a: 'b' }).to.eql({ a: 'b' });
expect(5).to.be.a('number');
expect([]).to.be.an('array');
expect(window).not.to.be.an(Image); 
```

### Should

```js
user.should.have.property('name', 'tj');
user.should.have.property('pets').with.lengthOf(4); 
// Object.create(null) 
should(user).have.property('name', 'tj');
should(true).ok;
```

### Assert

```js
assert.ok(5 === 5)
assert.equal(err, null)
assert.strictEqual(5, 5)
assert.deepEqual({ a: 'b' }, { a: 'b' })
assert.throws(badFn, Error)
```


## Stubs

- Chance
- Faker
- Sinon

### Chance

```js
chance.bool();
//=> true
chance.integer();
//=> -1293235
chance.string();
//=> 'Z&Q78&fqkPq'
chance.color()
//=> '#79c157'
chance.ip()
//=> '153.208.102.234'
```

### Sinon

```js
function getTodos(listId, callback) {
    jQuery.ajax({
        url: "/todo/" + listId + "/items",
        success: function (data) {
            // Node-style CPS: callback(err, data)
            callback(null, data);
        }
    });
}
sinon.stub(jQuery, "ajax");
getTodos(42, sinon.spy());

assert(
    jQuery.ajax.calledWithMatch({ url: "/todo/42/items" })
);
jQuery.ajax.restore();
```

```js
var clock = sinon.useFakeTimers();
$el.animate({ height: "200px", width: "200px" }, 500);

clock.tick(510);
assertEquals("200px", $el.css("height"));
assertEquals("200px", $el.css("width"));
```


## Runners

- QUnit
- NodeUnit
- Jasmine
- Mocha

### Jasmine

```js
describe('AsyncProcess', function() {
    var asyncProcess;
    beforeEach(function() {
        asyncProcess = new AsyncProcess();
    });

    it('should process 42', function() {
        var done = false;
        var processed = null;

        deferred = asyncProcess.process();
        deferred.then(function(result) {
            done = true;
            processed = result;
        });

        waitsFor(function() {
            return done;
        }, "the async process to complete", 10000);

        runs(function() {
            expect(processed).toEqual(42);
        });
    });
});
```

### Mocha

```js
describe('AsyncProcess', function() {
    var asyncProcess;
    beforeEach(function() {
        asyncProcess = new AsyncProcess();
    });

    it('should process 42', function(done) {
        deferred = asyncProcess.process();

        deferred.then(function(processed) {
            processed.should.be.equal(42);
            done();
        });
    });
});
```


## Environments

- Node
- Real Browsers
- Karma
- Phantom
- Casper
- Nightmare

### Phantom

```html
<html>
    <head>
        <title> Tests </title>
        <link rel="stylesheet" href="./node_modules/mocha/mocha.css" />
    </head>
    <body>
        <div id="mocha"></div>
        <script src="./node_modules/mocha/mocha.js"></script>
        <script src="./node_modules/chai/chai.js"></script>
        <script>
            mocha.ui('bdd');
            mocha.reporter('html');
            var expect = chai.expect;
        </script>
        <script src="test/test.js"></script>
        <script>
            if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
            else { mocha.run(); }
        </script>
    </body>
</html>
```


## References

- 五个值得尝试的前端开发工具 http://www.leiphone.com/news/201406/5-great-front-end-dev-tools.html

- 使用Karma来驱动mocha测试 http://www.shenyanchao.cn/blog/2013/03/27/use-karma-to-run-mocha-test/

- 单元测试之Stub和Mock http://www.cnblogs.com/TankXiao/archive/2012/03/06/2366073.html


## Thanks

- WYU Dev Conf & 互诺科技
- Jayin Ton & Jason Lee


## Author

@fritx; Powered by the Silent Blog
