const { correctKeys } = require("../../modules/correctKeys");
const { correctStartTime } = require("../../modules/correctTimes");
const { correctTypes } = require("../../modules/correctTypes");

// Object of expected keys and the properties typically found in the interaction file
// Key is the expected key in these scripts, Value is the proptery's name in the interaction log.
const interactionTranslation = {
  time: "Timestamp", //Time of the event - should be a number that is always increasing
  type: "Event Type", //Event type
  doc_id: "Document Name", //Document identifier for the session
  msg: "Query String", //The search string query term
};

//todo: interaction type translation so "search" is identified.
const interactionTypes = {
  search: "search",
  read: "open-doc",
};

function clean(interactions) {
  interactions = correctKeys(interactions, interactionTranslation);
  interactions = correctStartTime(interactions)
  interactions = correctTypes(interactions, interactionTypes)
  return interactions;
}
module.exports = { clean };
