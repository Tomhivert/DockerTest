'use strict';

var debug = require('debug');
var error = debug('postHandler:error');
var log = debug('postHandler:log');

var mongoose = require('mongoose'),
    Post = require('../../../../db/models/general/postModel'),

function get(cb) {
    console.log("postHandler.get");
    Post.find({}, function (err, doc) {
        if (err) {
            console.log("error with getting top posts ");
            return cb(err);
        } else {
            return cb(null, doc);
        }
    }).sort({score:-1}).limit(10);
}

function addPost(title, body, cb) {
    var post = new Post();
    post.title = title;
    post.body = body;

    post.save(function (err, savedPost) {
        if (err) {
            cb(err);
        } else {
            cb(null, savedPost);
        }
    });
}

module.exports = {
    get,
    addPost
}