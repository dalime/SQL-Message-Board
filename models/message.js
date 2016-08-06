const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/messages.json');
const uuid = require('uuid');
const moment = require('moment');

exports.getAll = function(cb) {
  fs.readFile(dataFilePath, (err, buffer) => {
    if (err) return cb(err);
    let messages;
    try {
      messages = JSON.parse(buffer);
    } catch(err) {
      return cb(err);
    }
    cb(null, messages);
  });
}

exports.create = function(messageObject, cb) {
  exports.getAll(function(err, messages) {
    if (err) return cb(err);

    messageObject.id = uuid.v4();
    messageObject.time = moment().format("MMM Do YY");

    messages.push(messageObject);
    fs.writeFile(dataFilePath, JSON.stringify(messages), function(err) {
      cb(err, messageObject.id);
    });
  });
}

exports.getMessage = function(messageID, cb) {
  exports.getAll(function(err, messages) {
    if (err) return cb(err);
    let index = messages.map(function(obj) {
      return obj.id;
    }).indexOf(messageID);
    let message = messages[index];
    console.log(message);
    cb(null, message);
  });
}

exports.updateMessage = function(messageObject, messageID, cb) {
  exports.getAll(function(err, messages) {
    let index = messages.map(function(obj) {
      return obj.id;
    }).indexOf(messageID);
    messageObject.id = messageID;
    messages.splice(index, 1, messageObject);
    fs.writeFile(dataFilePath, JSON.stringify(messages), function(err) {
      cb(err);
    });
  });
}

exports.deleteMessage = function(messageID, cb) {
  exports.getAll(function(err, messages) {
    if (err) return cb(err);
    messages = messages.filter(message => message.id !== messageID)
    fs.writeFile(dataFilePath, JSON.stringify(messages), function(err) {
      cb(err);
    });
  });
}
