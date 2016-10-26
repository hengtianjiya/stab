;var stab = (function(window, undefined) {
  var document = window.document;

  var _ = function(selector) {
    var nodes = selector
    try {
      nodes = Array.prototype.slice.call(document.querySelectorAll(selector), 0)
      nodes.selector = selector
    } catch (e) {}
    nodes.__proto__ = _.fn
    return nodes
  }

  'String Number Boolean Null Undefined Array Object Function Date'.split(' ').forEach(function(type) {
    _['is' + type] = function(o) {
      return Object.prototype.toString.call(o) === '[object ' + type + ']'
    }
  })

  'Element Attr Text CDATASection EntityReference Entity ProcessingInstruction Comment Document DocumentType DocumentFragment Notation'.split(' ').forEach(function(type, idx) {
    _['is' + type] = function(o) {
      return o && o.nodeType && o.nodeType === idx + 1
    }
  })

  _.fn = {
    prev: function() {
      return _(this.map(function(el){
        return el.previousElementSibling || el.previousSibling
      }).filter(function(el){
        return _.isElement(el);
      }))
    },
    next: function() {
      return _(this.map(function(el){
        return el.nextElementSibling || el.nextSibling
      }).filter(function(el){
        return _.isElement(el);
      }))
    },
    html: function(html) {
      if (_.isUndefined(html)) return this.length > 0 && this[0].innerHTML;
      this.forEach(function(el){
        el.innerHTML = html
      })
      return this
    },
    text: function(txt) {
      if (_.isUndefined(txt)) return this.length > 0 && this[0].textContent;
      this.forEach(function(el){
        el.textContent = txt
      })
      return this
    },
    remove: function() {
      this.forEach(function(el){
        el.parentNode.removeChild(el)
      })
      return this
    },
    val: function(val) {
      if (_.isUndefined(val)) return this.length > 0 && (this[0].tagName == 'SELECT' ? this[0].options[this[0].selectedIndex].value : this[0].value);
      this.forEach(function(el){
        if(el.tagName == 'SELECT') el = el.options[el.selectedIndex]
        el.value = val
      })
      return this
    },
    attr : function(k, v) {
      if (_.isUndefined(v)) return this.length > 0 && this[0].getAttribute(k);
      this.forEach(function(el){
        el.setAttribute(k, v)
      })
      return this
    },
    removeAttr: function(k) {
      this.forEach(function(el){
        el.removeAttribute(k)
      })
      return this
    },
    hasClass: function(className) {
      return this.length > 0 && this[0].className.indexOf(className) > -1;
    },
    addClass: function(className) {
      this.forEach(function(el){
        el.className += ' ' + className
      })
      return this
    },
    removeClass: function(className) {
      this.forEach(function(el){
        el.className = el.className.replace(className, '')
      })
      return this
    },
    css: function(css) {
      if (_.isUndefined(css)) return this.length > 0 && this[0].style.cssText
      if (!~css.indexOf(':')) return this.length > 0 && window.getComputedStyle(this[0], null).getPropertyValue(css)
      this.forEach(function(el){
        el.style.cssText += css
      })
      return this
    },
    offset: function() {
      if(this.length == 0) return false;
      var initLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
      var initTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      var rect = this[0].getBoundingClientRect();
      return {
        left: rect.left + initLeft,
        top: rect.top + initTop,
        width: this[0].offsetWidth,
        height: this[0].offsetHeight
      };
    }
  }
  _.fn.__proto__ = Array.prototype

  var insertAdjacentObj = {append: 'beforeend', prepend: 'afterbegin', before: 'beforebegin', after: 'afterend'}
  for(k in insertAdjacentObj){
    _.fn[k] = function(html) {
      this.forEach(function(el){
        el.insertAdjacentHTML(insertAdjacentObj[k], html)
      })
      return this
    }
  }

  return _;
})(window);

// Event <= []
;(function(document, undefined) {
  var handlers = {},
    _evtId = 1;

  stab.fn.off = function(type, capture) {
    this.forEach(function(el) {
      if (el._evtId && handlers[el._evtId]) {
        if (type) {
          el.removeEventListener(type, handlers[el._evtId][type], capture);
          delete handlers[el._evtId][type];
        } else {
          for (var type in handlers[el._evtId]) {
            el.removeEventListener(type, handlers[el._evtId][type], capture);
          }
          delete handlers[el._evtId];
        }
      }
    })

    return this;
  }

  stab.fn.on = function(type, listener, capture, once) {
    var _this = this;
    this.forEach(function(el) {
      var id = el._evtId || (el._evtId = _evtId++)
      if (!handlers[id]) handlers[id] = {};
      handlers[id][type] = function(e) {
        listener.call(this, e);
        once && _this.off(type, capture);
      };
      el.addEventListener(type, handlers[id][type], capture);
    })

    return this;
  }

  stab.fn.one = function(type, listener, capture) {
    return this.on(type, listener, capture, true);
  }

  stab.fn.trigger = function(type, eventType) {
    var evt = document.createEvent(eventType || 'Events');
    evt.initEvent(type, true, true);
    this.forEach(function(el) {
      el.dispatchEvent(evt);
    })

    return this;
  }

})(document);
// Ajax <= []
;stab.buildUrl = function(params){
  var _p = [];
  for(var key in params){
    _p.push(key + '=' + params[key])
  }

  return _p.join('&')
}
;stab.ajax = function(url, params, onSuccess, onError) {
	var type = 'POST';

  if(this.isFunction(params)){
    onError = onSuccess
    onSuccess = params
    params = null
    type = 'GET'
  }

  if(this.isObject(params)) params = this.buildUrl(params)

	var xhr = new XMLHttpRequest()
	xhr.open(type, url, true)
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')

	var abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = null
      xhr.abort()
      onError && onError.call(null, 'error: timeout.', xhr)
  }, 12000)	// 12s

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {
			xhr.onreadystatechange = null
			clearTimeout(abortTimeout)
			onSuccess && onSuccess.call(null, xhr.responseText, xhr)
		}
	}

	xhr.send(params);
}

// Anim <= []
;stab.cssPrefix = (function(_){
  var body = _('body'), vendor = ['-webkit-', '-moz-', '-o-'];

  for(var i = 0, len = vendor.length; i < len; i++){
    if(!!body.css(vendor[i] + 'transition')) return vendor[i]
  }

  return '';
})(stab)

;stab.fn.anim = function(css, callback, duration, ease) {
  duration = !duration ? 600 : (duration < 18 ? duration * 1000 : duration)
  ease = ease || 'linear'

  var _this = this,
    prefix = stab.cssPrefix,
    _css = prefix + 'transition:all ' + duration/1000 + 's ' + ease;

  this.css(css + _css)
  setTimeout(function(){
    _this.css(prefix + 'transition:all 0s ease 0s;')
    callback && callback.call(_this)
  }, duration)
}

// Router <= []
;stab.router = (function(){
  var _routers = {};

  var on = function(k, v){
    if(!v) return _routers.k;
    _routers[k] = v;
    return this;
  }

  var _action = function(key){
    var _key = location[key].substr(1).split('?')[0] || 'index';
    _routers[_key] && _routers[_key].call(null);
  }

  return {
    on: on,
    init: function(){
      window.addEventListener('hashchange', function(e){
        _action('hash')
      })
      _action('hash')
    },
    xinit: function(){
      _action('search')
    }
  }
})()
// Tmpl <= []
;stab.tmpl = function(str, data){
    return Function("var html=[];html.push('"+str.trim().replace(/[\r\t\n]/g,"").replace(/{%=(.+?)%}/g,"',$1,'").replace(/{%/g,"');").replace(/%}/g,"html.push('")+"');return html.join('');").call(data)
}

stab.fn.cp = (function(_){
    if(!_('style').length) _('head').append('<style></style>')
    var style = _('style');

    return function(str, data, css, callback){
        var cp = {caller:this, src:str, update:function(){
            this.caller.html(this.html = _.tmpl(this.src, this.data))
            return this
        }};
        _.isFunction(css) ? callback = css : style.append(css)
        cp.data = data
        cp.update()
        callback && callback.call(cp)
        return cp
    }
})(stab);
// Tap <= []
;stab.fn.tap = function(callback){
  var t;
  this.on('touchstart', function(e){
    t = setTimeout(function(){
      callback && callback.call(null, e);
    }, 180);
  }).on('touchmove', function(e){
    clearTimeout(t);
  })
}