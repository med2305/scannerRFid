var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/table', function (req, res) {
  var XLSX = require('xlsx');

  // Read the workbook
  var workbook = XLSX.readFile('psos.xlsm');

  var sheet_name_list = workbook.SheetNames;
  var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  data.forEach(function (row) {

    var excelDate = row.Date;
    var date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    row.Date = date.toLocaleDateString();

    var excelTime = row.Time;
    if (isNaN(excelTime)) {
      row.Time = ''; // or some other default value
    } else {
      var date = new Date(1970, 0, 1); // Create a Date object at the start of 1970
      date.setSeconds(excelTime * 24 * 60 * 60); // Add the Excel time in seconds
      date.setUTCHours(date.getUTCHours() + 1);
      row.Time = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
    }

    var excelTime = row.Hour_in;
    if (isNaN(excelTime)) {
      row.Hour_in = ''; // or some other default value
    } else {
      var date = new Date(1970, 0, 1); // Create a Date object at the start of 1970
      date.setSeconds(excelTime * 24 * 60 * 60); // Add the Excel time in seconds
      date.setUTCHours(date.getUTCHours() + 1);
      row.Hour_in = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
    }

    var excelTime = row.Hour_out;
    if (isNaN(excelTime)) {
      row.Hour_out = ''; // or some other default value
    } else {
      var date = new Date(1970, 0, 1); // Create a Date object at the start of 1970
      date.setSeconds(excelTime * 24 * 60 * 60); // Add the Excel time in seconds
      date.setUTCHours(date.getUTCHours() + 1);
      row.Hour_out = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
    }

    // Add one hour to the time
    date.setUTCHours(date.getUTCHours() + 1);

    row.Hour_in_PAGOD = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
  });
  res.render('table', { data: data });
});

router.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);
  if (username === 'raslen' && password === 'raslen') {
    res.redirect('/table');
  } else {
    res.send('Invalid username or password');
  }
});

// router.post('/data', (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   console.log("testtttttt");
//   // Authenticate user
//   authenticateUser(username, password, (error, user) => {
//     if (error || !user) {
//       // Authentication failed
//       res.redirect('/');
//     } else {
//       // Authentication succeeded
//       req.session.userId = user.id;
//       res.redirect('/data');
//     }
//   });
// });

module.exports = router;
