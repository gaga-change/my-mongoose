/**
 * Created by yanjd on 2017/10/11.
 */
(function () {
  var con = $(`<div style="position: fixed; left: 0; bottom: 0"></div>`)
  $('body').append(con)
  /**
   * 内部提示，两秒后消失
   * @param msg
   */
  window.myAlert = function (msg) {
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
    }, 3000)
  }
})()
