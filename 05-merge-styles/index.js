const path = require('path');
const fs = require('fs');

async function MergeStyles() {
  try { 
    const styles = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    const writeStream = fs.createWriteStream(path.resolve(path.join(__dirname, 'project-dist'), 'bundle.css'));
    
    for (let style of styles) {
      let stylePath = path.resolve(path.join(__dirname, 'styles'), style.name);
      if (style.isFile() && path.extname(stylePath) === '.css') {
        const readStream = fs.createReadStream(path.join(path.join(__dirname, 'styles'), style.name), 'utf-8');
        readStream.pipe(writeStream, { end: false });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

MergeStyles();