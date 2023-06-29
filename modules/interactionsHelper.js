//todo: calculate the number of unique documents open.

//todo a function to provide list of objects and type name and recieve an object with time:id for when and what was interacted with.

//todo: account for mistakes by also considering the interactions that happen within a specifified threshhold to account for mistakes or mis-clicks.

/**
 * 
 * @param {array of interactions} objects - the interactions to loop over and count.
 * This function assumes the interaction array has a property "type"
 * @returns object with the counts for each "type" of interaction.
 */
function countObjectsByType(objects) {
  const counts = {};
  // Check if objects is an array and has a length greater than 1
  if (!Array.isArray(objects) || objects.length <= 1) {
    // Create a new object based on objects
    const newObj = { ...objects };

    return newObj;
  } else {

    for (const obj of objects) {
      const objectType = obj.type;
      
      if (counts.hasOwnProperty(objectType)) {
        counts[objectType]++;
      } else {
        counts[objectType] = 1;
      }
    }
    
    return counts;
  }
};

module.exports = { countObjectsByType };