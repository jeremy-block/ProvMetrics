const { normalizeNumericObjectValues } = require("./modules/objHelper")
const saveJsonToCsvFile = require("./modules/saveJsonToCsvFile")
const pass1 = require("./pre-processing/firstLoop")
const { mergeCSVFiles } = require("./modules/mergeCSVFiles")
const { replaceEmptyCellsWithZero } = require("./modules/replaceEmptyCSVCells")

const isTesting = false
let dataFolders = {}

async function run() {
  if (isTesting) {
    dataFolders = {
      testData: {
        interactions: "testData/interactions/",
        cleaner: "pre-processing/datatranslators/testData.js",
        documents: {
          datasetPath: "testData/documents/TestData-documents.json", // Path to the dataset to do reverse search.
          identifier: "id", //the identifyer for a record in the documents dataset.
          searchableDocProps: ['contents","title'], // The list of properties in the document datasets to search through when doing a reverse search.
        },
      },
    };
  } else {
    dataFolders = {
      "Arms Dealing": {
        interactions: "data/Dataset_1/User Interactions/",
        cleaner: "pre-processing/datatranslators/dataset1.js",
        documents: {
          datasetPath: "data/Dataset_1/Documents/Documents_Dataset_1.json",
          identifier: "id",
          searchableDocProps: ["contents", "title"],
        },
      },
      "Terrorist Activites": {
        interactions: "data/Dataset_2/User Interactions/",
        cleaner: "pre-processing/datatranslators/dataset1.js",
        documents: {
          datasetPath: "data/Dataset_2/Documents/Documents_Dataset_2.json",
          identifier: "id",
          searchableDocProps: ["contents", "title"],
        },
      },
      "Company Kidnapping": {
        interactions: "data/Dataset_3/User Interactions/",
        cleaner: "pre-processing/datatranslators/dataset1.js",
        documents: {
          datasetPath: "data/Dataset_3/Documents/Documents_Dataset_3.json",
          identifier: "id",
          searchableDocProps: ["contents", "title"],
        },
      },
      "Panda Jam": {
        interactions: "data/Dataset_4/JSONInteractions/",
        cleaner: "pre-processing/datatranslators/dataset4.js",
        documents: {
          datasetPath: "data/Dataset_4/Documents/Documents_Dataset_4.json",
          identifier: "conversationTitle",
          searchableDocProps: ["contents"],
        },
      },
      "Insider Attack": {
        interactions: "data/Dataset_5/interactions/",
        cleaner: "pre-processing/datatranslators/dataset5.js",
        documents: {
          datasetPath: "data/Dataset_5/documents.json",
          identifier: "name",
          searchableDocProps: ["type", "title", "body"],
        },
      },
    };
  }

  const combinedMetrics = [];
  for (datasetKey in dataFolders) {
    //loop over the interaction data in a folder.
    const interactionMetricList = await pass1.firstLoop(
      datasetKey,
      dataFolders[datasetKey].interactions,
      dataFolders[datasetKey].cleaner,
      dataFolders[datasetKey].documents
    );

    // const metrics = pass1.addDatasetKeyToList(interactionMetricList, datasetKey);
    // combinedMetrics.push(...metrics);
    combinedMetrics.push(...interactionMetricList);

    const normed = normalizeNumericObjectValues(interactionMetricList);
    //save the data as a csv file.
    saveJsonToCsvFile(datasetKey, interactionMetricList);
    saveJsonToCsvFile(datasetKey + "_norm", normed);
  }

  // Save a csv file with all the metrics included.
  const combinedMetricsNormed = normalizeNumericObjectValues(combinedMetrics)
  saveJsonToCsvFile("combinedObj", combinedMetrics)
  saveJsonToCsvFile("combined_Normed", combinedMetricsNormed)

  replaceEmptyCellsWithZero("output/combinedObj.csv", "output/fixed.csv")

//   Alternative Saving process where the completed CSVs are loaded and saved using the merge CSV module.
  const inputFiles = [];
  for (datasetKey in dataFolders) {
    inputFiles.push("output/" + datasetKey + ".csv");
  }
  const outputFileName = "combined.csv";

  mergeCSVFiles(inputFiles, outputFileName);
  replaceEmptyCellsWithZero("output/"+outputFileName, "output/datasetAll.csv")
}
run()
//todo: write a validator function set for the test data to check that all the calculations make sense... maybe. This is a low priority