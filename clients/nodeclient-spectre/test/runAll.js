'use strict';

const fs = require('fs');
const path = require('path');

const SpectreClient = require('../src/SpectreClient');

const spectreUrl = 'http://localhost:3000';

// read binary data
const bitmap1 = fs.readFileSync(path.join(__dirname, 'img/img1.png'));
// convert binary data to base64 encoded string
const screenshot1Base64 = new Buffer(bitmap1).toString('base64');

// read binary data
const bitmap2 = fs.readFileSync(path.join(__dirname, 'img/img2.png'));
// convert binary data to base64 encoded string
const screenshot2Base64 = new Buffer(bitmap2).toString('base64');

const spectreClientInstance = new SpectreClient(spectreUrl);

Promise
        .resolve()
        .then(() => {
          return spectreClientInstance.createTestrun("Projekt", "Suite");
        })
        .then((result) => {
          console.log(result);
          return result;
        })
        .then((result) => {
          return spectreClientInstance.submitScreenshot("Testimage", "Testbrowser", 480, screenshot1Base64, result.id)
        })
        .then((result) => {
          console.log(result);
          return result;
        })
        .then(() => {
          return spectreClientInstance.createTestrun("Projekt", "Suite");
        })
        .then((result) => {
          console.log(result);
          return result;
        })
        .then((result) => {
          return spectreClientInstance.submitScreenshot("Testimage", "Testbrowser", 480, screenshot2Base64, result.id)
        })
        .then((result) => {
          console.log(result);
          return result;
        });
