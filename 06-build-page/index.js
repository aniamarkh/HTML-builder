const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const assetsDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const templatePath = path.resolve(__dirname, 'template.html');

async function createDir() {
  await fs.promises.rm(projectDir, {recursive: true, force: true});
  await fs.promises.mkdir(projectDir, {recursive: true});
}

async function createHtml() {
  try {
    const writeStream = fs.createWriteStream(path.resolve(projectDir, 'index.html'));
    let template = await fs.promises.readFile(templatePath, 'utf-8');
    const templateTags = template.match(/{{.+}}/g);
  
    for (let tag of templateTags) {
      const componentFile = tag.match(/(?<={{).+?(?=}})/g).toString() + '.html';
      await fs.promises.readFile(path.join(componentsDir, componentFile), 'utf-8').then(data => {
        template = template.replace(tag, data);
      });
    }
    writeStream.write(template);
  } catch (err) {
    console.log(err.message);
  }
}

async function mergeStyles() {
  try { 
    const styles = await fs.promises.readdir(stylesDir, {withFileTypes: true});
    const writeStream = await fs.createWriteStream(path.resolve(projectDir, 'style.css'));
    
    for (let style of styles) {
      let stylePath = path.resolve(stylesDir, style.name);
      if (style.isFile() && path.extname(stylePath) === '.css') {
        const readStream = fs.createReadStream(path.join(stylesDir, style.name), 'utf-8');
        readStream.pipe(writeStream, { end: false });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function copyDirectory(fromPath, toPath) {
  try {
    const files = await fs.promises.readdir(fromPath, {withFileTypes: true});

    await fs.promises.rm(toPath, {recursive: true, force: true});
    await fs.promises.mkdir(toPath, {recursive: true});
  
    for (let file of files) {
      const filePath = path.join(fromPath, file.name);
      if (file.isFile()) {
        await fs.promises.copyFile(filePath, path.join(toPath, file.name));
      } else if (file.isDirectory()) {
        copyDirectory(filePath, path.join(toPath, file.name));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function init() {
  await createDir();
  createHtml();
  mergeStyles();
  copyDirectory(assetsDir, path.resolve(projectDir, 'assets'));
}

init();