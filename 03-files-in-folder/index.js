const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, elements) => {
  if (err) {
    console.log(err);
  } else {
    let files = elements.filter(file => file.isFile());
    files.forEach(file => {
      let filePath = path.join(__dirname, 'secret-folder', file.name);
      let fileName = path.parse(filePath).name;
      let fileExt = path.parse(filePath).ext;

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          console.log([fileName, fileExt.slice(1), ((stats.size / 1000) + ' kb')].join(' - '));
        }
      });
    });
  }
});
