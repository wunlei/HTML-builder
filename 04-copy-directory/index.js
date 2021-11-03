const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const pathToFolder = path.resolve(__dirname + '/files');

async function getFiles() {
  try {
    const promise = fsPromises.readdir(pathToFolder, { withFileTypes: true });
    const files = await promise;
    let fileList = [];
    for (let file of files) {
      if (file.isFile()) {
        fileList.push(file.name);
      }
    }
    return fileList;
  } catch (err) {
    console.error(err);
  }
}

async function getFilesCopies() {
  const pathToCopyFolder = path.resolve(__dirname + '/files-copy');
  try {
    const promise = fsPromises.readdir(pathToCopyFolder, {
      withFileTypes: true,
    });
    const files = await promise;
    let fileList = [];
    for (let file of files) {
      if (file.isFile()) {
        fileList.push(file.name);
      }
    }
    return fileList;
  } catch (err) {
    console.error(err);
  }
}

async function copyFiles(files) {
  for (let file of files) {
    const pathToFile = path.resolve(pathToFolder + '/' + file);
    const pathToFileCopy = path.resolve(__dirname + '/files-copy' + '/' + file);

    try {
      const promise = fsPromises.copyFile(
        pathToFile,
        pathToFileCopy,
        fs.constants.COPYFILE_FICLONE
      );
      await promise;
    } catch (err) {
      console.error(err);
    }
  }
}

async function checkFileExistence() {
  try {
    const files = await getFiles();
    const fileCopies = await getFilesCopies();

    for (let file of fileCopies) {
      if (!files.includes(file)) {
        const pathToFileCopy = path.resolve(
          __dirname + '/files-copy' + '/' + file
        );
        await fsPromises.rm(pathToFileCopy);
      }
    }
    copyFiles(files);
  } catch (err) {
    console.error(err);
  }
}

async function copyFolder() {
  try {
    await fsPromises.mkdir(__dirname + '/files-copy', {
      recursive: true,
    });
    await checkFileExistence();
  } catch (err) {
    console.error(err);
  }
}

copyFolder();
