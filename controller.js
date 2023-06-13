const saveJsonToCsvFile = require("./modules/saveJsonToCsvFile")
const pass1 = require("./pre-processing/firstLoop")

const isTesting = true
let dataFolders = {}

async function run() {
    if (isTesting) {
        dataFolders = {
            testData: {
                interactions: "testData/interactions/",
                cleaner: "pre-processing/datatranslators/testData.js",
                documents: "testData/documents/TestData-documents.json",
            }
        }
    } else {
        dataFolders = {
            dataset1: {
                interactions: "data/Dataset_1/User Interactions/",
                cleaner: "pre-processing/datatranslators/dataset1.js",
                documents: "data/Dataset_1/Documents/Documents_Dataset_1.json",
            },
            dataset2: {
                interactions: "data/Dataset_2/User Interactions/",
                cleaner: "pre-processing/datatranslators/dataset1.js",
                documents: "data/Dataset_2/Documents/Documents_Dataset_2.json",
            },
            dataset3: {
                interactions: "data/Dataset_3/User Interactions/",
                cleaner: "pre-processing/datatranslators/dataset1.js",
                documents: "data/Dataset_3/Documents/Documents_Dataset_3.json",
            },
        };
    }

    for (datasetKey in dataFolders) {
        //loop over the interaction data in a folder.
        interactionData = await pass1.firstLoop(
            dataFolders[datasetKey].interactions,
            dataFolders[datasetKey].cleaner
        );
    
        //save the data as a csv file.
        saveJsonToCsvFile(datasetKey, interactionData);
    }

}
run()
//todo: write a validator function set for the test data to check that all the calculations make sense... maybe. This is a low priority