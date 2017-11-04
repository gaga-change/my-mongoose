/**
 * Created by yanjd on 2017/11/3.
 */
(function ($) {
  var api = {}
  window.api = api

  // 目录操作
  api.grage = {
    url: '/api/grade',
    add: function (name, callback) {
      _post(this.url, {name}, callback)
    },
    delete: function () {

    },
    modify: function () {

    },
    get: function () {

    }
  }

  function _post (url, data, callback) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data
    }).then(callback)
  }

  function _del (url, data, callback) {
    $.ajax({
      type: 'DELETE',
      url: url,
      data: data
    }).then(callback)
  }

  function _put (url, data, callback) {
    $.ajax({
      type: 'PUT',
      url: url,
      data: data
    }).then(callback)
  }

  function _get (url, data, callback) {
    $.ajax({
      type: 'GET',
      url: url,
      data: data
    }).then(callback)
  }
}($))
