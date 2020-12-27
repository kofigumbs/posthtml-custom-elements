const fs = require('fs');
const path = require('path');
const process = require('process');

const posthtml = require('posthtml');

process.chdir(__dirname); 
posthtml()
  .use(require('../index.js')())
  .process(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'))
  .then(result => console.log(result.html))
