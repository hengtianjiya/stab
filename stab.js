var stab = (function(window, undefined) {
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
