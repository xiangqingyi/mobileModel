'use strict';

let crypto = require('crypto');
let fs = require('fs-extra');
let uuidV4 = require('uuid/v4');
let mkdirp = require('mkdirp');

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
exports.uid = function (len) {
  var buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Return a unique identifier.
 *
 *     utils.uuidV4();
 *     // => "268b9ce3-ec74-4f8e-ae37-baa5e40596b8"
 * @return {String}
 * @api private
 */
exports.uuidV4 = function () {
  return uuidV4();
};


/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a format Date yyyy/MM/dd HH/mm/ss.
 *
 *     var nowDate=new Date();
 *     utils.formatDate(nowDate); => 1988/08/12 12:12:50
 *
 * @param {Date} nowDate
 * @return {String}
 * @api private
 */
exports.formatDate = function (nowDate) {
  var d = new Date(nowDate);
  var dformat = [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  ].join('/') + ' ' + [
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ].join(':');
  return dformat;
}

/**
 * 加密
 *
 *
 * @param {String} algorithm  加密模式
 * @param {String} key        私鑰
 * @param {Buffer} buf        內容
 * @return {String} encrypted 加密內容
 * @api private
 */
exports.cipher = function (algorithm, key, buf) {
  var encrypted = "";
  var cip = crypto.createCipher(algorithm, key);
  encrypted += cip.update(buf, 'binary', 'hex');
  encrypted += cip.final('hex');
  return encrypted;
}

/**
 * 解密
 *
 *
 * @param {String} algorithm  加密模式
 * @param {String} key        私鑰
 * @param {String} encrypted  加密內容
 * @return {String} decrypted 解密內容
 * @api private
 */
exports.decipher = function (algorithm, key, encrypted) {
  var decrypted = "";
  var decipher = crypto.createDecipher(algorithm, key);
  decrypted += decipher.update(encrypted, 'hex', 'binary');
  decrypted += decipher.final('binary');
  return decrypted;
}


/**
 * 加密 
 *
 *
 * @param {String} algorithm  加密模式
 * @param {String} key        私鑰
 * @param {String} iv         向量值
 * @param {String} text       加密內容
 * @param {String} encoding   格式base64 || binary
 * @return {String} decrypted 解密內容
 * @api private
 */
exports.encryptText= function(algorithm, key, iv, text, encoding) {

  var cipher = crypto.createCipheriv(algorithm, key, iv);

  encoding = encoding || "binary";

  var result = cipher.update(text, "utf8", encoding);
  result += cipher.final(encoding);

  return result;
}


/**
 * 解密 
 *
 *
 * @param {String} algorithm  加密模式
 * @param {String} key        私鑰
 * @param {String} iv         向量值
 * @param {String} text       加密內容
 * @param {String} encoding   格式base64 || binary
 * @return {String} decrypted 解密內容
 * @api private
 */
exports.decryptText= function(algorithm, key, iv, text, encoding) {

  var decipher = crypto.createDecipheriv(algorithm, key, iv);

  encoding = encoding || "binary";

  var result = decipher.update(text, encoding);
  result += decipher.final();

  return result;
}

/**
 * 建立資料夾
 *
 *
 * @param {String} path  路徑
 * @api private
 */
exports.createFolderIfNeeded= function  (path) {
  if (!fs.existsSync(path)) {  
    mkdirp.sync(path, function (err) {
        if (err) {
            console.log(err);
            return;
        }
    });
  }
}



String.prototype.format= function(){
  var args = arguments;
  return this.replace(/\{(\d+)\}/g,function(s,i){
    return args[i];
  });
};