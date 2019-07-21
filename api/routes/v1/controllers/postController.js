
'use strict';

var debug = require('debug');
var error = debug('postController:error');
var log = debug('postController:log');

var postHandler = require('../handlers/postHandler');

function get(req, res, cb) {
    var handleResponse = function (err, statement) {
        if (err) {
            res.json({ err });
        } else {
            res.json({ statement });
        }
    }
    postHandler.get(handleResponse)
}

function addPost(req, res, next) {
    var handleResponse = function (err, statement) {
        if (err) {
            res.json({ err });
        } else {
            res.json({ statement });
        }
    }
    postHandler.addPost(
        req.body.title, req.body.text, handleResponse);

}

function upVotePost(req, res, next) {
    var handleResponse = function (err, statement) {
        if (err) {
            res.json({ err });
        } else {
            res.json({ statement });
        }
    }
    postHandler.upVotePost(req.body.post_id, handleResponse);
}

function downVotePost(req, res, next) { 
    var handleResponse = function (err, statement) {
        if (err) {
            res.json({ err });
        } else {
            res.json({ statement });
        }
    }
    postHandler.downVotePost(req.body.post_id, handleResponse);
}

function editPost(req, res, next) { 
    var handleResponse = function (err, statement) {
        if (err) {
            res.json({ err });
        } else {
            res.json({ statement });
        }
    }
    postHandler.editPost(req.body.post_id, req.body.text, handleResponse);
}

module.exports = {
    addPost,
    get,
    upVotePost,
    downVotePost,
    editPost
}