const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname + '/text.txt');

const stream = fs.createReadStream(filePath, 'utf-8');

stream.on('data', (res) => {
  process.stdout.write(res);
});

stream.on('error', (error) => {
  console.error(error);
});