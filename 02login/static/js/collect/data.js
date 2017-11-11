(function ($) {
  var data = window.data = (function () {
    return {
      grade: [], // 目录列表
      gradeCheckIndex: 0, // 当前选中的目录
      gradeNow: function () {
        return this.grade[this.gradeCheckIndex]
      }, // 当前选中的目录
      sites: [], // 链接列表
      text: {
        newGrade: '', // 新增目录名
        modifyGrade: '', // 修改目录名
        address: {
          title: '', // 标题
          detail: '', // 描述
          url: '', // 链接地址
        }
      }
    }
  }())

}($))