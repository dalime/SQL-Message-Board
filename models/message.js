const db = require('../config/db');

const mysql = require('mysql');
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
  time timestamp,
  id varchar(200)
  )`, err => {
  if (err) {
    console.log('Table Create Error: ', err);
  }
});


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
    messageObject.time = moment().format("MMM DD YY");

    messages.push(messageObject);

    let sql = squel.insert().into('message').setFields(messageObject).toString();
    db.query(sql, (err, messageObject) => {
      cb(err, messageObject.id);
    })
  });
}

exports.getMessage = function(messageID, cb) {
    let sql = squel.select().from('message').where('id = ?', messageID).toString();
    db.query(sql, (err, message) => {
      cb(err, message[0]);
    })
}

exports.updateMessage = function(messageID, messageObject, cb) {
    delete messageObject.id;
    delete messageObject.time;
    let sql = squel.update().table('message').setFields({
      "title": messageObject.title,
      "text": messageObject.text,
      "author": messageObject.author
    }).where('id = ?', messageID).toString();
    db.query(sql, (err, messageObject) => {
      cb(err, messageObject);
    });
}

exports.deleteMessage = function(messageID, cb) {
  let sql = squel.delete().from('message').where('id = ?', messageID).toString();
  db.query(sql, (err, messages) => {
    cb(err, messages);
  })
}
