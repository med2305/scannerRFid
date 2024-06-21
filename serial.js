const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// Initialize the serial port (replace 'COM5' with your actual port name)
const port = new SerialPort({
  path: 'COM4',
  baudRate: 9600
});

// Set up the parser
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Listen for data from the serial port
parser.on('data', (data) => {
  console.log('Data:', data);
  if (data !== "CLEARSHEET" && data !== "LABEL,Date,Time,Leadset,BatchSize,Hour_in,Hour_out") {
    sendToServer(data);
  }
});

// Function to send data to the Express.js server
function sendToServer(data) {
  axios.post('http://localhost:3000/api/data', { data })
    .then(response => {
      console.log('Server response:', response.data);
    })
    .catch(error => {
      console.error('Error sending data to server:', error);
    });
}
