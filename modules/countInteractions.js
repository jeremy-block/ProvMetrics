//todo: calculate the number of unique documents open.

//todo: account for mistakes by also considering the interactions that happen within a specifified threshhold to account for mistakes or mis-clicks.

/**
 * 
 * @param {array of interactions} objects - the interactions to loop over and count.
 * This function assumes the interaction array has a property "type"
 * @returns object with the counts for each "type" of interaction.
 */
function countObjectsByType(objects) {
  const counts = {};

  for (const obj of objects) {
    const objectType = obj.type;

    if (counts.hasOwnProperty(objectType)) {
      counts[objectType]++;
    } else {
      counts[objectType] = 1;
    }
  }

  return counts;
};

module.exports = { countObjectsByType };