//todo: Handle the reverse mapping for the translation object.

// Translation should be of the form:
// "typeNameInInteractionLog":"nameExpectedByCalculations"
//for example:
translation = {
  SearchEvent: "search",
  openEvent: "open-doc",
};
/**
 * Expects each interactions object to have a property "type" before running. 
 * 
 * @param {Array<InteractionObject>} interactions  - The list of interactions looking for modification
 * @param {Object} translation - object with Property to look for, Value to change it to
 * @param {boolean} debug - Should print debug logs or not. Default not
 * @returns Array<InteractionObject> with the type property modified by the input from the translation parameter
 */
function correctTypes(interactions, translation, debug = false) {
  // Check if interactions is an array and has a length greater than 1
  if (Array.isArray(interactions) || interactions.length >= 1) {
    // Loop over the JSON data and modify
    for (const obj of interactions) {
        // Check if the type property exists in the object and that we have a translation to convert it to.
        if (obj.hasOwnProperty("type") && translation[obj["type"]] != undefined) {
          // Update the value of the "type" property.
          obj["type"] = translation[obj["type"]];
        } else {
            if (debug) console.log(obj, 'has no property "type" to modify or we do not have a translation for', obj["type"]);
        }
    }
    return interactions;
  } else {
    if (debug)
      console.log("🚀 ~ file: testData.js ~ correctKeys ~ interactions:", interactions);
    console.error("Interactions not an array of objects");
    return interactions;
  }

}

module.exports = { correctTypes }