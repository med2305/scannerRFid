const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const dataRouter = require('./routes/data');

const app = express();

// Set up Pug as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', dataRouter);

// Route to render the table
app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.render('index', { data: [] }); // Pass an empty array if there's an error
    }

    let jsonData = [];
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }

    res.render('index', { data: jsonData });
  });
});
app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);
  if (username === 'raslen' && password === 'raslen') {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      const jsonData = JSON.parse(data);
      res.render('data', { data: jsonData, message: null });
    });
  } else {
    res.render('index', { message: 'Invalid username or password' });
  }
});
module.exports = app;