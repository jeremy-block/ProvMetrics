const { correctKeys } = require("../../modules/correctKeys");
const { correctTimes } = require("../../modules/correctTimes")
const { correctTypes } = require("../../modules/correctTypes");
const { correctDocIDs } = require("../../modules/correctDocIDs");
const { extractEvents } = require("../../modules/interpreter");
// Object of expected keys and the properties typically found in the interaction file
// Key is the expected key in these scripts, Value is the proptery's name in the interaction log.
const interactionTranslation = {
  time: "video_timecode", //Time of the event - should be a number that is always increasing
  type: "action", //Event type
  doc_id: "doc_id", //Document identifier for the session
  msg: "query_str", //The search string query term
};

//todo: interaction type translation so "search" is identified.
const interactionTypes = {
  query: "search",
  expand: "open-doc",
};

// "video_timecode": "0:01:30.10",
const timeFormat = "h:mm:ss.u"

// "conversationTitle": "rmn_e098a.mp3";
const docIDFormat = ["rmn_", ".mp3"]
const beforeID = docIDFormat[0]
const afterID = docIDFormat[1]

function clean(interactions) {
  interactions = correctKeys(interactions, interactionTranslation);
  interactions = correctTimes(interactions, timeFormat)
  interactions = correctTypes(interactions, interactionTypes)
  interactions = correctDocIDs(interactions, beforeID, afterID)
  return interactions;
}
module.exports = { clean };
