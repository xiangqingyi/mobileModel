'use strict';

let path = require('path');
let underscore = require('underscore');
let utils = require('./../libs/utils');
let appPath = process.cwd();


let config = {
    port: process.env.Port || 6000,
    env: process.env.NODE_ENV || 'local', // development   production
    //路徑配置
    path: {
        logDir: appPath + '/logs'
    },
    //mongodb配置信息
    mongodb: {
        uri: 'mongodb://IpAddress:27017/mobile',
        options: {}
    },
    //redis服务，用来session维持，非必须
    redis: {
        host: '', // 如 127.0.0.1 配置此项表示启用redis，需保证redis服务已启动
        port: 6379, // 6379
        pass: ''
    },
    //web
    web: {
        host: 'http://127.0.0.1:6000/mobile'
    },
    //找回密码hash过期时间
    findPasswordTill: 24 * 60 * 60 * 1000,
    // session secret
    sessionSecret: 'SessionSecret',
    // jsonwebtoken config
    jwt: {
        secret: 'JWTSecret',
        options: {
            expiresIn: '10h'
        }
    },
    title: 'mobile',
    api: {
        dir: 'mobile/api/v1' //api访问路径，如http://localhost/mobile/api/v1
    },
    homepage: {
        dir: 'mobile',       //前台访问路径，如http://localhost/mobile
    },
    upload: {
        tmpDir: appPath + '/public/uploaded/tmp',
        uploadDir: appPath + '/public/uploaded/files',
        uploadUrl: '/uploaded/files/',
        maxPostSize: 1000 * 1024 * 1024, // 1000M
        minFileSize: 1,
        maxFileSize: 500 * 1024 * 1024, // 500M
        acceptFileTypes: /.+/i,
        storage: {
            type: 'local',//保存类型，如果保存到本地可省略或local, 目前支持7牛：qiniu
            options: {
                accessKey: 'your key',
                secretKey: 'your secret',
                bucket: 'your bucket',
                domain: 'http://yourdomain.qiniudn.com', // 域名，包含http，如http://yourdomain.qiniudn.com
                timeout: 3600000, // default rpc timeout: one hour, optional
            }
        }
    },
    stopForumSpam: false,
    // 是否启动用户注册校验TODO:
    userVerify: {
        enable: false,
        type: 'admin' // mail | admin, 默认admin
    },
    // 邮箱配置，找回密码、用户注册使用
    mail: {
        // 发信人邮箱
        from: 'username@domain.com',
        // nodemailer config see https://nodemailer.com/about/
        nodemailer: {
            // https://nodemailer.com/smtp/
            service: 'gmail',
            host: '',
            port: '',
            auth: {
                user: '',
                pass: ''
            }
        }

    },
    // google analytics
    ga: '',

};

utils.createFolderIfNeeded(config.upload.tmpDir);
utils.createFolderIfNeeded(config.upload.uploadDir);

module.exports = config;