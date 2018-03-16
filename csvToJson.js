let csvToJson = require('convert-csv-to-json');

let fileInputName = 'Player_Match.csv'; 
let fileOutputName = 'Player_Match.json';
csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName,fileOutputName);