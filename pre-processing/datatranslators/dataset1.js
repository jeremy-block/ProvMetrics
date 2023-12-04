const { correctKeys } = require("../../modules/correctKeys");
const { correctTypes } = require("../../modules/correctTypes");
const { extractEvents } = require("../../modules/interpreter");
const { appendSearchResults } = require("../../modules/correctSearchResults");
// const { createSearchResultEvents } = require("../searchMetrics")
// Object of expected keys and the properties typically found in the interaction file
// Key is the new key, Value is the proptery in interaction log.
const interactionTranslation = {
  time: "time", //Time of the event - should be a number that is always increasing
  type: "interactionType", //Event type
  doc_id: "id", //Document identifier for the session
  msg: "text", //The search string query term
};

//todo: interaction type translation so "search" is identified.
const interactionTypes = {
  Search: "search",
  Doc_open: "open-doc",
};

//todo, this is just for dataset1, we'll need to make similar duplicated for dataset2 and dataset3
const documents = {
  datasetPath: "data/Dataset_1/Documents/Documents_Dataset_1.json",
  identifier: "id",
  searchableDocProps: ["contents", "title"],
}

function clean(interactions) {
  interactions = correctKeys(interactions, interactionTranslation);
  interactions = correctTypes(interactions, interactionTypes)
  interactions = appendSearchResults(interactions, documents);
  return interactions;
}
module.exports = { clean };
