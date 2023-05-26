const reader = require("../modules/filereader");
const interpreter = require("../pre-processing/interpreter")
const ratioMaker = require("../modules/ratioMaker");
const renamer = require("../modules/renamer");


/**
 * 
 * @param {string} pathToInteractionFiles 
 * @returns An array of objects. one object for each file in the path provided.
 */
function firstLoop(pathToInteractionFiles, cleanerModulePath) { 
  //Identify the list of file names to process in the folder provided to first Loop
  const fileNameList = reader.getFileNamesInFolder(pathToInteractionFiles);
  // console.log(fileNameList);
    
  //stub for output
  const output = []
  //loop over the files in the the spefified directory
  for (filename of fileNameList) {
    //read file
    const originalJsonData = reader.importJsonFile(
      pathToInteractionFiles + filename
      );
      //pre-process by cleaning up the keys.
      const cleaner = require("../"+cleanerModulePath);
      const jsonData = cleaner.correctKeys(originalJsonData);
      //todo: add try/catch to ensure there are only .json interaction files to process.

    const [ documentList, SearchList, interactionCounts ] = interpreter.extractEvents(jsonData);
    const interactionRatios = ratioMaker.countsToRatios(interactionCounts, jsonData.length)

    //append the file name so it's included with the output and spread the intereaction counts into the object too
    const totalInteraction = {
      filename: filename,
      ...renamer.renameKeysWithCount(interactionCounts),
      ...renamer.renameKeysWithRatio(interactionRatios),
      total_interaction_count: jsonData.length,
    };

    //todo: create a module that takes the documents opened and identifies the topics
    //todo: include a list of the topics explored in the output.
    //todo: create a module that calculates the overlap between a search query and the documents opened. (ideally this should look at the timing of events too)
    
    //todo: create a module that calcuates the data coverage by looking at the list of document opens and and relevant topics to determine the amount of overlap.

    //todo: create a module to reverse the query search, and identify which documents would be identified from a query string.

    //todo: create a module that takes the queries made, calculates the ratio of results returned from the total dataset - show the search Efficiency

    //todo: create a module that looks at the list of searchs, and counts the number of synonym terms.
    //todo: create a module that returns the frequency of documents being returned for each query made - calculate and return a ratio for document cycling
    //todo: create a module that looks at the list of searches and counts the number of terms with similar roots/endings

    //todo: create a module that looks at the raw events and calculates the moving average amount of activities. Identify the burstiness (maybe find some way to highlight this for a later iteration?)

    //todo: create a module that looks over the calculated metrics for all the participats. Determine how much each participant varies from their peers based on the variation in each metric.

    output.push(totalInteraction);
  }

  return output;
}
    
module.exports = { firstLoop }