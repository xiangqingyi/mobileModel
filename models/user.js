'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let crypto = require('crypto')
let UserSchema = new Schema({
    username:{
        type: String
    },
    hashed_password:{
        type: String
    },
    email:{
        type: String
    },
    role: {
        type: Number,
        default: 1            //1普通user 2管理员
    }
});

UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function(){
    return this._password
});

UserSchema.methods = {
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    hashPassword: function(password) {
        if (!password) return '';
        let encrypred;
        try {
            encrypred = crypto.createHmac('sha1',this.salt).update(password).digest('hex');
            return encrypred;
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model('User',UserSchema,'user');