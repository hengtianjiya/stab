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