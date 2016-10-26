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