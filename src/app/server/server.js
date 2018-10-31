"use strict";
const XLSX = require('xlsx');
const express = require('express');
const parser = require('body-parser');
const process = require('process');
const path = require('path');

let router = express.Router();
router.post('/', async (req, response) => {
  try {
    const workbook = XLSX.readFile('../../assets/registry.xlsx');
    const first_sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[first_sheet_name];

    const res = [];
    for (let i = 2; i < 163; i++) {
      const findResById = (res) => res.id === worksheet[`A${i}`].w;
      const resFound = res.find(findResById);
      if (!resFound) {
        const resItem = {
          id: worksheet[`A${i}`].w,
          title: worksheet[`D${i}`].w,
          region: worksheet[`C${i}`].w,
          lines: []
        };
        res.push(resItem);
      }
    }

    for (let x = 2; x < 163; x++) {
      res.forEach((item) => {
        if (item.id === worksheet[`A${x}`].w) {
          const findPowerLineById = (line) => line.id === worksheet[`B${x}`].w;
          const lineFound = item.lines.find(findPowerLineById);
          if (!lineFound) {
            const lineItem = {
              id: worksheet[`B${x}`].w,
              title: worksheet[`E${x}`].w,
              voltage: worksheet[`F${x}`].w,
              length: worksheet[`G${x}`].w ? worksheet[`G${x}`].w : 0,
              planGa: worksheet[`H${x}`].w ? worksheet[`H${x}`].w : 0,
              factGa: worksheet[`I${x}`].w ? worksheet[`I${x}`].w : 0,
              planKm: worksheet[`J${x}`].w ? worksheet[`J${x}`].w : 0,
              factKm: worksheet[`K${x}`].w ? worksheet[`K${x}`].w : 0,
              brigades: worksheet[`L${x}`].w ? worksheet[`L${x}`].w : 0,
              people: worksheet[`M${x}`].w ? worksheet[`M${x}`].w : 0,
              machines: worksheet[`N${x}`].w ? worksheet[`N${x}`].w : 0
            };
            item.lines.push(lineItem);
          }
        }
      });
    }
    console.log(res);
    // return res;
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(res));
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});


process
  .on('uncaughtException', (err) => {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
  })
  .on('ECONNRESET', (err) => {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
  })
  .on('ETIMEDOUT', (err) => {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
  });


var app = express();
app.use(function (req, res, next) {
  req.on('error', (err) => {
    console.log('error catched', err);
  });
  next();
})
  .use(function (req, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Credentials', true);
    next();
  })
  .use(express.static(path.resolve('C:\\development\\web\\angular\\map-dashboard\\dist')))
  //.use(express.static('/var/wwwn/phonebook/dist/'))
  .get('*', (req, res) => {
    res.sendFile(path.resolve('C:\\development\\web\\angular\\map-dashboard\\dist\\index.html'));
  })
  .use(parser.json())
  .use('/', router)
  .listen(7777, function () {
    console.log('Server started at 7777');
  }).on('error', function(err){
  console.log('ON ERROR HANDLER');
  console.log(err);
});
