const fs = require("fs");

function importJsonFile(fileName) {
  try {
    // Check if the file exists
    if (!fs.existsSync(fileName)) {
      throw new Error(`File ${fileName} does not exist`);
    }

    // Read the file and parse its contents as JSON
    const fileContents = fs.readFileSync(fileName);
    const jsonData = JSON.parse(fileContents);

    return jsonData;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = importJsonFile;
