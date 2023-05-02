const reader = require("./modules/filereader");
const saveJsonToCsvFile = require("./modules/saveJsonToCsvFile")

let outputfilename = "testing"

const jsonData = reader(
  "data/Dataset_1/User Interactions/Arms_P1_InteractionsLogs.json"
);
console.log(jsonData)

saveJsonToCsvFile(outputfilename, jsonData);