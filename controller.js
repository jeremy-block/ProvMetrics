const saveJsonToCsvFile = require("./modules/saveJsonToCsvFile")
const pass1 = require("./pre-processing/firstLoop")

let outputfilename = "dataset1"

//loop over the data in a folder.
firstLoopData = pass1.firstLoop("data/Dataset_1/User Interactions/");
// console.log(firstLoopData)

//save the data as a csv file.
saveJsonToCsvFile(outputfilename, firstLoopData);
