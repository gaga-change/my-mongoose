/**
 * Created by yanjd on 2017/11/3.
 */

(function ($) {
  // ################################### 初始变量 ###################################

  var common = window.common
  var api = window.api
  var data = window.data

  // ################################### 加载完毕 ###################################

  $(function () {
    // 获取目录
    setGrade(function () {
      // 获取链接
      getAddressList()
    })
  })

  // ################################### 事件监听 ###################################

  $("#addGradeBtn").click(addGrade) // 添加目录
  $("#menuList").click(changeGradeCheck) // 改变当前选中菜单
  $("#deleteGradeNameBtn").click(deleteGradeName) // 删除当前目录
  $("#modifyGradeNameBtn").click(modifyGradeName) // 修改当前目录名
  $("#addAddressBtn").click(addAddress) // 添加链接

  $("#addGradeInput").change(function (e) {
    data.text.newGrade = $(e.target).val()
  }) // 新增目录输入内容
  $("#newGradeInput").change(function (e) {
    data.text.modifyGrade = $(e.target).val()
  }) // 修改目录输入内容
  $("#titleInput").change(function (e) {
    data.text.address.title = $(e.target).val()
  }) // 链接标题
  $("#detailInput").change(function (e) {
    data.text.address.detail = $(e.target).val()
  }) // 链接描述
  $("#urlInput").change(function (e) {
    data.text.address.url = $(e.target).val()
  }) // 链接地址

  // ###################################   方法  ###################################

  // 添加目录
  function addGrade(e) {
    var name = data.text.newGrade
    if (!name) {
      common.alert('目录名不能为空！')
    } else if (name.length > 10) {
      common.alert('目录名超长，不能超过10个字！')
    } else {
      api.grade.add({name}, function (err) {
        if (!err) {
          data.text.newGrade = ''
          $("#addGradeInput").val('')
          setGrade()
        }
      })
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
      common.alert('目录名不能为空！')
    } else if (name.length > 10) {
      common.alert('目录名超长，不能超过10个字！')
    } else {
      api.grade.modify({id, name}, function (err) {
        data.text.modifyGrade = ''
        $('#newGradeInput').val('')
        setGrade()
      })
    }
  }

  // 配置目录
  function setGrade(callback) {
    api.grade.get({}, function (err, res) {
      if (!err) {
        data.grade = res.grade
        changeGrade(data.grade, data.gradeCheckIndex)
        if (callback) callback()
      }
    })
  }

  // 改变当前选中菜单
  function changeGradeCheck(e) {
    if (data.gradeCheckIndex !== Number($(e.target).attr('data-index'))) {
      $(e.currentTarget).find('li').removeClass('active')
      $(e.target).parent().addClass('active')
      data.gradeCheckIndex = Number($(e.target).attr('data-index'))
      getAddressList()
    }
  }

  // 添加链接
  function addAddress(e) {
    if (!data.gradeNow()) return
    api.siteAddres.add(data.gradeNow()._id, {
      title: data.text.address.title,
      detail: data.text.address.detail,
      url: data.text.address.url
    }, function (err, res) {
      if (err) {
        common.alert(res.message)
      } else {
        common.alert("添加成功")
        $("#titleInput").val('')
        $("#detailInput").val('')
        $("#urlInput").val('')
        data.text.address.title = ''
        data.text.address.detail = ''
        data.text.address.url = ''
        data.sites.push(res.site)
        changeAddressList(data.sites)
      }
    })
  }

  // 获取链接列表
  function getAddressList() {
    api.siteAddres.get({
      gradeId: data.gradeNow()._id,
      pageSize: 10,
      index: 0
    }, function (err, res) {
      if (err) {
        common.alert(res.message)
      } else {
        data.sites = res.sites
        changeAddressList(res.sites)
      }
    })
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

  // 链接列表
  function changeAddressList(sites) {
    var listGroup = $("#listGroup")
    listGroup.show()
    listGroup.html('')
    sites.forEach(function (val, index) {
      var item = $('<div class="list-group-item" data-site="' + val._id + '" data-address="' + val.address._id +'">\n' +
        '<a href="#">' +
        '<h4 class="list-group-item-heading">' + val.address.title + '</h4>\n' +
        '<p class="list-group-item-text">' + val.address.detail + '</p>\n' +
        '</a>' +
        '<span class="other"><button type="button" class="btn btn-warning btn-sm">删除</button>' +
        '<button type="button" class="btn btn-info btn-sm">共享</button>' +
        '<a href="#">进入详情</a></span>' +
        '</div>')
      listGroup.append(item)
    })
  }
}($))
