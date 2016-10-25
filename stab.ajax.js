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
