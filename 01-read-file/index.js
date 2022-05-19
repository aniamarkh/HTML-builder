const path = require('path');
const fs = require('fs');

const READ = fs.createReadStream(path.join(__dirname, 'text.txt'));
READ.on('data', chunk => console.log(chunk.toString()));