const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

//todo: handle when json data has an array of values or is ill formed.

function saveJsonToCsvFile(fileName, jsonData) {
  fileName = "./output/" + fileName + ".csv";
  try {
    // Check if file exists, and create it if it doesn't
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, "");
    }

    // Create a new CSV writer
    const csvWriter = createCsvWriter({
      path: fileName,
      header: Object.keys(jsonData[0]).map((fieldName) => ({
        id: fieldName,
        title: fieldName,
      })),
    });

    // Write the JSON data to a CSV file
    csvWriter
      .writeRecords(jsonData)
      .then(() => console.log(`Data saved to ${fileName} successfully`));
  } catch (err) {
    console.error(err);
  }
}

module.exports = saveJsonToCsvFile;
