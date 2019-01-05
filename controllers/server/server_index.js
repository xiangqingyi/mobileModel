'use strict';

let mongoose = require('mongoose');
let User = mongoose.model('User');
let Comment = mongoose.model('Comment');
let Log = mongoose.model('Log');
let Content = mongoose.model('Content');
let Message = mongoose.model('Message');
let Tag = mongoose.model('Tag');
let util = require('../../libs/core')

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

// 管理员接收留言的列表
exports.messagelist = async (req,res) => {
    let message = await Message.find({status:{$ne: -1}}); //找出没有删除的留言
    let total = await Message.count({status: {$ne: -1}});
    let pageInfo = util.createPage(req.query.page, total);
    res.render('server/message/list',{
        Menu: 'list',
        messages: message,
        pageInfo: pageInfo
    })
}
//单条消息
exports.messageone = async (req,res) => {
    let id = req.params.id;
    let _message = await Message.findById(id).populate('from')
    if (_message) {
        res.render('server/message/item', {
            title: _message.from.username + '的留言',
            message: _message
        })
    } else {
        res.render('server/info',{
            message: '这条留言不存在'
        })
    }
}

// 删除留言
exports.messagedel = async (req, res) =>{
    let id = req.params.id;
    let _message = await Message.findById(id);
    if (_message) {
        await Message.remove({_id: id})
        res.render('server/info', {
            message: '删除留言成功'
        })
    } else {
        res.render('server/info', {
            message: '这条留言不存在'
        })
    }
}

// 管理员评论版块
// 管理员评论列表
exports.commentlist = async (req,res) => {
    let comments = await Comment.find({status: {$ne: -1}});
    let total = await Comment.count({status: {$ne: -1}});
    let pageInfo = util.createPage(req.query.page, total);
    res.render('server/comment/list',{
        comments: comments,
        Menu: 'list',
        pageInfo: pageInfo
    })
}

exports.commentone = async (req,res) => {
    let id = req.params.id;
    let _comment = await Comment.findById(id).populate('from');
    if (_comment) {
        res.render('server/comment/item',{
            title: _comment.from.username + '的评论',
            comment: _comment
        })
    } else {
        res.render('server/info', {
            message: '这条评论不存在'
        })
    }
}
// 删除留言
exports.commentdel = async (req,res) => {
    let id = req.params.id;
    let _comment = await Comment.findById(id);
    if (_comment) {
        await Comment.remove({_id: id})
    } else {
        res.render('server/info',{
            message: '这条留言不存在'
        })
    }
}
// Tag模块
exports.taglist = async (req, res) => {
    let total = await Tag.count({status: {$ne: -1}});
    let tags =await Tag.find({status: {$ne: -1}});
    let pageInfo = util.createPage(req.query.page,total);
    if (tags) {
        res.render('server/tag/list',{
            Menu:'list',
            tags: tags,
            pageInfo: pageInfo
        })
    } 
}

exports.tagone = async (req, res) => {
    let id = req.params.id;
    let tag = await Tag.findById(id);
    if (tag) {
        res.render({
            tag: tag
        })
    } else {
        res.render('server/info', {
            message: '该标签不存在'
        })
    }
}

exports.tagdel = async (req, res) => {
    let id = req.params.id;
    await Tag.remove({_id: id});
    res.render('server/info',{
        message: '删除标签成功'
    })
}
exports.tagadd  =async (req,res) => {
    let name = req.body.name;
    let description = req.body.description;
    let tagData = {
        name: name,
        description: description,
        author: req.session.user,
        status: 0
    }
    let _tagData = await new Tag(tagData);
    _tagData.save();
    res.render('server/info',{
        message: '新建标签成功'
    })
}