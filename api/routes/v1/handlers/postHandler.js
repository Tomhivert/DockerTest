'use strict';

var debug = require('debug');
var error = debug('postHandler:error');
var log = debug('postHandler:log');

var mongoose = require('mongoose'),
    Post = require('../../../../db/models/general/postModel'),
    TopList = require('../../../../db/models/general/topListModel');


function get(cb) {
    console.log("postHandler.get");
    TopList.find({}, function (err, doc) {
        if (err) {
            console.log("error with getting top posts ");
            return cb(err);
        } else {
            return cb(null, doc);
        }
    }).sort({ score: -1 }).limit(10);



}

function addPost(title, body, cb) {
    var post = new Post();
    post.title = title;
    post.body = body;

    post.save(function (err, savedPost) {
        if (err) {
            cb(err);
        } else {
            var replacementPost = {};
            replacementPost.score = calculateScore(savedPost.votes, savedPost.createdAt);
            replacementPost.title = savedPost.title;
            replacementPost.body = savedPost.body;
            replacementPost.votes = savedPost.votes;
            replacementPost.post_id = savedPost._id;

            TopList.replaceOne({
                "score": { $lt: savedPost.score }
            }, 
            replacementPost,
            { upsert : true, returnNewDocument: true },
            function(err, returnedPost) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, savedPost);
                }
            })
        }
    });
}

function editPost(post_id, body, cb) {
    var options = { multi: false, new: true };

    Post.findOneAndUpdate({ _id: post_id }, {
        $set: {
            body: body
        }
    }, options, function (err, updatedPost) {
        if (err) {
            console.log("error updating post in DB. Message: " + err.message);
            return cb(err);
        } else {
            
            return cb(null, updatedPost);
        }
    })
}

function upVotePost(post_id, cb) {
    votePost(post_id, true, cb);
}



function downVotePost(post_id, cb) {
    votePost(post_id, false, cb);
}

function votePost(post_id, value, cb) {

    var options = { multi: false, new: true };
    Post.findOne({ _id: post_id }, function (err, post) {
        if (err) {
            console.log("error updating post in DB. Message: " + err.message);
            return cb(err);
        } else if (post == null || post == undefined) {
            console.log("error updating post in DB. PostID : " + post_id + " was not found in DB");
            return cb(err);
        } else {
            Post.findOneAndUpdate({ _id: post._id }, {
                $set: {
                    score: value ? calculateScore(post.votes + 1, post.createdAt) : calculateScore(post.votes - 1, post.createdAt),
                    votes: value ? post.votes + 1 : post.votes - 1
                }
            }, options, function (err, updatedPost) {
                if (err) {
                    console.log("error updating post in DB. Message: " + err.message);
                    return cb(err);
                } else if (updatedPost != null && updatedPost != undefined){
                    var replacementPost = {};
                    replacementPost.score = updatedPost.score;
                    replacementPost.title = updatedPost.title;
                    replacementPost.body = updatedPost.body;
                    replacementPost.votes = updatedPost.votes;
                    replacementPost.post_id = updatedPost._id;

                    TopList.replaceOne({
                        "score": { $lt: updatedPost.score }
                    }, 
                    replacementPost,
                    { upsert : true, returnNewDocument: true },
                    function(err, returnedPost) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, updatedPost);
                        }
                    })
                } else {
                    return cb(null, updatedPost);
                }
            })
        }
    })



}

function calculateScore(votes, timestamp) {
    var startingScore = 5;
    var timeDifference = Date.now() - timestamp;

    var score = ((votes + startingScore) / (1 + timeDifference)) * 1000 * 3600;
    return score;
}



module.exports = {
    get,
    addPost,
    editPost,
    upVotePost,
    downVotePost
}