const convertToUnderscoreLowercase = (str) =>  str.replace(/ /g, "_").toLowerCase();

/**
 *
 * @param {object} obj - rename the data keys so they are more descriptive.
 * @returns retuns the same object with a modified key for each property. now it will be "total_"+key+"_count".
 */
function renameKeysWithCount(obj) {
  const renamedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = "total_" + convertToUnderscoreLowercase(key) + "_count";
      renamedObj[newKey] = obj[key];
    }
  }

  return renamedObj;
}

/**
 *
 * @param {object} obj - rename the data keys so they are more descriptive.
 * @returns retuns the same object with a modified key for each property. now it will be key+"_ratio".
 */
function renameKeysWithRatio(obj) {
  const renamedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = convertToUnderscoreLowercase(key) + "_ratio";
      renamedObj[newKey] = obj[key];
    }
  }

  return renamedObj;
}

module.exports = { renameKeysWithCount, renameKeysWithRatio }