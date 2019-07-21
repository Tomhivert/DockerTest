/**
 * This module routes any URL path that starts with: '.../api/'
 */

'use strict';

var debug = require('debug');


var express = require('express');
var router = express.Router();

var v1Routes = require('./v1/routes/v1Routes');

router.use('/v1/', v1Routes);


module.exports = router;