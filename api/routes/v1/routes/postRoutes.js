/**
 * This module routes any URL path that starts with: '.../api/v1/post/'
 */

'use strict';

var express = require('express');
var router = express.Router();

var postController = require('../controllers/postController.js');

router.route('/addPost')
    .post(postController.addPost);

router.route('/addEducation')
    .post(postController.addEducation);

module.exports = router;