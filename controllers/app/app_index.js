'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Message = mongoose.model('Message');
let Content = mongoose.model('Content');
let Comment = mongoose.model('Comment');
let Log = mongoose.model('Log');
let Tag = mongoose.model('Tag');
let util = require('../../libs/core')

// 普通用户登录
exports.userLogin = async (req, res) => {

    if (req.method === 'GET') {
        res.render('app/login')
    } else if (req.method === 'POST') {
        let username = req.body.username;
        let password = req.body.password;

        let user = await User.findOne({username: username,role:1});
        if (!user) {
            res.json({
                message: '该用户不存在',
                success: false
            })
        } else if (user.password === password) {
            req.session.user = user;
            res.json({
                message: '登录成功',
                success: true
            })
        } else {
            res.json({
                message: '密码验证失败',
                success: false
            })
        }
    }
}

// 普通用户注册
exports.userRegister = async (req,res) => {
    if (req.method === 'GET') {
        res.render('app/register');
    } else if (req.method === 'POST') {
        let userData = _.pick(req.body, "username","password","email");
        userData.role = 1;
        let user = await User.findOne({username: username,role:1});
        if (user) {
            res.json({
                message:"该用户名被占用",
                success: false
            })
        } else {
            let newUser = await User(userData);
            newUser.save();
            res.json({
                message: '注册成功',
                success: true
            })
        }
    }
}


// 普通用户留言
exports.userAddComment = async (req,res) => {
    if (req.method === 'GET') {

    } else if (req.method === 'POST') {
        let obj = _.pick(req.body,'content','from','reply','name','eamil');
        let newComment = await Comment(obj);
        newComment.save();
        res.json({
            message:'增加评论成功',
            success: true
        }) 
    }
}
// list列表
exports.list = async (req, res) => {
    let condition = {};
    Comment.count(condition, function (err, total) {
      let query = Comment.find({}).populate('author').populate('from');
      //分页
      let pageInfo = util.createPage(req.query.page, total);
      query.skip(pageInfo.start);
      query.limit(pageInfo.pageSize);
      query.sort({ created: -1 });
      query.exec(function (err, results) {
        res.render('app/comment', {
          comments: results,
          pageInfo: pageInfo
        });
      })
    })
  }
  


  //用户留言模块

  exports.userAddMessage = async (req,res) => {
      if (req.session.user) {
          res.render('app/info',{
              message: '登录过期，请重新登录'
          })
      }
      let obj = _.pick(req.body,'content','to');
      obj.from = req.session.user._id;
      obj.status = 1;
      let newMessage = await Message(obj);
      newMessage.save();
      res.json({
          message:'留言成功',
          success: true
      })
  }
