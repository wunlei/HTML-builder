const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

function createBundle(array) {
  const pathToBundle = path.join(__dirname + '/project-dist' + '/style.css');
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

async function getCSSFiles() {
  const pathToStyles = path.join(__dirname + '/styles');

  try {
    const promise = fsPromises.readdir(pathToStyles, { withFileTypes: true });
    const files = await promise;
    let pathArray = [];
    for (let file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToStyles + '/' + file.name);
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

async function createHTML(files) {
  try {
    const pathToTemplate = path.join(__dirname + '/template.html');
    let html = await fsPromises.readFile(pathToTemplate, { encoding: 'utf-8' });
    for (let file of files) {
      const pathToComponent = path.join(
        __dirname + '/components/' + file + '.html'
      );
      let componentHTML = await fsPromises.readFile(pathToComponent, {
        encoding: 'utf-8',
      });
      html = html.replace(`{{${file}}}`, componentHTML);
    }

    const pathToHtml = path.join(__dirname + '/project-dist/index.html');
    await fsPromises.writeFile(pathToHtml, html);
  } catch (err) {
    console.error(err);
  }
}

async function getComponents() {
  const pathToFolder = path.join(__dirname + '/components');
  try {
    const promise = fsPromises.readdir(pathToFolder, { withFileTypes: true });
    const files = await promise;
    let fileList = [];
    for (let file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFolder + '/' + file.name);
        fileList.push(path.parse(pathToFile).name);
      }
    }
    await createHTML(fileList);
  } catch (err) {
    console.error(err);
  }
}

async function copyFiles(folderName, files) {
  const pathToFolder = path.join(__dirname + folderName);

  for (let file of files) {
    const pathToFile = path.join(pathToFolder + '/' + file);
    const pathToFileCopy = path.join(
      __dirname + '/project-dist' + folderName + '/' + file
    );

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

async function getFiles(folder) {
  const pathToFolder = path.join(__dirname + folder);
  try {
    const promise = fsPromises.readdir(pathToFolder, { withFileTypes: true });
    const files = await promise;
    let fileList = [];
    for (let file of files) {
      if (file.isFile()) {
        fileList.push(file.name);
      }
    }
    await copyFiles(folder, fileList);
  } catch (err) {
    console.error(err);
  }
}

async function getAssetsFolders() {
  const pathToAssets = path.join(__dirname + '/assets');
  try {
    const promise = fsPromises.readdir(pathToAssets, { withFileTypes: true });
    const files = await promise;
    for (let file of files) {
      if (file.isDirectory()) {
        await createFolder('/project-dist/assets/' + file.name);
        await getFiles('/assets/' + file.name);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function createFolder(folder) {
  try {
    await fsPromises.mkdir(__dirname + folder, {
      recursive: true,
    });
  } catch (err) {
    console.error(err);
  }
}

async function cleanFolders() {
  try {
    const pathToFolder = path.join(__dirname + '/project-dist');
    await fsPromises.rm(pathToFolder, { recursive: true });
  } catch (err) {
    return false;
  }
}

async function createProject() {
  try {
    await cleanFolders();
    await createFolder('/project-dist');
    await createFolder('/project-dist/assets');
    await getAssetsFolders();
    await getComponents();
    await getCSSFiles();
  } catch (err) {
    console.error(err);
  }
}

createProject();
