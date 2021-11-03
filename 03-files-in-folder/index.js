const path = require('path');
const fsPromise = require('fs/promises');
const process = require('process');
const pathToFolder = path.resolve(__dirname + '/secret-folder');

async function getFileInfo(file) {
  try {
    const pathToFile = path.resolve(pathToFolder + '/' + file.name);
    const fileInfo = path.parse(pathToFile);
    const ext = fileInfo.ext.slice(1);
    const name = fileInfo.name;
    const size = await getFileSize(pathToFile);
    return [name, ext, size.size + 'b'];
  } catch (err) {
    console.error(err);
  }
}

async function getFileSize(path) {
  try {
    const size = await fsPromise.stat(path);
    return size;
  } catch (err) {
    console.error(err);
  }
}

async function getFiles() {
  try {
    const promise = fsPromise.readdir(pathToFolder, { withFileTypes: true });
    const files = await promise;

    for (let file of files) {
      if (file.isFile()) {
        const promise = getFileInfo(file);
        const result = await promise;
        process.stdout.write(result.join(' - ') + '\n');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

getFiles();
