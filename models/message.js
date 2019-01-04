'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    content: {
        type: String
    },
    from: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    sendTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1 //  1为正常状态  -1 为已经删除的状态
    }

});
module.exports = mongoose.model('Message',MessageSchema,'message');