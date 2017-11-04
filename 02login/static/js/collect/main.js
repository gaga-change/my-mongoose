/**
 * Created by yanjd on 2017/11/3.
 */

(function ($) {
  // ################################### 初始变量 ###################################

  var common = window.common
  var api = window.api
  var data = {
    grade: [], // 目录列表
    gradeCheckIndex: 0, // 当前选中的目录
    text: {
      newGrade: '', // 新增目录名
      modifyGrade: '' // 修改目录名
    }
  }
  window.data = data

  // ################################### 加载完毕 ###################################

  $(function () {
    setGrade()
  })

  // ################################### 事件监听 ###################################

  $("#addGradeBtn").click(addGrade) // 添加目录
  $("#menuList").click(changeGradeCheck) // 改变当前选中菜单
  $("#deleteGradeNameBtn").click(deleteGradeName) // 删除当前目录
  $("#modifyGradeNameBtn").click(modifyGradeName) // 修改当前目录名

  $("#addGradeInput").change(function (e) {
    data.text.newGrade = $(e.target).val()
  }) // 新增目录输入内容
  $("#newGradeInput").change(function (e) {
    data.text.modifyGrade = $(e.target).val()
  }) // 修改目录输入内容

  // ###################################   方法  ###################################

  // 配置目录
  function setGrade() {
    api.grade.get({}, function (err, res) {
      if (!err) {
        data.grade = res.grade
        changeGrade(data.grade, data.gradeCheckIndex)
      }
    })
  }

  // 添加目录
  function addGrade(e) {
    var name = data.text.newGrade
    if (name) {
      api.grade.add({name}, function (err) {
        if (!err) {
          data.text.newGrade = ''
          $("#addGradeInput").val('')
          setGrade()
        }
      })
    } else {
      common.alert('目录名不能为空！')
    }
  }

  // 删除目录
  function deleteGradeName() {
    var id = data.grade[data.gradeCheckIndex]._id
    api.grade.delete({id}, function (err) {
      data.gradeCheckIndex = 0
      setGrade()
    })
  }

  // 修改当前目录名
  function modifyGradeName() {
    var id = data.grade[data.gradeCheckIndex]._id
    var name = data.text.modifyGrade
    if (!name) {
      return common.alert('目录名不能为空！')
    }
    api.grade.modify({id, name}, function (err) {
      data.text.modifyGrade = ''
      $('#newGradeInput').val('')
      setGrade()
    })
  }

  // 改变当前选中菜单
  function changeGradeCheck(e) {
    $(e.currentTarget).find('li').removeClass('active')
    $(e.target).parent().addClass('active')
    data.gradeCheckIndex = Number($(e.target).attr('data-index'))
  }

  // ################################### 控制元素 ###################################

  // 目录列表
  function changeGrade(grade, checkIndex) {
    $('#menuList').html('')
    grade.forEach(function (item, index) {
      var gradeEle = $(`<li><a href="JavaScript:void(0)" data-index="${index}">${item.name}</a></li>`)
      if (index === Number(checkIndex)) gradeEle.addClass('active')
      $('#menuList').append(gradeEle)
    })
  }
}($))
