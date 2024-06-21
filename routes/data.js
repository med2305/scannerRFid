const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../data.json');

router.post('/data', (req, res) => {
  const receivedData = req.body.data.split(','); // Assuming CSV formatted data
    console.log("receivedData", receivedData);
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // returns the time in the format 'HH:mm:ss'
    
    const dataObject = {
      Date: now.toISOString().split('T')[0], // returns the date in the format 'YYYY-MM-DD'
      Time: currentTime,
      Leadset: receivedData[3] || '',
      BatchSize: receivedData[4] || '',
      Hour_in: receivedData[5] ? currentTime : '',
      Hour_out: receivedData[5] ? '' : currentTime
    };

  fs.readFile(dataFilePath, (err, data) => {
    let jsonData = [];
    if (!err) {
      try {
        jsonData = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }

    jsonData.push(dataObject);

    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        res.status(500).send('Error writing to file');
      } else {
        res.status(200).send('Data received and stored');
      }
    });
  });
});

router.get('/data', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

module.exports = router;