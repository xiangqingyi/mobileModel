'use strict';

let mongoose = require('mongoose');
let Schema =  mongoose.Schema;

let TagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.ObejectId,
        ref: 'User'
    },
    status: {
        type: Number,
        default: 0 // 默认状态  -1表示已经删除的tag
    }
});
module.exports = mongoose.model('Tag',TagSchema,'tag');