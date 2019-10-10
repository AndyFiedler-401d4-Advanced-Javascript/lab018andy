'use strict';

const fs = require('fs');
// const uuid = require('uuid');

require('../logger');
require('../network-logger');
require('./socket-io-logger');
require('./q-logger');
require('./cache-invalidator');

const Q = require('@nmq/q/client');

// const eventHub = require('../hub');
const {promisify} = require('util');

const readFileProm = promisify(fs.readFile);

const writeFileProm = promisify(fs.writeFile);


const alterFile = (file) => {
  readFileProm(file)
    .then(data => {
      Q.publish('read', { file, text: data.toString() });
      let text = data.toString().toUpperCase();
      Q.publish('toUpper', { file, text: text });
      return writeFileProm(file, Buffer.from(text));
    })
    .then(() => {
      console.log(`${file} saved`);
      Q.publish('file', 'save', file);
    })
    .then(() => {
      Q.publish('complete');
    })
    .catch(error => {
      Q.publish('error', error);
    });
};


// setInterval(() => {
  
// },1);

let file = process.argv.slice(2).shift();
alterFile(file);
