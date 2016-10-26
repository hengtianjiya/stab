# stab
a tiny JavaScript library.

# install
```bash
$ npm install stab --save
```

# dev
```bash
$ npm install
$ npm run build
  or
$ gulp
```

# stab
```
var xxx = 123
stab.isString(xxx)    // false
stab.isNumber(xxx)    // true
stab.isBoolean(xxx)   // false
stab.isNull(xxx)      // false
stab.isUndefined(xxx) // false
stab.isArray(xxx)     // false
stab.isObject(xxx)    // false
stab.isFunction(xxx)  // false
stab.isDate(xxx)      // false

var el = document.getElementById('p1')
'Element Attr Text CDATASection EntityReference Entity ProcessingInstruction Comment Document DocumentType DocumentFragment Notation'.split(' ').forEach(function(type, idx) {
  console.log(stab['is' + type].call(null, el))
})  // true false false false ..

var p = stab('p')     // [<p class=​"p red" id=​"p1">​p1​</p>​, <p class=​"p" id=​"p2">​p2​</p>​ ..]
p.prev();
p.next();
p.html('<span>hello ,world!</span>');
p.text('hello ,world!');
p.remove();
p.val();
p.attr('attributeName');
p.removeAttr('attributeName');
p.hasClass('className');
p.addClass('className');
p.removeClass('className');
p.css();              // "position: absolute; top: 100px..
p.offset();           // Object {left: 300, top: 116, width: 20, height: 16}
p.append('<span>hello ,world!</span>');
p.prepend('<span>hello ,world!</span>');
p.before('<span>hello ,world!</span>');
p.after('<span>hello ,world!</span>');

```

# Event
```
stab('#p1').on('click', function(){
  console.log('on click')
}).on('xxxevent', function(){
  console.log('on xxxevent')

  console.log(this)
  stab('#p1').off();
})

stab('#p2').one('click', function(){
  console.log('one click')
  stab('#p1').trigger('xxxevent')
})

```

# Ajax
```
stab.ajax('http://www.xxx.com/xxx', function(resp){
  console.log('GET resp:', resp)
})
stab.ajax('http://www.xxx.com/xxx', 'a=1&b=2', function(resp){
  console.log('POST resp:', resp)
})
stab.ajax('http://www.xxx.com/xxx', {c:3, d:4}, function(resp){
  console.log('POST resp:', resp)
})

```

# Anim
```
stab('#p1').anim('top:300px;left:500px;', function(){
  this.anim('top:100px;left:100px;', function(){
    this.anim('left:300px;background-color:#f00;', function(){
      console.log(this.css())
    })
  }, 1000)
}, 3)

```

# Router
```
stab.router.on('index', function(){
  console.log('index page!')
}).on('list', function(){
  console.log('list page!')
}).init() // init: use location.hash; xinit: use location.search;

```

# Tmpl
```
// templete
<script type="text/html" id="tpl">
  {% for(var i in this){ %}
    <li id="{%=i%}">{%=this[i]%}</li>
  {% } %}
</script>

var tplStr = stab('#tpl').html()
var tplObj = {aaa: 'aaaaaaa', bbb: 'bbbbbbb', ccc: 'ccccccc', ddd: 'ddddddd'}
var tplHtml = stab.tmpl(tplStr, tplObj)
console.log(tplHtml)  // <li id="aaa">aaaaaaa</li><li id="bbb">bbbbbbb</li> ..

var cp1 = stab('#box').cp(tplStr, tplObj, '#box{color:#f00}', function(){
  console.log(this)
  console.log(this.data)
  console.log(this.html)
  console.log(this.caller)
  console.log(this.src)

  var _this = this
  stab('#aaa').on('click', function(){
    _this.data.aaa = 'click..'
    _this.update();
  })
})

```

# Tap
```
stab('#p1').tap(function(){
  console.log('on tap..')
})

```








