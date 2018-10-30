"use strict";
const XLSX = require('xlsx');

var workbook = XLSX.readFile('../../assets/registry.xlsx');
var first_sheet_name = workbook.SheetNames[0];
var worksheet = workbook.Sheets[first_sheet_name];
var desired_cell = worksheet['A1'];
// console.log('workbook', worksheet);

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
          length: worksheet[`G${x}`].w,
          planGa: worksheet[`H${x}`].w,
          factGa: worksheet[`I${x}`].w,
          planKm: worksheet[`J${x}`].w,
          factKm: worksheet[`K${x}`].w,
          brigades: worksheet[`L${x}`].w,
          people: worksheet[`M${x}`].w,
          machines: worksheet[`N${x}`].w
        };
        item.lines.push(lineItem);
      }
    }
  });
}

console.log(res);
return res;
