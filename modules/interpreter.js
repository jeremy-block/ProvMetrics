

//todo: calculate the number of unique documents open.

//todo: account for mistakes by also considering the interactions that happen within a specifified threshhold to account for mistakes or mis-clicks. Maybe you can use the fuzzy match in the listHelper.js file?

/**
 * 
 * @param {array of interactions} objects - the interactions to loop over and count.
 * This function assumes the interaction array has a property "type", "timestamp", "msg", and "doc_id"
 * @returns object with the counts for each "type" of interaction, an object of touples: {time: search term}, and an object of touples {time:document id}.
 */
function extractEvents(objects) {
  const counts = {};
  const searches = {};
  const opens = {};
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

      if (objectType == "search") {
        // console.log(obj)
        searches[obj.time] = obj.msg
        // console.log(searches)
      }
      
      if (objectType == "open-doc") {
        opens[obj.time] = obj.doc_id;
      }
    }
    
    // console.log(opens, searches, counts)
    return [ opens, searches, counts ];
  }
};

module.exports = { extractEvents };
