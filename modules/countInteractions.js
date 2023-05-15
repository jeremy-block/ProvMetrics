/**
 * 
 * @param {object} obj - rename the data keys so they are more descriptive.
 * @returns retuns the same object with a modified key for each property. now it will be "total_"+key+"_count".
 */
function renameKeysWithCount(obj) {
  const renamedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const convertToUnderscoreLowercase = (str) => str.replace(/ /g, "_").toLowerCase();
      const newKey = "total_" + convertToUnderscoreLowercase(key) + "_count";
      renamedObj[newKey] = obj[key];
    }
  }

  return renamedObj;
}

//todo: calculate the number of unique documents open.

//todo: account for mistakes by also considering the interactions that happen within a specifified threshhold to account for mistakes or mis-clicks.

/**
 * 
 * @param {array of interactions} objects - the interactions to loop over and count.
 * This function assumes the interaction array has a property "type"
 * @returns object with the counts for each "type" of interaction.
 */
module.exports = function countObjectsByType(objects) {
  const counts = {};

  for (const obj of objects) {
    const objectType = obj.type;

    if (counts.hasOwnProperty(objectType)) {
      counts[objectType]++;
    } else {
      counts[objectType] = 1;
    }
  }
  const renamedData = renameKeysWithCount(counts);

  return renamedData;
};
