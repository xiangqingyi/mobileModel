'use strict';

let mongoose = require('mongoose');
let User = mongoose.model('User');


exports.userLogin = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

   let user = await User.findOne({username: username});
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
           success: false,
           message: '密码错误!'
       })
   }
}

