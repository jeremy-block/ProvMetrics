const reader = require("../modules/filereader");
const interpreter = require("../modules/interpreter.js")
const ratioMaker = require("../modules/ratioMaker");
const renamer = require("../modules/renamer");
const searchMetrics = require("./searchMetrics");

//todo: this just calculates one vlaue for the entire interaction history for each user. It would be good to segment a user's period of time and look at how these values change at different time granularities.
/**
 * 
 * @param {string} pathToInteractionFiles 
 * @returns An array of objects. one object for each file in the path provided.
 */
async function firstLoop(pathToInteractionFiles, cleanerModulePath, pathToDocuments, debug=false) { 
  //Identify the list of file names to process in the folder provided to first Loop
  const fileNameList = reader.getFileNamesInFolder(pathToInteractionFiles);
  // console.log(fileNameList);
  const datasetDocuments = reader.importJsonFile(pathToDocuments)  
  //stub for output
  const output = []
  //loop over the files in the the spefified directory
  for (filename of fileNameList) {
          console.log(
            "🚀 ~ file: firstLoop.js:23 ~ firstLoop ~ now examining filename:",
            filename
          );

    //read file
    const originalInteractionEvents = reader.importJsonFile(
      pathToInteractionFiles + filename
      );
      //pre-process by cleaning up the keys.
      const cleaner = require("../"+cleanerModulePath);
      const interactionEvents = cleaner.correctKeys(originalInteractionEvents);
      //todo: add try/catch to ensure there are only .json interaction files to process.
      
    const [docTimeIDs, searchTimeTerms, interactionCounts] = interpreter.extractEvents(interactionEvents);
    if (debug) console.log("extracted the folowing from interaction file", docTimeIDs, searchTimeTerms, interactionCounts);
    const interactionRatios = ratioMaker.countsToRatios(interactionCounts, interactionEvents.length)
    const totalDuration = [...interactionEvents].slice(-1)[0].time;
    
    //Boolean to avoid running search functions if we do not have any searches in the file.
    let completedSearches = interactionCounts["search"] > 0;
    // Calculate search term things
    const searchTermSimilarity = (completedSearches) ? searchMetrics.calcRepeatedSearches(searchTimeTerms) : { "repeatedSeachCount": null, "repeatedSearchRatio": null };
    const searchPeriodicity = (completedSearches) ? searchMetrics.calculatePeriodicity(searchTimeTerms, totalDuration): null ;
    const searchOverlapAndEfficency = (completedSearches) ? searchMetrics.calcOverlappingSearches(searchTimeTerms, docTimeIDs, datasetDocuments) : { "avgOverlap": null, "avgEfficency": null };
    // const  = (completedSearches) ? searchMetrics.searchEffiecincy(searchTimeTerms, datasetDocuments) : null;
    const searchSimilarity2 = (completedSearches) ? await searchMetrics.getSimilarityWordsProportion(searchTimeTerms) : null;
          
    //append the file name so it's included with the output and spread the intereaction counts into the object too
    const totalInteraction = {
      filename: filename,
      ...renamer.renameKeysWithCount(interactionCounts),
      ...renamer.renameKeysWithRatio(interactionRatios),
      total_interaction_count: interactionEvents.length,
      total_duration: totalDuration,
      repeat_searches: searchTermSimilarity.repeatedSeachCount,
      prop_repeat_searches: searchTermSimilarity.repeatedSearchRatio,
      search_term_similarity: searchSimilarity2,
      search_time_std_dev: searchPeriodicity,
      search_open_overlap: searchOverlapAndEfficency.avgOverlap,
      search_term_efficiency: searchOverlapAndEfficency.avgEfficency,
    };
          
    //todo: create a module that takes the documents opened and identifies the topics
    //todo: include a list of the topics explored in the output.
    
    //todo: create a module that calcuates the data coverage by looking at the list of document opens and and relevant topics to determine the amount of overlap.
            
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