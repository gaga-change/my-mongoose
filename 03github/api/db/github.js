/**
 * Created by yanjd on 2017/11/22.
 */

// const {GitHubCommit} = require('../models/user_schema')
const {GitHubCommit, GitHubTree, GitHubFile, Variable} = require('../models/github_schema')
const request = require('request')
const myRequest = require('../tool/request')
const config = require('../../../hide.config.json')
const co = require('co')
const async = co.wrap

const Headers = {
  'User-Agent': 'gaga-change',
  'Authorization': 'token ' + config.github_token
}

// 判断全局变量是否创建
co(function * () {
  try {
    const glb = yield Variable.findOne({})
    if (!glb) {
      yield new Variable({}).save()
      console.log('初始化变量 创建')
    } else {
      console.log('DB全局变量 已创建')
    }
  } catch (err) {
    console.error('DB异常', err)
  }
})

// 存储Commit
exports.pushCommit = function (req, res) {
  request.get({
    url: 'https://api.github.com/repos/gaga-change/test/commits?page=1&per_page=1',
    headers: Headers
  }, function (err, response, body) {
    if (err) return res.send({err, msg: '接口异常'})
    const parse = _parse(body)
    if (parse.err) {
      res.send({err: parse.err, msg: parse.msg})
    } else {
      const commit = new GitHubCommit(parse.obj[0])
      if (!commit['commit'] || !commit['commit']['committer'] || !commit['commit']['committer']['date']) {
        return res.send({err, msg: '没有commit.committer.date'})
      }
      commit.date = new Date(commit['commit']['committer']['date'])
      GitHubCommit.findOne({sha: commit.sha}, function (err, item) {
        if (err) return res.send({err, msg: 'DB异常'})
        if (item) {
          res.send({new: false})
        } else {
          commit.save(function (err) {
            if (err) return res.send({err, msg: 'DB异常'})
            res.send({new: true, headers: response.headers})
          })
        }
      })
    }
  })
}

// 一次存储一个目录层级
/**
 * trees
 *  - 空 根据Commit 获取第一层级，进入不为空
 *  - 不为空
 *    - Pop trees -> API 获取当前目录内容 -> 存储目录、子目录、子文件
 *  -> 返回 当前目录,未排查目录
 */
exports.pushTree = async(function * (req, res, next) {
  try {
    const variable = yield Variable.findOne({})
    const trees = variable.trees
    if (trees.length === 0) {
      const commit = yield GitHubCommit.findOne().sort({date: -1})
      if (!commit) return res.send({err: true, msg: '无提交日志'}) // 如果没有日志，直接结束 end
      trees.push(commit.commit.tree)
    }
    const tree = trees.pop() // 只包含自身信息，不带子目录和子文件信息
    const already = yield GitHubTree.findOne({sha: tree.sha}) // 查看是否已存在该目录
    if (already) {
      yield variable.save()
      return res.send({variable, tree: already, already: true}) // 如果已拉取过，直接结束  end
    }
    const treeApiData = yield myRequest({ // GitHub API 请求
      url: tree.url,
      headers: Headers
    })
    if (treeApiData.err) { // 请求报错
      res.send({err: treeApiData.err, time: treeApiData.date})
    } else if (_parse(treeApiData.data).err) { // 解析报错
      res.send({err: _parse(treeApiData.data).err, msg: _parse(treeApiData.data).msg})
    } else { // 数据正常
      let treeSonList = _parse(treeApiData.data).obj // 目录下的子文件和子目录
      treeSonList.path = tree.path || '主目录'
      yield new GitHubTree(treeSonList).save()
      treeSonList.tree.filter(v => v.type === 'tree').forEach(v => trees.push(v))
      yield variable.save()
      res.send({ variable, tree: treeSonList, already: false, github_api_time: treeApiData.date })
    }
  } catch (err) {
    next(err)
  }
})

// 拉取所有文件的内容
exports.pushFile = function (req, res) {

}

function _parse (str) {
  try {
    const item = JSON.parse(str)
    if (typeof item === 'object') {
      return {obj: item}
    } else {
      return {err: true, msg: 'JSON解析后不是 object'}
    }
  } catch (err) {
    return {err, msg: 'JSON解析失败'}
  }
}
