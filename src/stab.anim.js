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
