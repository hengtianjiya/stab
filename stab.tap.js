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