const { correctKeys } = require("../../modules/correctKeys");
// Object of expected keys and the properties typically found in the interaction file
// Key is the new key, Value is the proptery in interaction log.
const interactionTranslation = {
  time: "timestamp", //Time of the event - should be a number that is always increasing
  type: "type", //Event type
  doc_id: "doc_id", //Document identifier for the session
  msg: "msg", //The search string query term
};

function clean(interactions) {
  interactions = correctKeys(interactions, interactionTranslation)
  return interactions
}
module.exports = { clean }