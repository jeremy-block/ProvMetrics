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
async function firstLoop(datasetKey, pathToInteractionFiles, cleanerModulePath, documents, debug=false) { 
  //Identify the list of file names to process in the folder provided to first Loop
  const fileNameList = reader.getFileNamesInFolder(pathToInteractionFiles);
  // console.log(fileNameList);
  const datasetDocuments = reader.importJsonFile(documents.datasetPath) 
  documents.dataset = datasetDocuments
  //stub for segments of interactions
  const segmentOutputs = []
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
    const cleaner = require("../" + cleanerModulePath);
    const interactionEvents = cleaner.clean(originalInteractionEvents);
    if (debug) console.log("🚀 ~ file: firstLoop.js:34 ~ firstLoop ~ interactionEvents:", interactionEvents)
    //todo: add try/catch to ensure there are only .json interaction files to process.

    const splitInto = 11
    const segmentsOfInteractions = splitToSegments(interactionEvents, splitInto)
    // console.log(
    //   "🚀 ~ file: firstLoop.js:42 ~ firstLoop ~ segmentsOfInteractions:",
    //   segmentsOfInteractions[0].length,
    //   segmentsOfInteractions[1].length,
    //   segmentsOfInteractions[2].length,
    //   segmentsOfInteractions[3].length,
    //   segmentsOfInteractions[4].length,
    //   segmentsOfInteractions[5].length,
    //   segmentsOfInteractions[6].length,
    //   segmentsOfInteractions[7].length,
    //   segmentsOfInteractions[8].length,
    //   segmentsOfInteractions[9].length,
    //   segmentsOfInteractions[10].length
    // );
    for (let index = 0; index < segmentsOfInteractions.length; index++) {
      const segmentCalculations = await calculateMetricsForInteractions(
        segmentsOfInteractions[index]
      );
      segmentOutputs.push({ time: index, ...segmentCalculations });
    }
    const totalInteraction = await calculateMetricsForInteractions(interactionEvents)
    output.push(totalInteraction);
  }
  return [output,segmentOutputs];
}

/**
 * Function to split a list of interactions into an array of lists of interactions based on how many segments are requested.
 * @param {Array<interactionObjects>} allInteractions Array of InteractionObjects with property "time"
 * @param {number} howMany Number of segments to break allInteractions into
 * @returns A list of interaction lists where each index contains a subset of all the interactions. Segments have roughly equal time durations.
 */
function splitToSegments(allInteractions, howMany, debug = false) {
  if (howMany <= 0) {
    throw new Error("Number of segments should be greater than 0.");
  }

  // Sort interactions based on time
  const sortedInteractions = [...allInteractions].sort((a, b) => a.time - b.time);

  // Calculate total duration
  const totalDuration = sortedInteractions.slice(-1)[0].time;
  if(debug) console.log("🚀 ~ file: firstLoop.js:77 ~ splitToSegments ~ sortedInteractions:", sortedInteractions.length)

  // Calculate the target duration for each segment
  const targetSegmentDuration = totalDuration / howMany + 1; //Add one just in case you have odd integer division where a value is not easy to divide evenly.
  if(debug) console.log("🚀 ~ file: firstLoop.js:88 ~ splitToSegments ~ totalDuration:", totalDuration)

  let currentSegmentIndex = 0;
  let currentSegmentEnd = targetSegmentDuration;

  const segments = Array.from({ length: howMany }, () => []);

  sortedInteractions.forEach((interaction) => {
    // Check if adding the interaction to the current segment exceeds the target duration
    if (interaction.time <= currentSegmentEnd) {
      // Add the interaction to the current segment
      segments[currentSegmentIndex].push(interaction);
      
    } else {
      if(debug) console.log("~ file: firstLoop.js:105 - transitioning based on interaction.time:", interaction.time, "current Limit:", currentSegmentEnd, "target:", targetSegmentDuration)
      if(debug) console.log("🚀 ~ file: firstLoop.js:108 ~ sortedInteractions.forEach ~ currentSegmentIndex:", currentSegmentIndex)
      // Move to the next segment
      currentSegmentIndex++;
      currentSegmentEnd =
      targetSegmentDuration + targetSegmentDuration * currentSegmentIndex;
      segments[currentSegmentIndex].push(interaction);
    }
  });

  return segments;
}

/**
 * Just isolating the metric calculations for each period of time.
 * @param {Array<intactionEvents>} interactionEvents The list of interaction events for a user.
 * @returns an object of all the metric calculations for the set of interactions.
 */
async function calculateMetricsForInteractions(interactionEvents, debug = false) {
  const [docTimeIDs, searchTimeTerms, interactionCounts] = interpreter.extractEvents(interactionEvents);
    if (debug) console.log("extracted the folowing from interaction file", docTimeIDs, searchTimeTerms, interactionCounts);
    const interactionRatios = ratioMaker.countsToRatios(interactionCounts, interactionEvents.length)
    const totalDuration = [...interactionEvents].slice(-1)[0]?.time;
    
    //Boolean to avoid running search functions if we do not have any searches in the file.
    let completedSearches = interactionCounts["search"] > 0;
    // Calculate search term things
    const searchTermSimilarity = (completedSearches) ? searchMetrics.calcRepeatedSearches(searchTimeTerms) : { "repeatedSeachCount": null, "repeatedSearchRatio": null };
    const searchPeriodicity = (completedSearches) ? searchMetrics.calculatePeriodicity(searchTimeTerms, totalDuration): null ;
    // const searchOverlapAndEfficency = (completedSearches) ? searchMetrics.calcOverlappingSearches(searchTimeTerms, docTimeIDs, documents) : { "avgOverlap": null, "avgEfficency": null }; //removed for testing
    // const  = (completedSearches) ? searchMetrics.searchEffiecincy(searchTimeTerms, datasetDocuments) : null;
    // const searchSimilarity2 = (completedSearches) ? await searchMetrics.getSimilarityWordsProportion(searchTimeTerms) : null; //removed for testing
          
    //append the file name so it's included with the output and spread the intereaction counts into the object too
    const totalInteraction = {
      session: filename,
      section: datasetKey,
      ...renamer.renameKeysWithCount(interactionCounts),
      ...renamer.renameKeysWithRatio(interactionRatios),
      total_interaction_count: interactionEvents.length,
      total_duration: totalDuration,
      repeat_searches: searchTermSimilarity.repeatedSeachCount,
      prop_repeat_searches: searchTermSimilarity.repeatedSearchRatio,
      // search_term_similarity: searchSimilarity2, //removed for testing
      search_time_std_dev: searchPeriodicity,
      // search_open_overlap: searchOverlapAndEfficency.avgOverlap, //removed for testing
      // search_term_efficiency: searchOverlapAndEfficency.avgEfficency, //removed for testing
    };
          
    //todo: create a module that takes the documents opened and identifies the topics
    //todo: include a list of the topics explored in the output.
    
    //todo: create a module that calcuates the data coverage by looking at the list of document opens and and relevant topics to determine the amount of overlap.
            
    //todo: create a module that looks at the list of searchs, and counts the number of synonym terms.
    //todo: create a module that returns the frequency of documents being returned for each query made - calculate and return a ratio for document cycling
    //todo: create a module that looks at the list of searches and counts the number of terms with similar roots/endings
    
    //todo: create a module that looks at the raw events and calculates the moving average amount of activities. Identify the burstiness (maybe find some way to highlight this for a later iteration?)
    
    //todo: create a module that looks over the calculated metrics for all the participats. Determine how much each participant varies from their peers based on the variation in each metric.
    return totalInteraction
}

/**
 *Takes a list of interactions metrics and adds a property called "dataset" to each file's metrics to aid in sorting and filtering data.
 *
 * @param {*} interactions List of interactionMetric objects
 * @param {*} key The value for the "dataset" property
 * @return {*} A modified list of interactionMetic objects with the new property.
 */
function addDatasetKeyToList(interactions, key) {
  const updated = [];
  for (interaction in interactions) {
    updated.push({
      ...interactions[interaction],
      section: key,
    });
  }
  return updated;
}

module.exports = { firstLoop, addDatasetKeyToList };