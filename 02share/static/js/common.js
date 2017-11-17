/**
 * Created by yanjd on 2017/10/11.
 */
(function ($) {
  var common = {}
  window.common = common
  var AlertCon = null // 内置Alert父元素

  /**
   * 内部提示，两秒后消失
   * @param msg // 提示信息
   * @param time // 持续时间，default 2000
   */
  common.alert = function (msg, time) {
    if (!time) time = 2000
    var con = _createCon()
    var template = $(`
      <div class="column">
      <div class="alert alert-dismissable alert-warning">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
      ${msg}
      </div>
      </div>`)
    con.append(template)
    setTimeout(function () {
      template.remove()
    }, time)

    function _createCon () {
      if (!AlertCon) {
        AlertCon = $(`<div style="position: fixed; left: 0; bottom: 0"></div>`)
        $('body').append(AlertCon)
      }
      return AlertCon
    }
  }
})($)
