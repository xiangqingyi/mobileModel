'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LogSchema = new Schema({
    type: {
        type: String
    },
    action: {
        type: String
    },
    status: {
        type: String
    },
    message: {
        type: String
    },
    created: {
        type: Date,
        default: Date.noew
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
module.exports = mongoose.model('Log',LogSchema,'log');