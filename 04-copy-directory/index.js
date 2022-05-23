
const path = require('path');
const fs = require('fs');

async function copyDir() {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});

    await fs.promises.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true});
    await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
  
    for (let file of files) {
      await fs.promises.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
    }
  } catch (err) {
    console.log(err.message);
  }
}

copyDir();