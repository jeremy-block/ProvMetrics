const fs = require('fs');
const csv = require('csv-parser');

/**
 * The columns from all files will be preserved, and rows will be appended at the end of the file. If any file has different column names, those columns will also be included in the merged output.
 * @param {Array <String>} files A set of file names to be merged
 * @param {String} outputFileName A name for the output file. Defaults to being placed in the "./output/" directory
 * @warn I have not tested if this work with csv files of different sizes/dimentions.
 */
function mergeCSVFiles(files, outputFileName) {
  // Initialize an empty object to store unique column names across all files.
  const uniqueColumns = {};

  // Helper function to merge and deduplicate the column names.
  function mergeColumns(newColumns) {
    newColumns.forEach((column) => {
      uniqueColumns[column] = true;
    });
  }

  // Iterate through the list of file paths.
  async function processFiles(index) {
    if (index >= files.length) {
      // Generate the output file path based on the first file's name.
      const outputPath = "./output/" + outputFileName;

      // Write the merged data to the output CSV file.
      const writeStream = fs.createWriteStream(outputPath, { flags: "w" });
      const unifiedHeader = Object.keys(uniqueColumns);
      writeStream.write(unifiedHeader.join(",") + "\n");

      for (const row of mergedData) {
        const rowData = unifiedHeader
          .map((header) => row[header] || "")
          .join(",");
        writeStream.write(rowData + "\n");
      }

      writeStream.end();

      console.log("Merged CSV file created at:", outputPath);
      return;
    }

    // Read each CSV file and add its contents to the mergedData array.
    const file = files[index];
    const rows = [];

    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => {
        mergeColumns(Object.keys(rows[0]));
        mergedData = mergedData.concat(rows);
        processFiles(index + 1);
      });
  }

  // Initialize an empty array to store all the data from the CSV files.
  let mergedData = [];

  processFiles(0);
}

module.exports = { mergeCSVFiles };
