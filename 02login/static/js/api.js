/**
 * Created by yanjd on 2017/11/3.
 */
(function ($) {
  var api = {}
  window.api = api
  var COMMON = window.common
  // 目录操作
  api.grade = {
    url: '/api/grade',
    add: function (params, callback) {
      _post(this.url, params, callback)
    },
    delete: function (params, callback) {
      _del(this.url, params, callback)
    },
    modify: function (params, callback) {
      _put(this.url, params, callback)
    },
    get: function (params, callback) {
      _get(this.url, params, callback)
    }
  }

  function _post (url, data, callback) {
    _http('POST', url, data, callback)
  }

  function _del (url, data, callback) {
    _http('DELETE', url, data, callback)
  }

  function _put (url, data, callback) {
    _http('PUT', url, data, callback)
  }

  function _get (url, data, callback) {
    _http('GET', url, data, callback)
  }

  function _http (type, url, data,callback) {
    $.ajax({
      type,
      url: url,
      data: data
    }).then(function (res) {
      if (res.goLogin) { // 去登入
        location.href = '/login.html?returnUrl=' + encodeURIComponent(location.href)
      }
      if (res.success) {
        if (callback) callback(false, res)
      } else {
        COMMON.alert(res.message)
        if (callback) callback(true, res)
      }
    })
  }
}($))
