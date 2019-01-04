'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let ContentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String     //摘要
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    tags: [{
        type: Schema.ObjectId,
        ref: 'Tag'
    }],
    created: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model('Content',ContentSchema,'content');