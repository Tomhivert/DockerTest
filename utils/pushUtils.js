'use strict';

var debug = require('debug');
var error = debug('pushUtils:error');
var log = debug('pushUtils:log');

var util = require('util');
var apn = require('apn');
var iosConfig = require('config').get('Notifications.IOS');
var async = require('async');
var userModel = require('../db/models/user/userModel');

var options = {
    token: {
        key: "./notifications/ios/" + iosConfig.keyName,
        keyId: iosConfig.keyId,
        teamId: iosConfig.teamId
    },
    production: iosConfig.production,
    connectionRetryLimit: 3
};
var apnProvider = new apn.Provider(options);



function sendPush(userIdsArray, pushBody, next)
{
    getDevicesDetails(userIdsArray, function(err, deviceDetailsArray)
    {
        if(!deviceDetailsArray)
        {
            var msg = 'push: invalid input';
            error(msg);
            return next(new Error(msg));
        }
        log('start sending push with body: ' + pushBody);

        var iosDeviceTokens = [];
        var androidDeviceTokens = [];
        for(var i = 0; i < deviceDetailsArray.length; i++)
        {
            var detail = deviceDetailsArray[i];
            if(detail.android_token)
            {
                androidDeviceTokens.push(detail.android_token);
            }
            else if(detail.ios_token)
            {
                iosDeviceTokens.push(detail.ios_token);
            }
        }

        async.parallel(async.reflectAll({
            ios: async.apply(sendIOSNotifications, iosDeviceTokens, pushBody, 0, null),
            android: async.apply(sendAndroidNotifications, androidDeviceTokens)
        }), function(err, results){
            if (err)
            {
                error(err.message);
                return next(err);
            }

            var iosValArr = results.ios.value;
            if (iosValArr && iosValArr.length > 1)
            {
                var iosFail = results.ios.value[0];
                var iosSuccess = results.ios.value[1];
                log(util.format('ios push ended with %s success and %s fails', iosSuccess, iosFail));
            }
            
            next();
        });
    });
}


function getDevicesDetails(userIdsArray, next)
{
    if(!userIdsArray)
    {
        var msg = 'push: invalid input';
        error(msg);
        return next(new Error(msg));
    }
    userModel.find({_id: {$in: userIdsArray}} , function(err, results)
    {
        if(err)
        {
            error(err.message);
            return next(err);
        }
        var devicesDetails = results.map(user => user.device_details);
        return next(null, devicesDetails);
    });
}


/**
 * 
 * @param {String} deviceTokens can be an array of tokens
 * @param {String} notificationAlert 
 * @param {Number} badge 
 * @param {*} payload 
 * @param {*} next (err, numFailed, numSuccess)
 */
function sendIOSNotifications(deviceTokens, notificationAlert, badge, payload,  next)
{
    var note = new apn.Notification();
    //note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = badge;
    note.sound = "default";
    note.alert = notificationAlert;
    note.payload = payload;
    note.topic = iosConfig.topic;

    apnProvider.send(note, deviceTokens).then((result) => {
        for (var i = 0; i < result.failed.length; i++)
        {
            var msg = 'error not sent - device: ' + result.failed[i].device + 
                ' status: ' + result.failed[i].status + ' reason: '
                + result.failed[i].response.reason;
            error(msg);
        }

        for (var i = 0; i < result.sent.length; i++)
        {
            var msg = 'successful sent - device: ' + result.sent[i].device;
            log(msg);
        }

        next(null, result.failed.length, result.sent.length);
    });
}



function sendAndroidNotifications(deviceTokens, next)
{
    next();
}

module.exports = {
    sendPush: sendPush
};