'use strict';

var debug = require('debug');
var error = debug('contactModel:error');
var log = debug('contactModel:log');

var mongoose = require('mongoose');
require('mongoose-type-url'); // for url types

var Schema = mongoose.Schema;

var TopList = new Schema(
{
    post_ref:{
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    title: {
        type: String
    },
    votes: {
        type: Number,
        default:0
    },
    score : {
        type:Number,
        default:5
    },
    body: {
        type: String
    }
},
{ 
    timestamps: true
});



TopList.set('toJSON', {
    transform: function(doc, ret, options) {
        return ret;
    }
});

module.exports = mongoose.model('TopList', TopList);