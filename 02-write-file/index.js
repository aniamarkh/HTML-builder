const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hey! Enter some text here: ');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Oh okay... Buy!');
    process.exit();
  } else {
    output.write(data.toString());
  }
});

process.on('SIGINT', () => {
  stdout.write('Done! Buy!');
  process.exit();
});