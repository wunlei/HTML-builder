const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const pathToFolder = path.join(__dirname + '/styles');

function createBundle(array) {
  const pathToBundle = path.join(__dirname + '/project-dist' + '/bundle.css');
  const output = fs.createWriteStream(pathToBundle);

  for (let element of array) {
    const input = fs.createReadStream(element);
    let style = '';

    input.on('data', (chunk) => {
      style += chunk;
    });

    input.on('end', () => {
      output.write(style + '\n');
    });
  }
}

async function getFiles() {
  try {
    const promise = fsPromises.readdir(pathToFolder, { withFileTypes: true });
    const files = await promise;
    let pathArray = [];
    for (let file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFolder + '/' + file.name);
        let fileInfo = path.parse(pathToFile).ext;

        if (fileInfo === '.css') {
          pathArray.push(pathToFile);
        }
      }
    }
    createBundle(pathArray);
  } catch (err) {
    console.error(err);
  }
}

getFiles();
