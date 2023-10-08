const fs = require("fs");
const csv = require("csv-parser");

function replaceEmptyCellsWithZero(inputFile, outputFile) {
  const data = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (row) => {
      // Replace empty cells with 0
      for (const key in row) {
        if (row.hasOwnProperty(key) && row[key] === "") {
          row[key] = "0";
        }
      }
      data.push(row);
    })
    .on("end", () => {
      if (data.length === 0) {
        console.log("Input CSV is empty.");
        return;
      }

      // Extract and write the header row
      const headerRow = Object.keys(data[0]).join(",");
      fs.writeFileSync(outputFile, `${headerRow}\n`);

      // Append the modified data to the new CSV file
      data.forEach((row) => {
        const rowValues = Object.values(row).join(",");
        fs.appendFileSync(outputFile, `${rowValues}\n`);
      });

      console.log(
        `Successfully replaced empty cells with 0 and saved to ${outputFile}`
      );
    });
}

// // Example usage:
// const inputFile = "input.csv"; // Replace with your input CSV file
// const outputFile = "output.csv"; // Replace with the desired output CSV file
// replaceEmptyCellsWithZero(inputFile, outputFile);

module.exports = { replaceEmptyCellsWithZero };
