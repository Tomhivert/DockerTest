
'use strict';

var debug = require('debug');

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
    // if (req.body.userId && req.body.userId == "joker") {
    //     return res.json({ userId: "joker" }); //Joker for flow highway
    // }

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

module.exports = {
    addPost
}