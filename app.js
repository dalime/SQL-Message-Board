require('dotenv').config();

const PORT = process.env.PORT || 8000;

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Message = require('./models/message');
const app = express();

// GENERAL MIDDLEWARE


app.set('view engine', 'pug');



app.set('views', './views');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
// ROUTES
app.get('/', (req, res, next) => {
  Message.getAll(function(err, messages) {
    res.render('index', {title: "Message Board", messages})
  })
})
app.get('/timestamp', (req, res) => {
  res.send({ timestamp: Date.now() });
});
app.route('/messages')
  .get((req, res) => {
  // GET / messages - get all messages
    Message.getAll(function(err, messages) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(messages);
      }
    });
  })
  .post((req, res) => {
  // POST /messages - create a new message
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
  // GET /messages/5 - get one message
    res.send(`Here is message #${req.params.id}!`);
  })
  .put((req, res) => {
  // PUT /messages/5 - update one message

    let messageId = req.params.id;
    let updateObj = req.body;

    Message.updateMessage(messageId, updateObj, function(err, newMessage) {
      res.status(err ? 400 : 200).send(err) || newMessage;
    });
  })
  .delete((req, res) => {
  // DELETE /messages/5 - delete one message
  let messageId = req.params.id;

    Message.deleteMessage(messageId => {
      res.status(err ? 400 : 200).send(err);
    });


  });

////////////////////////////////
app.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
})
////////////////////////////////
