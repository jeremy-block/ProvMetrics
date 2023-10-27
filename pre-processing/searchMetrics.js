
const natural = require("natural");
const { WordNet } = natural;
const { importJsonFile } = require("../modules/filereader");
const { listOfObjectValues, ListOfObjectKeys } = require("../modules/objHelper");
const { spawnSyncProcess } = require("./runPythonFunction");
const { intersectLists, removeDuplicates, calcMean } = require("../modules/listHelper");


  //todo: write a function that determines the similarity of search phrases by lemetizing/stemming search terms.

async function testWordNet() {
  var wordnet = new natural.WordNet("/usr/local/Cellar/wordnet/3.1_1/dict");
  wordnet.lookup("node", function (results) {
    results.forEach(async function (result) {
      const wordID = result.synsetOffset;
      console.log("---------------lookup---------------------");
      console.log("synsetOffset:", result.synsetOffset);
      console.log("pos:", result.pos);
      console.log("lemma:", result.lemma);
      console.log("synonyms:", result.synonyms);
      console.log("gloss:", result.gloss);
      // console.log(result)
      await wordnet.get(wordID, "n", async function (result) {
        console.log("----------------get--------------------");
        console.log("pos:", result.pos);
        console.log("lemma:", result.lemma);
        console.log("synonyms:", result.synonyms);
        console.log("gloss:", result.gloss);
      });
    });
  });
 
}
// testWordNet()


/**
 * 
 * @param {Array of strings} arr List of words to be corrected
 * @param {boolean} debug Show console logs or not
 * @returns returns a list of words with corrections made to any words deemed mispelled.
 */
//todo check spelling of words before running any other search string calculations?
async function simpleSpellCheck(arr, debug = false) {
  if (debug) console.log("recieved array: ", arr);
  //Load the english word dictionary from dwyl https://github.com/dwyl/english-words
  const corpus = await importJsonFile("modules/words_alpha.json");
  //todo Maybe you can get a dictionary from wordnet since you're already loading it into this module? This static file works but wordnet may be better.
  const spellcheck = new natural.Spellcheck(corpus);
  if (debug) console.log("Spellcheck dictionary loaded");
  const correctedArr = [];
  arr.forEach((word) => {
    word = word.toLowerCase(); //dictionary is in lower case.
    if (debug) console.log("> checking: ", word);
    if (spellcheck.isCorrect(word)) {
      if (debug) console.log("> In english dictionary ✅");
      correctedArr.push(word);
    } else {
      if (debug)
        console.log(
          "> Not in english dictionary 🛑 \n  >>>>possible corrections include",
          spellcheck.getCorrections(word, 1)
        );
      correctedArr.push(spellcheck.getCorrections(word, 1)[0]);
    }
  });
  console.log("corrected array:", correctedArr);
  return correctedArr;
}
// simpleSpellCheck(["deeling","Keyna", "Princess", "pikles", "tounge"],true); //[ 'eeling', 'kenya', 'princess', 'pickles', 'lounge' ]


//todo: instead of SpaCy consider doing something simple with Latent Semantic Analysis (LSA) of the TASA corpus (This corpus was developed by Touchtone Applied Science Associates (Zeno, Ivens, Millard, & Duvvuri, 1995), and consists of a collection of texts appropriate for students between third grade and the first year of college.) 
//todo or the same analyses using the Word Association Space 

/**
 *uses SpaCy's Symilarity functions to calculate the similarity of the words in a list. I believe that SpaCy considers synonyms and semantic meaning of words. Not sure how it worries about Part of Speech tagging, if at all since these words are without context.
 *
 * @param {Array of strings} termList List of words to check
 * @param {boolean} [debug=false] set to true to display helpful debug logs
 * @return {number} a single number describing the similarity of the terms in a list. 0 no similarity, 1, complete similarity (often a low value).
 */
async function getSimilarityWordsProportion(termList, debug = false) {  
  
  if (debug){
    termList = listOfObjectValues(termList);
    console.log(termList)
    termList.unshift("_debug_")
  } else {
    termList = listOfObjectValues(termList);
  }
  if (termList.length > 0) {
    try {
      console.log('Starting Python process...');
      // score = await runPythonScript("pre-processing/similarity.py", termList)
      const output = await spawnSyncProcess(
        "python3.10",
        "pre-processing/similarity.py",
        termList
        );
        if (debug) {
          console.log('Python process finished.');
          console.log("returned search term similarity score:", parseFloat(output));
          return null
        } else {
        return parseFloat(output)
      }
    } catch (error) {
      console.error('Error executing Python process:', error);
    }
    } else {
        return null
    }
  }
        
/**
 * This function removes the duplicates in the list of search terms and gives a value for how many searches were exact repeats.
 * @param {Object} termList - An object of times and terms searched for.
 * @returns an object with two properties. repeatedSearchCount reports the number of searches that are exact matches. repeatedSearchRatio provides that value as a ratio(i.e., the proportion of earches complete that are repeated.) 
 */
function calcRepeatedSearches(termList, debug = false) {
  const types = new Set(Object.values(termList));
  if (debug) console.log(types, types.size, termList, Object.keys(termList).length);
  const similarityRatio = 1 - (types.size / Object.keys(termList).length);
  const repeatedSeachesCount = (Object.keys(termList).length - types.size);
  return {
    "repeatedSeachCount": repeatedSeachesCount,
    "repeatedSearchRatio": similarityRatio,
  };
}


//todo: Check that this function determines the burstiness of search events - It's kinda like a std. deviation function.
function calculatePeriodicity(timeIntervals, totalDuration, debug=false) {
  timeIntervals = ListOfObjectKeys(timeIntervals)
  if(debug) console.log("🚀 ~ file: searchMetrics.js:309 ~ calculatePeriodicity ~ timeIntervals:", timeIntervals)
  if (timeIntervals.length > 0) {
    const expectedInteractionPeriodicity = totalDuration / timeIntervals.length;
    if(debug) console.log(
      "\nTotal time:",
      totalDuration,
      "\nExpected searches at",
      expectedInteractionPeriodicity,
      "(s) intervals",
    );

    function accError(acc, arrayItem) {
      // console.log(acc,arrayItem)
      return {
        val:
        Math.pow(Math.abs(arrayItem - expectedInteractionPeriodicity * acc.index),2) + acc.val,
        index: acc.index + 1,
      };
    }
    const sumofSquareErrors = timeIntervals.reduce(accError, { val: 0, index: 1 }).val;
    if(debug) console.log("~ sumofSquareErrors:", sumofSquareErrors);        
    const varience = sumofSquareErrors / (timeIntervals.length - 1);
    // Step 3: Calculate the standard deviations
    const stdOccurance = Math.sqrt(varience)
    if (debug) console.log("~ varience:", varience);
    if (debug) console.log("standard deviation in occurance:", stdOccurance);
    return stdOccurance;
        // const deviations = timeIntervals.map((interval) => {
        //   Math.abs(interval - expectedInteractionPeriodicity)
        // })
        // const maxDeviation = Math.max(...deviations); //why? why not take the average distance
        
    // const periodicity = maxDeviation / expectedInteractionPeriodicity;

    // Return 0 if events are equally spaced, 1 if bunched together
    // return periodicity;
  } else {
    return null;
  }
}

//todo Calculate a value that quantifies the number of events that are outlires (1.5x standard deviations from the mean) and maybe recalculate the standar deviation without them?
/**
 * Conducts a search through the array of document objects and returns the list of document names that would be returned for a search conducted on the dataset.
 * @param {String} term The Term to look for in the original document dataset
 * @param {Object <documents, itentifyer, searchableDocProps>} documentCorpus The object containing a list of documents to search for, the id to record for matches and the properties to search through for matches.
 * @param {boolean} debug true to print logs
 * @returns a list of document IDs that would be returned for the search term.
 */
function reverseSearch(term, documents, debug = false) {
  // console.log("🚀 ~ file: searchMetrics.js:187 ~ reverseSearch ~ term:", term)
  // console.log("🚀 ~ file: searchMetrics.js:180 ~ reverseSearch ~ documents:", documents)
  const documentCorpus = documents.dataset
  const documentIdentifier = documents.identifier;
  const documentPropertiesToExamine = documents.searchableDocProps

  const matchingObjects = [];
  term = term.replace(/\\/g, "\\\\"); // replace "\" characters that sometimes appear with nothing.
  const regex = new RegExp(term, "i"); // 'i' flag for case-insensitive matching

  for (const doc of documentCorpus) {
    // Initialize a flag to track if a match is found
    let matchFound = false;

    // Loop through the properties and check for a match
    for (const prop of documentPropertiesToExamine) {
      if (doc[prop] && regex.test(doc[prop].toLowerCase())) {
        matchFound = true;
        break; // If a match is found, exit the loop
      }
    }

    // Check if a match was found
    if (matchFound) {
      const docName = doc[documentIdentifier];
      if (debug) console.log("🚀 ~ file: searchMetrics.js:201 ~ reverseSearch ~ Document titled:",docName,"\tcontains the term",term);
      matchingObjects.push(docName);
    }
  }
  if (debug && matchingObjects.length == 0) console.log("no documents contain the term ", term, "... at least not in these document properties we searched through:", documentPropertiesToExamine)
  return matchingObjects;
}

//todo Consider more than just opened documents? what about documents dragged around or hovered without opening? it would help to score different types of interactions more or less highly.
/**
 * creates a list of document names that were opened between two time values.
 * @todo inclusion criteria (including a document at start time or end time) has not been accuratly tested. It works for the general case, but may not include opened documents with a time that perfectly matches start or end time.
 * @param {number} startTime a time value to start from
 * @param {number} endTime a time value to end searching for
 * @param {object <time:docs>} documentObj an object of time keys with a document as the value. This represents the document open events.
 * @returns a list of document ids that were read between the two times.
 */
function getDocNamesBetweenTimes(startTime, endTime, documentObj) {
  times = ListOfObjectKeys(documentObj)
  startIndex = 0
  endIndex = 0
  outputNames = []
  for (let index = 0; index < times.length; index++) {
    const checkTime = times[index];
    if (checkTime > endTime) {
      endIndex = index
    }
    if (checkTime < startTime) {
      startIndex = index
    }
  }
  for (let getter = startIndex; getter < endIndex; getter++) {
    const name = documentObj[times[getter]];
    outputNames.push(name)
  }
  return outputNames
}

//todo Only calculate an overlap for searches that return a value. If the search returns no documents. it shouldn't count, right?
//todo: create a module that calculates the overlap between a search query and all the documents opened accross the whole time. It would calculate over the whole time how much overlap there is instead of just between now and the next search. (ideally this should have a multiplier for the relative timing of events too)
/**
 * 
 * @param {object <time:search>} searchObj object of searches with the timings of those searches as the keys
 * @param {object <time:docs>} documentObj object of document names with the timings of when those documents were opened as keys
 * @param {Array of object <documents>} documents object that contains the specificed properties for reverse search function. object contains the following properties: documentCorpus, documentIdentifier, and documentPropertiesToExamine
 * @param {boolean} debug flag to control the display of debug messages
 * @returns an object with two properties. avgOverlap is the average amount of overlap between a search being run and the number of documents explored. avgEfficency is the average number of documents returned for a search.
 */
function calcOverlappingSearches(searchObj, documentObj, documents, debug = false) {
  const times = ListOfObjectKeys(searchObj);
  if(debug) console.log("🚀 ~ file: searchMetrics.js ~ calcOverlappingSearches ~ times: Total Searches Complete", times.length)
  const docTimes = ListOfObjectKeys(documentObj)
  //Handle the case where more documents are opened after the last search. Push the longest time to the times array
  if (times[times.length - 1] < docTimes[docTimes.length - 1]) {
    if (debug) console.log("Documents open after last search time. Adding",docTimes[docTimes.length-1], "to the times array")
    times.push(docTimes[docTimes.length - 1]);
  }
  //List of how much overlap each term has with the documents explored before the next search.
  let overlapAmount = []
  
  //list of how many results are returned for each search completed.
  let searchEfficiency = []

  //for each search term.
  for (let t = 0; t < times.length - 1; t++) {
    const startTime = times[t];
    const endTime = times[t + 1]; 
    
    //list of documents opened between two times. 
    //then remove duplicate document names to be fair to the search counts.
    const docNameList = removeDuplicates(
      getDocNamesBetweenTimes(
      startTime,
      endTime,
      documentObj
    ));
    if (debug) console.log("🚀 ~ file: searchMetrics.js ~ calcOverlappingSearches ~ docNameList:", docNameList.length,"documents open between", startTime, "and", endTime, "Include the following:", docNameList)
    
    //Get the search term conducted in this time period
    const term = searchObj[times[t]];
    if (debug) console.log("🚀 ~ file: searchMetrics.js ~ calcOverlappingSearches ~ term searched for:", term)
    
    //Reverse the search and get a list of document names associated with the search term.
    const searchResults = reverseSearch(term, documents);
    if(debug) console.log("🚀 ~ file: searchMetrics.js ~ calcOverlappingSearches ~ searchResults:",searchResults.length,"Documents match a search for",("\'"+term+"\'."),"They are", searchResults)

    //compare the two lists of document ids
    const overlap = intersectLists(searchResults, docNameList);
    if (debug) console.log("🚀 ~ file: searchMetrics.js ~ calcOverlappingSearches ~ overlap: \n\tDocuments Matching Search Term:", searchResults.length,"\n\tDocuments opened before next search:", docNameList.length, "\n\tTherefore Overlap is:",overlap);
    //record the overlap for the term.
    overlapAmount.push(overlap);
    searchEfficiency.push(searchResults.length)
  }
  //return the average amount of overlap among the search performed and the documents explored.
  return {
    "avgOverlap": calcMean(overlapAmount),
    "avgEfficency": calcMean(searchEfficiency)
  };
}



module.exports = {
  calcRepeatedSearches,
  getSimilarityWordsProportion,
  calculatePeriodicity,
  reverseSearch,
  calcOverlappingSearches,
};

async function test() {
  let finished = await getSimilarityWordsProportion({ "1": "cat", "2.3": "dog", "3.2": "lion", "4.5": "elephant" }); //{ 123: "happy", 456: "sad", 789: "test" });\
  console.log("🚀 ~ file: searchMetrics.js:288 ~ test ~ finished:", finished)
}
// test()

// async function testReverseSearch() {
//   const searches = { "1": "telephone", "2.3": "bank", "3.2": "Bank", "4.5": "Pay" }
//   const docs = [
//     {
//       id: "armsdealing1",
//       date: "Feb 2008",
//       title: "drilling equipment scheduled to arrive, Kiev to Iran",
//       contents:
//         "US GOVERNMENT TELEPHONE INTERCEPT: 5 FEBRUARY 2008<br><br>Call placed from Kiev, Ukraine to Tabriz, Iran.  <br><br> The call from Kiev was from a prepaid cell phone using an unlisted ID number supplied by an Internet café.  The receiver of the call was at the address: 24 Janbazan St, West Ajerbaijan, Tabriz, Iran.  This address is the residence of Sattari Khurshid. The caller says, “The drilling equipment is scheduled to arrive at Urmia on the 12th.”  The receiver says, “All is well then.  Soltan will handle all the arrangements.”  ",
//     },
//     {
//       id: "armsdealing2",
//       date: "Mar 2008",
//       title: "Maulana Haq Bukhari Bank Transaction",
//       contents:
//         "REPORT DATE:    30 March 2008 [US GOVERNMENT COMMUNICATION INTERCEPT]: <br><br>[Note: The originating account is believed to belong to Maulana Haq Bukhari, per Pakistani Criminal Investigation Unit, Karachi Division]<br><br>Bank funds transfer information:<br><br>Transaction Identification Number:<br>From:  \t\tEBILAEAD 51 0568 8001 1575 1710 0<br>To:\t\t\tABNAPKKACKH 4230-1840-001194396527<br>Date:    \t\t02-11-08 11:29:16<br>Amount:\t\tPAK1571649.15",
//     },
//     {
//       id: "armsdealing3",
//       date: "June 2008",
//       title: "I hope we can do business shortly, Borodinski",
//       contents:
//         "US GOVERNMENT TELEPHONE INTERCEPT: 24 JUNE 2008<br><br>A phone call was intercepted from a pay phone at the Domodedovo International Airport to a street phone in Nonthaburi on June 24, 2008. <br><br> The call on June 24, 2008 was from Arkadi Borodinski to Boonmee Khemkhaeng or Suramongkol Virote.  The caller says [in English with a Russian accent]: “I am encouraged by what I hear from my sources about you.”  The receiver replies [also in English]: “I hope we can do business shortly.” ",
//     }];
//   const searchResults = []
//   for (const time in searches) {
//     if (Object.hasOwnProperty.call(searches, time)) {
//       const term = searches[time];
//       searchResults.push(reverseSearch(term, docs))
//     } else {
//       console.log("no term")
//     }
//   }
// console.log("🚀 ~ file: searchMetrics.js:233 ~ testReverseSearch ~ searchResults:", searchResults)
// }
// testReverseSearch()



// const nltk = require("nltk");
// nltk.download("wordnet");


// function synonymSimilarity(termList) {
//   try {
//     if (Object.keys(termList).length === 0) {
//       throw new Error("termList is empty");
//     }

//     const synonyms = new Set();
//     for (const term of Object.values(termList)) {
//       const termSynonyms = nltk.corpus.wordnet.synsets(term);
//       for (const synset of termSynonyms) {
//         const lemmaNames = synset.lemma_names();
//         synonyms.add(...lemmaNames);
//       }
//     }

//     const similarityRatio = synonyms.size / Object.keys(termList).length;
//     return similarityRatio;
//   } catch (error) {
//     console.error(error);
//     return 0;
//   }
// }
// const wordnet = new WordNet();

// function synonymSimilarity(termList) {
//   try {
//       if (Object.keys(termList).length === 0) {
//           return 0;
//     //   throw new Error("termList is empty");
//     }

//     const synonyms = new Set();
//       for (const term of Object.values(termList)) {
//       console.log("🚀 ~ file: searchMetrics.js:38 ~ synonymSimilarity ~ term:", term)
//       const termSynonyms = wordnet.getSynonyms(term);
//       for (const synset of termSynonyms) {
//         const lemmaNames = synset.synonyms();
//         synonyms.add(...lemmaNames);
//       }
//     }

//     const similarityRatio = synonyms.size / Object.keys(termList).length;
//     return similarityRatio;
//   } catch (error) {
//     console.error(error);
//     return 0;
//   }
// }

// const wordnet = require("wordnet-db");

// async function synonymSimilarity(termList) {
//   try {
//     if (Object.keys(termList).length === 0) {
//       throw new Error("termList is empty");
//     }

//     const synonyms = new Set();
//     for (const term of Object.values(termList)) {
//       const termSynonyms = await wordnet.lookup(term);
//       for (const synset of termSynonyms) {
//         const lemmaNames = synset.synonyms;
//         synonyms.add(...lemmaNames);
//       }
//     }

//     const similarityRatio = synonyms.size / Object.keys(termList).length;
//     return similarityRatio;
//   } catch (error) {
//     console.error(error);
//     return 0;
//   }
// }

// var lemmatize = require("wink-lemmatizer"); //todo update to a lemmatizer like NLTK or SpaCy. or use wink: npm install wink-lemmatizer
// const thesaurus = require("word-thesaurus"); //todo you may need to reinstall this.
// function synonymSimilarity(termList) {
//   const originalSearchCount = Object.values(termList).length;
//   const lemmaTerms = Object.values(termList).map(lemmatize.noun);
//   //todo remove spaces for each search term
//   const lowerTerms = lemmaTerms.map((term) => term.toLowerCase());
//     const dedupList = new Set(Object.values(lowerTerms));
//     // console.log("🚀 ~ file: searchMetrics.js:90 ~ synonymSimilarity ~ dedupList:", dedupList)
//     const synonyms = []
//     for (const term of dedupList) {
//         let newterms = thesaurus.find(term);
//         let synonymList = newterms.map(res => {
//             return res["raw"]
//         })       
//       synonyms.push(synonymList);
//     }
    
//     //todo divide the lists for duplicates.
//     const reducedList = []
//     for (const item of dedupList) {
//         if (!reducedList.contains(item)) {
//             reducedList.push(item)
//             continue
//         } else if (synonyms.contains(item)) {
//             reducedList.pop()
//         }
        
//         console.log("🚀 ~ file: searchMetrics.js:100 ~ synonymSimilarity ~ reducedList:", reducedList)
//     }
//     return reducedList.length/originalSearchCount
//     // console.log("🚀 ~ file: searchMetrics.js:94 ~ synonymSimilarity ~ synonyms:", synonyms)
// }
// const wordnet = require("wordnet");
// const { listOfObjectValues } = require("../modules/objHelper");

//  function getUniqueWasyncordsProportion(wordList) {
//   wordList = listOfObjectValues(wordList)
//   console.log("🚀 ~ file: searchMetrics.js:120 ~ getUniqueWordsProportion ~ wordList:", wordList)
//   const uniqueWords = new Set();

//   for (const word of wordList) {
//     const synsets = await new Promise((resolve, reject) => {
//       wordnet.lookup(word, (err, definitions) => {
//         try {
//           if (err) {
//             resolve(["typo"]);
//           } else {
//             const synsets = definitions
//               .map((def) => def.synonyms.map((syn) => syn.replace(/_/g, " ")))
//               .flat();
//             resolve(synsets);
//           }
//         } catch { console.log("error found ")}
//       });
//     });

//     synsets.forEach((synonym) => uniqueWords.add(synonym));
//   }
//   const proportion = uniqueWords.size / wordList.length;
//   return proportion;
// }




// const wordnet = require("wordnet");
// const { listOfObjectValues } = require("../modules/objHelper");

// async function getUniqueWordsProportion(wordObj) {
// await wordnet.init();
//   words = listOfObjectValues(wordObj); //todo set this up in the controller instead of being in this smaller funciton. other modules will probably use wordnet too.
//   // let list = await wordnet.list(); //check that wordnet is loaded
//   // console.log("🚀 ~ file: searchMetrics.js:153 ~ getUniqueWordsProportion ~ list:", list)

//   console.log("🚀 ~ file: searchMetrics.js:150 ~ getUniqueWordsProportion ~ words:", words)
//   const synonymsPromises = words.map(
//     (word) => {
//       const findDef = new Promise((resolve, reject) => {
//         wordnet.lookup(word).then(
//           (definitions) => {
//             definitions.forEach((def) => {
//               console.log(def.meta.words)
//               // console.log(`type: ${def.meta.synsetType}`)
//               // console.log(`${def.glossary}\n`);
//             })
//             // console.log("🚀 ~ file: searchMetrics.js:166 ~ definitions.forEach ~ definitions:", definitions)
//             const synonyms = definitions.flatMap(
//               (definition) => definition.synonyms
//             );
//             resolve(synonyms);
//           })
//           .catch((e) => {
//             // console.log(e);
//             reject(word)
//           })
//         })
//         findDef.catch((error) => {
//           // console.log("🚀 ~ file: searchMetrics.js:172 ~ getUniqueWordsProportion ~ error:", error)   
//         })
//       }
//   )
//   try {
//     const synonymsResults = await Promise.all(synonymsPromises);
//     const allSynonyms = [].concat(...synonymsResults);
//     console.log("🚀 ~ file: searchMetrics.js:183 ~ getUniqueWordsProportion ~ allSynonyms:", allSynonyms)

//     const uniqueWords = [...new Set([...words, ...allSynonyms])];
//     console.log("🚀 ~ file: searchMetrics.js:186 ~ getUniqueWordsProportion ~ uniqueWords:", uniqueWords)
//     const uniqueWordProportion = uniqueWords.length / words.length;

//     return uniqueWordProportion;
//   } catch (error) {
//     throw error;
//   }
// }

//This NPM module has not been updated in 5 years and is non fucntional. I will need to spawn a python subprocess to access spacy similarity functions.
// const spacy = require("spacy");
// async function getSimilarityWordsProportion(words) {
//   // Load the 'en_core_web_lg' model
//   spacy.load("en_core_web_lg").then((nlp) => {
//     // Function to calculate similarity between two words
//     function calculateWordSimilarity(word1, word2) {
//       const doc1 = nlp(word1);
//       const doc2 = nlp(word2);

//       // Calculate similarity using word embeddings
//       const similarity = doc1.similarity(doc2);

//       return similarity;
//     }

//     // Function to calculate overall similarity score for a list of words
//     function calculateSimilarityRatio(wordList) {
//       const numWords = wordList.length;

//       // Handle edge case when there's only one word in the list
//       if (numWords <= 1) {
//         return 1; // Return 1 since there's only one word
//       }

//       let totalSimilarity = 0;

//       // Iterate through all word combinations and calculate their similarity
//       for (let i = 0; i < numWords - 1; i++) {
//         for (let j = i + 1; j < numWords; j++) {
//           const similarity = calculateWordSimilarity(wordList[i], wordList[j]);
//           totalSimilarity += similarity;
//         }
//       }

//       // Calculate the average similarity score
//       const averageSimilarity =
//         totalSimilarity / ((numWords * (numWords - 1)) / 2);

//       return averageSimilarity;
//     }

//     // Example usage
//     const similarityRatio = calculateSimilarityRatio(words);

//     console.log("Similarity score:", similarityRatio);
//   });
// }
// const runPythonScript = require("./runPythonFunction");



// //untested - for each search completed, how many of the documents touched before the next search related to the search itself.
// function calcOverlappingSearches(
//   searchObj,
//   interactions,
//   documents,
//   interactionTypes = ["reading", "open"],
//   debug = false
// ) {
//   times = ListOfObjectKeys(searchObj);
//   times.append(interactions[interactions.length - 1].time);
//   console.log(
//     "🚀 ~ file: searchMetrics.js:210 ~ calcOverlappingSearches ~ times:",
//     times
//   );
//   const overlap = 0;
//   //For each search time,
//   for (let t = 0; t < times.length - 1; t++) {
//     const startTime = times[t];
//     const endTime = times[t + 1];
//     const docNameList = getDocNamesBetweenTimes(
//       startTime,
//       endTime,
//       documents,
//       interactionTypes
//     );
//     const term = searchObj[times[t]];
//     //todo spell check terms (simpleSpellCheck())
//     searchResults = reverseSearch(term, documents);

//     //compare the two lists of document ids
//     const overlap = intersectLists(searchResults, docNameList);
//     overlapAmount = overlapAmount + overlap / (times.length - 1); //Add a propostional equivlant amount of overlap to be added.
//   }
//   return overlapAmount;
// }