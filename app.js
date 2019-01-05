'use strict';

let express = require('express');
let mongoose = require('mongoose');
let gravatar = require('gravatar');
let path = require('path');
let compression = require('compression')
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let RedisStore = require('connect-redis')(session); //存储session,防止服务重启后session丢失
let bodyParser = require('body-parser');
let csrf = require('csurf');//后台验证的时候使用
let moment = require('moment');//日期解析使用
let _ = require('lodash');//字串处理
let multipart = require('connect-multiparty'); //解析文件
let core = require('./libs/core');
let xss = require('xss');
let marked = require('marked');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    //sanitize: true,// 不解析html标签
    smartLists: true,
    smartypants: false
});

let strip = require('strip');

let appPath = process.cwd();
let config = require('./config/');
//设置moment语言
moment.locale('zh-cn');

let app = express();
app.use(compression());

//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.uri,{
    useMongoClient: true,
    /* other options */
  });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    core.logger.info('mongodb连接成功');
});

//载入数据模型
core.walk(appPath + '/models', null, function(path) {
    require(path);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (config.env === 'production') {
    app.enable('view cache');
}

//定义全局变量
app.locals = {
    title: config.title,
    pretty: true,
    moment: moment,
    _: _,
    core: core,
    config: config,
    homepage: config.homepage.dir,
    gravatar: gravatar,
    md: marked,
    strip: strip,
    env: config.env,
    xss: xss
};
app.set('config', config);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret || 'template',
    store: (config.redis.host ? new RedisStore(config.redis) : null)
}));
//POST 档案上传自动解析暂存
app.use(multipart({
    uploadDir: config.upload.tmpDir
}));

core.walk(appPath + '/routes/api', 'middlewares', function(path) {
    require(path)(app);
});
app.use(csrf({ cookie: true }));
app.use(core.translateHomePageDir('/public'),express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header('X-Powered-By', 'mobile');
    if (req.csrfToken) {
        res.cookie('TOKEN', req.csrfToken())
    }
    res.locals.token = req.csrfToken && req.csrfToken();

    res.locals.query = req.query;
    if (req.session && req.session.user) {
        res.locals.User = req.session.user;
    } else {
        res.locals.User = null;       
    }
    next();
});

core.walk(appPath + '/routes/app', 'middlewares', function(path) {
    require(path)(app);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('页面不存在');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (config.env === 'development' || config.env === 'local') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json(err.message);
    });
} else {
    app.use(function(err, req, res, next) {
        core.logger.error('error：%j',err.message);        
    });    
}

app.set('port', process.env.PORT || config.port || 6000);
let server = app.listen(app.get('port'), function() {
    core.logger.info('网站服务启动，端口： ' + server.address().port);
    core.logger.info('环境变数： ' + config.env);
    core.logger.info('mongodb url： ' + config.mongodb.uri);
    core.logger.info('redis url： ' + config.redis.host + ':' + config.redis.port);        
});


module.exports = app;