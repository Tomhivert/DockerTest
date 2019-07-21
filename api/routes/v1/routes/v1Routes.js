/**
 * This module routes any URL path that starts with: '.../api/v1/'
 */

'use strict';

var debug = require('debug');
var error = debug('apiRoutes:error');
var log = debug('apiRoutes:log');

var express = require('express');
var router = express.Router();

var postRoutes = require('./postRoutes.js');

router.use('/user', postRoutes);

module.exports = router;