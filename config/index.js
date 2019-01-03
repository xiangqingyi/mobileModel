'use strict';

var local_env = require('./config.local');
var development_env = require('./config.development');
var production_env = require('./config.production');

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = {
    development: development_env,
    local: local_env,
    production:production_env
}[process.env.NODE_ENV || 'local'];