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