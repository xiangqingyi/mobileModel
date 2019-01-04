'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: Schema.ObjectId,
        ref: 'Content'
    },
    reply: { //回复的哪个评论
        type: Schema.ObjectId,
        ref: 'Comment'
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    comments:[{  //该条评论之下的评论
        type: Schema.ObjectId,
        ref: 'Comment'
    }],
    status: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Comment',CommentSchema,'comment');