const fs = require("fs");

/**
 * 
 * @param {string} folderPath - path to the folder to inspect
 * @returns Array of file names (strings)
 */
function getFileNamesInFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    return files;
  } catch (err) {
    console.error(`Error reading folder: ${err}`);
    return [];
  }
}

/**
 * 
 * @param {string} fileName - The path to the interactions file to import and load the json for
 * @returns parsed json array of interactions.
 */
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

module.exports = { importJsonFile, getFileNamesInFolder };

// async function importJsonFile(fileName, debug = false) {
//   try {
//     if (debug)
//       console.log("Currently in this directory", fs.readdirSync(fileName));
//     if (debug) console.log('Looking for file named: "', fileName, '"');
//     // Check if the file exists
//     if (!fs.existsSync(fileName)) {
//       throw new Error(`File ${fileName} does not exist`);
//     }

//     // Read the file and parse its contents as JSON
//     const fileContents = await fs.readFileSync(fileName);
//     const jsonData = await JSON.parse(fileContents);

//     return jsonData;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }