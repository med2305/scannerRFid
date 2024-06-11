var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.get('/login', function (req, res, next) {
  console.log('GET /login');
  res.render('login');
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error message
  res.status(err.status || 500);
  res.send(err.message);
});
const fs = require('fs');
const XLSX = require('xlsx');

const filePath = 'C:/Friends/raslen/myapp/psos.xlsm'; 

fs.watch(filePath, (eventType) => {
  if (eventType === 'change') {
    var workbook = XLSX.readFile(filePath);

    var feuil2 = workbook.Sheets['Feuil2'];
    var simpleData = workbook.Sheets['Simple Data'];

    var feuil2Data = XLSX.utils.sheet_to_json(feuil2);
    var simpleDataData = XLSX.utils.sheet_to_json(simpleData);

    var simpleDataSet = new Set(simpleDataData.map(JSON.stringify));

    var newRows = feuil2Data.filter(row => !simpleDataSet.has(JSON.stringify(row)));

    Array.prototype.push.apply(simpleDataData, newRows);

    var newSimpleData = XLSX.utils.json_to_sheet(simpleDataData);

    workbook.Sheets['Simple Data'] = newSimpleData;

    var writeAttempt = function() {
      try {
        XLSX.writeFile(workbook, filePath);
      } catch (e) {
        if (e.code === 'EBUSY') {
          console.log('File is busy, retrying in 100ms');
          setTimeout(writeAttempt, 100);
        } else {
          throw e;
        }
      }
    };

    writeAttempt();
  }
});

module.exports = app;
