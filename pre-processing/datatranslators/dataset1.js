/**
 * 
 * @param {array of objects} jsonData 
 * @param {string} keyToChange - the name of the property in the file
 * @param {string} newKey - this is the new name for that property.
 * @returns 
 */
function correctKeys(jsonData, keyToChange = "interactionType", newKey = "type") {
  // Check if jsonData is an array and has a length greater than 1
  if (!Array.isArray(jsonData) || jsonData.length <= 1) {
    // Create a new object based on jsonData
    const newObj = { ...jsonData };

    // Check if the key exists in the object
    if (newObj.hasOwnProperty(keyToChange)) {
      // Create a new key with the updated name
      newObj[newKey] = newObj[keyToChange];

      // Delete the old key
      delete newObj[keyToChange];
    }

    return newObj;
  }
    
  // Loop over the JSON data
  for (const obj of jsonData) {
    // Check if the key exists in the object
    if (obj.hasOwnProperty(keyToChange)) {
      // Create a new key with the updated name
      obj[newKey] = obj[keyToChange];

      // Delete the old key
      delete obj[keyToChange];
    }
  }
  return jsonData;
}  
  
//todo: Write a thresholding function that removes/reduces events that are too close together to be meaningful.
//todo: find some way to prioritize which event types are kept.

module.exports = {
correctKeys
};