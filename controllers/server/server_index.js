'use strict';

let mongoose = require('mongoose');
let User = mongoose.model('User');
let Comment = mongoose.model('Comment');
let Log = mongoose.model('Log');
let Content = mongoose.model('Content');
let Message = mongoose.model('Message');
let Tag = mongoose.model('Tag');

// 管理员登录
exports.userLogin = async (req,res) => {
    if (req.method === 'GET') {
        res.render('server/login');
    } else if (req.method === 'POST') {
        let username = req.body.username;
        let password = req.body.password;
        let user = await User.findOne({username:username,role:2});
        if (user) {
            if (user.password === password) {
                res.json({
                    message:'管理员登录成功',
                    success: true
                })
            } else {
                res.json({
                    message: '密码验证失败',
                    success: false
                })
            }
        } else {
            res.json({
                message:'当前用户不存在',
                success: false
            })
        }
    }
}

// 管理员暂时不设置注册功能 会给定一个用于管理的账号

