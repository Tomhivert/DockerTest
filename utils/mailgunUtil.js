'use strict';

var debug = require('debug');
var error = debug('mailgunUtil:error');
var log = debug('mailgunUtil:log');

var mailgunConfig = require('config').get('Mailgun');
var util = require('util');

var api_key = mailgunConfig.apiKey;
var domain = mailgunConfig.domain;
var from = mailgunConfig.from;

var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 


/**
 * Send forgot password email
 * 
 * @param {String} password 
 * @param {String} email 
 * @param {*} next (err) 
 */
function sendForgotPassword(password, email, next)
{
    var subject = 'Reset';
    var text = 'password: ' + password;
    sendEmail(email, subject, text, next);
}

/**
 * Sends email through mailgun 
 * 
 * @param {String} to 
 * @param {String} subject 
 * @param {String} text 
 * @param {*} next (err)
 */
function sendEmail(to, subject, text, next)
{
    var data = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };
    
    mailgun.messages().send(data, function (err, body) {
        if(err)
        {
            error(err.message);
            return next(err);
        }
        log(util.format('Mail was sent successfully with id (%s) \
            and message from mailgun: %s', body.id, body.m));
        next();
    });
}


module.exports = {
    sendForgotPassword : sendForgotPassword
};