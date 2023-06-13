
const natural = require("natural");
const { WordNet } = natural;
const { importJsonFile } = require("../modules/filereader");
const { listOfObjectValues, ListOfObjectKeys } = require("../modules/objHelper");
const { spawnSyncProcess } = require("./runPythonFunction");


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
 *
 * @param {Object} termList - An object of times and terms searched for.
 * @returns a simple ratio. It removes the duplicates in the list of search terms and gives a value for how many searches were exact repeats.
 */
function ratioOfUniqueSearches(termList) {
  if (Object.keys(termList).length === 0) {
    return null;
  } else {
    const types = new Set(Object.values(termList));
    // console.log(types, types.size, termList, Object.keys(termList).length);
    const similarityScore = types.size / Object.keys(termList).length;
    return similarityScore;
  }
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


module.exports = { ratioOfUniqueSearches, getSimilarityWordsProportion, calculatePeriodicity };

async function test() {
  let finished = await getSimilarityWordsProportion({ "1": "cat", "2.3": "dog", "3.2": "lion", "4.5": "elephant" }); //{ 123: "happy", 456: "sad", 789: "test" });\
  console.log("🚀 ~ file: searchMetrics.js:288 ~ test ~ finished:", finished)
  
}
// test()















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

//     const similarityScore = synonyms.size / Object.keys(termList).length;
//     return similarityScore;
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

//     const similarityScore = synonyms.size / Object.keys(termList).length;
//     return similarityScore;
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

//     const similarityScore = synonyms.size / Object.keys(termList).length;
//     return similarityScore;
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
//     function calculateSimilarityScore(wordList) {
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
//     const similarityScore = calculateSimilarityScore(words);

//     console.log("Similarity score:", similarityScore);
//   });
// }
// const runPythonScript = require("./runPythonFunction");