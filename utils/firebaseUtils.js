'use strict';

var debug = require('debug');
var error = debug('firebaseUtils:error');
var log = debug('firebaseUtils:log');

var admin = require("firebase-admin");
var util = require('util');
var async = require('async');
var configAdmin = require('config').get('Firebase.Admin');


var serviceAccount = require('./' + configAdmin.keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "db__url_REPLACE"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();

// ref.once("value", function(snapshot) {
//     console.log(snapshot.val());
// });


/**
 * Creates chat in firebase realtime database
 * 
 * @param {Object} assetDetails composed of: id, sellerId
 * @param {Object} customerDetails composed of: id
 * @param {*} next (err)
 */
function createChat(assetDetails, customerDetails, next)
{
    if (!assetDetails || !customerDetails)
    {
        var msg = 'cant create chat becasue of null input';
        error(msg);
        return next(new Error(msg));
    }

    log(util.format('Start createChat with asset detail: %s and customer details %s'),
        assetDetails, customerDetails);

    // First construct the chat json
    var customer = {
        _id: customerDetails.id
    };

    var asset = {
        _id : assetDetails.id,
        owner_id: assetDetails.sellerId,
    };

    var newChat = {
        asset_id: asset,
        customer: customer,
        last_action: '',
        last_action_timestamp: '',
        num_of_messages: 0
    };

    // save new chat to db
    var chatsRef = db.ref('chats');
    var newChatRef = chatsRef.push();
    var newChatId = newChatRef.key;

    // Construct users (seller and customer)
    var usersRef = db.ref('users');    
    // Seller
    var sellerRef = usersRef.child(assetDetails.sellerId);
    // Customer
    var customerRef = usersRef.child(customerDetails.id);
    
    var userNewChat = {};
    userNewChat[newChatId] = true;

    // Prepate functions for async
    var createChat = function(cb) { 
        newChatRef.set(newChat, cb); 
    };
    var addChatToSeller = function(cb) { 
        sellerRef.update(userNewChat, cb); 
    };
    var addChatToCustomer = function(cb) { 
        customerRef.update(userNewChat, cb); 
    };


    async.parallel([
        createChat, addChatToCustomer, addChatToSeller
    ], function(err, results)
    {
        if(err)
        {
            var msg = 'firebase createChat error: ' + err.message;
            error(msg);
            return next(new Error(msg));
        }
        log('Chat create successfully');
        next();
    });
}


module.exports = {
    createChat : createChat
}