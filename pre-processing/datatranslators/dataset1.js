const { correctKeys } = require("../../modules/correctKeys");
const { correctTypes } = require("../../modules/correctTypes");
// Object of expected keys and the properties typically found in the interaction file
// Key is the new key, Value is the proptery in interaction log.
const interactionTranslation = {
  time: "time", //Time of the event - should be a number that is always increasing
  type: "interactionType", //Event type
  doc_id: "id", //Document identifier for the session
  msg: "text", //The search string query term
};

//todo: interaction type translation so "search" is identified.
const interactionTypes = {}

function clean(interactions) {
  interactions = correctKeys(interactions, interactionTranslation);
  interactions = correctTypes(interactions, interactionTypes)
  return interactions;
}
module.exports = { clean };
