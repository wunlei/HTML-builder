const path = require('path');
const fs = require('fs');
const process = require('process');

const filePath = path.resolve(__dirname + '/text.txt');
const stream = fs.createWriteStream(filePath);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdout.write('Hello, enter your text:\n');

let isFirstLine = true;

function writeToFile(input) {
  if (input === '') {
    fs.appendFile(filePath, '\n', handleError);
  } else {
    if (isFirstLine) {
      fs.appendFile(filePath, input, handleError);
      isFirstLine = false;
    } else {
      fs.appendFile(filePath, '\n' + input, handleError);
    }
  }
}

function readInput(input) {
  if (input === 'exit') {
    rl.close();
  } else {
    writeToFile(input);
  }
}

rl.on('line', readInput);

function sayBye() {
  process.stdout.write('Goodbye');
}

rl.on('close', sayBye);

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

stream.on('error', handleError);
