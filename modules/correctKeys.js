const { listOfObjectValues, ListOfObjectKeys } = require("./objHelper");

/**
 * 
 * @param {Array <InteractionObject>} jsonData - The array of interaction objects
 * @param {object} translation - The object of keys to convert. Object Key is the new key, Object Value is the proptery in interaction log.
 * @param {boolean} debug - Show debug messages or not. Default false.
 * @returns an array of interaction objects with translated keys.
 */
function correctKeys(jsonData, translation, debug = false) {
  
  // Check if jsonData is an array and has a length greater than 1
  if (Array.isArray(jsonData) || jsonData.length >= 1) {
    // Extract translation values from interaction translation object
    const keysToLookFor = listOfObjectValues(translation);
    const keysToChangeTo = ListOfObjectKeys(translation);
    
    // Loop over the JSON data and modify
    for (const obj of jsonData) {
      // Loop over the key translation object
      for (let key = 0; key < keysToLookFor.length; key++) {
        // Check if the key exists in the object and that the keys are not the same value
        if (obj.hasOwnProperty(keysToLookFor[key]) && keysToChangeTo[key] != keysToLookFor[key]) {
          // Create a new key with the updated name
          obj[keysToChangeTo[key]] = obj[keysToLookFor[key]];
          if(debug) console.log("🚀 ~ file: testData.js:35 ~ correctKeys ~ Converting:", keysToLookFor[key], "with value:", obj[keysToChangeTo[key]], "to: \"",keysToChangeTo[key],"\"")
          // Delete the old key
          delete obj[keysToLookFor[key]];
        }
      }
    }
    return jsonData;
  } else {
    if(debug) console.log("🚀 ~ file: testData.js ~ correctKeys ~ jsonData:", jsonData)
    console.error("Interactions not an array of objects");
    return jsonData;
  }
}
  
//todo: Write a thresholding function that removes/reduces events that are too temporally close together to be meaningful.
//todo: find some way to prioritize which event types are kept.

module.exports = {
correctKeys
};