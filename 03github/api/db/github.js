/**
 * Created by yanjd on 2017/11/22.
 */

// const {GitHubCommit} = require('../models/user_schema')
const {GitHubCommit, GitHubTree, GitHubFile} = require('../models/github_schema')
const request = require('request')
const config = require('../../../hide.config.json')
const Headers = {
  'User-Agent': 'gaga-change',
  'Authorization': 'token ' + config.github_token
}

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

// 存储目录
exports.pushTree = function (req, res) {
  let TreeChange = [] // 新目录列表
  let FileChange = [] // 新文件的列表
  let Files = [] // 文件
  GitHubCommit.findOne().sort({date: -1}).exec(function (err, commit) {
    if (err) return res.send({err, msg: 'DB异常'})
    if (commit) {
      if (!commit['commit'] || !commit['commit']['tree']) {
        res.send({err, msg: '没有commit.tree'})
      } else {
        _getTree([commit['commit']['tree']])
      }
    } else {
      res.send({err: true, msg: '无提交日志'})
    }

    function _getTree (trees) {
      if (trees.length === 0) { // 目录为零，遍历结束
        _saveFile(Files)
      } else {
        /**
         * 判断该目录是否存在
         *  存在，直接继续调用
         *  不存在, 获取该目录下 子文件和子目录
         *    1. 存储
         *    2. 拉取子目录存放到数组中
         */
        let tree = trees.pop()
        GitHubTree.findOne({sha: tree.sha}, function (err, item) {
          if (err) res.send({err, msg: 'DB异常'})
          else if (item) _getTree(trees)
          else {
            console.log('sending:' + tree.url)
            request.get({
              url: tree.url,
              headers: Headers
            }, function (err, response, body) {
              console.log('send success')
              const parse = _parse(body)
              if (err) res.send({err, msg: '接口异常'})
              else if (parse.err) {
                res.send({err: parse.err, msg: parse.msg})
              } else {
                tree = new GitHubTree(parse.obj)
                tree.save(function (err) {
                  if (err) res.send({err, msg: 'DB异常'})
                  else {
                    TreeChange.push(tree)
                    parse.obj.tree.filter(v => v.type === 'tree').forEach(v => trees.push(v))
                    parse.obj.tree.filter(v => v.type === 'blob').forEach(v => Files.push(v))
                    _getTree(trees)
                  }
                })
              }
            })
          }
        })
      }
    }

    function _saveFile (files) {
      if (files.length === 0) {
        res.send({
          changeFile: FileChange.length,
          changeTree: TreeChange.length,
          FileChange,
          TreeChange
        })
      } else {
        let file = new GitHubFile(files.pop())
        GitHubFile.findOne({sha: file.sha}, function (err, item) {
          if (err) res.send({err, msg: 'DB异常'})
          else if (item) _saveFile(files)
          else {
            file.save(err => {
              if (err) res.send({err, msg: 'DB异常'})
              else {
                FileChange.push(file)
                _saveFile(files)
              }
            })
          }
        })
      }
    }
  })
}

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
