/**
 * 
 * @param {array of objects} jsonData 
 * @param {string} keyToChange - the name of the property in the file
 * @param {string} newKey - this is the new name for that property.
 * @returns 
 */
function correctKeys(jsonData, keyToChange = "interactionType", newKey = "type") {
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
  
module.exports = {
correctKeys
};