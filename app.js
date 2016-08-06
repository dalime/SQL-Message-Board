const PORT = process.env.PORT || 8000;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const Message = require('./models/message');

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res, next) => {
  Message.getAll(function(err, messages) {
    res.render('index', {title: "Message Board", messages})
  })
})

app.use(express.static('public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.route('/messages')
  .get((req, res) => {
    Message.getAll(function(err, messages) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(messages);
      }
    });
  })
  .post((req, res) => {
    Message.create(req.body, function(err, id) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(id);
      }
    })
  })

app.route('/messages/:id')
  .get((req, res) => {
    Message.getMessage(req.params.id, function(err, message) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(message);
      }
    })
  })
  .put((req, res) => {
    Message.updateMessage(req.body, req.params.id, function(err, message) {
      res.status(err ? 400 : 200).send(err);
    })
  })
  .delete((req, res) => {
    Message.deleteMessage(req.params.id, function(err, message) {
      res.status(err ? 400 : 200).send(err);
    })
  })

app.all((req, res) => {
  res.send('404');
})

app.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
})
