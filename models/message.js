const db = require('../config/db');


const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/messages.json');
const uuid = require('uuid');
const moment = require('moment');
const squel = require('squel').useFlavour('mysql');


db.query(`create table if not exists message (
  title varchar(50),
  text varchar(500),
  author varchar(50),
  time varchar(20),
  id varchar(200)
  )`, err => {
  console.log('table create err: ', err);
  }
  })


exports.getAll = function(cb) {
  let sql = squel.select().from('message').toString();
  db.query(sql, (err, messages) => {
  cb(err, messages);
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
