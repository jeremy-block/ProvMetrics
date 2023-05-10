const countInteractions = require("../modules/countInteractions");
const reader = require("../modules/filereader");
const cleanup = require("./datatranslators/dataset1");

/**
 * 
 * @param {string} pathToInteractionFiles 
 * @returns An array of objects. one object for each file in the path provided.
 */
function firstLoop(pathToInteractionFiles) {  
  //Identify the list of file names to process in the folder provided to first Loop
  const fileNameList = reader.getFileNamesInFolder(pathToInteractionFiles);
  // console.log(fileNameList);

  //todo: add try catch to ensure there are only .json interaction files to process.

  //stub for output
  const output = []
  //loop over the files in the the spefified directory
  for (filename of fileNameList) {
    //read file
    const originalJsonData = reader.importJsonFile(pathToInteractionFiles + filename);
    //pre-process by cleaning up the keys.
    const jsonData = cleanup.correctKeys(originalJsonData);
    
    //count the intereactions
    const totalInteraction = countInteractions(jsonData);
    //append the file name so it's included with the output.
    totalInteraction["filename"] = filename
    
    output.push(totalInteraction)
  }

  return output;
}
    
module.exports = { firstLoop }