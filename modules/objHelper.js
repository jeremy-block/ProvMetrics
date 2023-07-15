const listOfObjectValues = (obj) => Array.from(Object.values(obj));

const ListOfObjectKeys = (obj) => Array.from(Object.keys(obj));
/**
 * Takes a list of objects and converts the numeric values to be in the range from 0 -- 1
 *
 * @param {*} objects The list of objects with numeric properties
 * @param {boolean} [keepColumns=true] - Boolean to overwrite the columns or make new ones. Defaults to make new ones.
 * @return {*} A similar object to the original, with the columns overwritten or not.
 */
function normalizeNumericObjectValues(objects, keepColumns = true) {
  // Collect all possible numeric keys
  const numericKeys = objects.reduce((keys, obj) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "number") { //if the value is numeric include it as a key
        keys.add(key);
      }
    });
    return keys;
  }, new Set()); //remove duplicate keys
  const keys = Array.from(numericKeys) //convert to array
  // console.log("🚀 ~ file: objHelper.js:16 ~ normalizeNumericObjectValues ~ keys:", keys.length)

  // Find the maximum value for each numeric key across all objects
  const maxValues = keys.reduce((max, key) => {
    max[key] = Math.max(...objects.map((obj) => obj[key] || Number.NEGATIVE_INFINITY));
    return max;
  }, {});
  // console.log("🚀 ~ file: objHelper.js:23 ~ maxValues ~ maxValues:", maxValues)

  // Generate a new key with the "_norm" suffix for each original key
  const normalizedObjects = objects.map((obj) => {
    const normalizedObj = { ...obj };
    keys.forEach((key) => {
      const normalizedKey = keepColumns ? `${key}_norm` : key;
      const value = obj[key];
      if (typeof value === "number" && maxValues[key] !== undefined) {
        const maxValue = maxValues[key];
        const normalizedValue = value / maxValue;
        normalizedObj[normalizedKey] = normalizedValue;
      }
    });
    return normalizedObj;
  });

  return normalizedObjects;
}



module.exports = {
  listOfObjectValues,
  ListOfObjectKeys,
  normalizeNumericObjectValues,
};

// const objects = [
//   { key1: 8, key2: 20, key3: "not a number" },
//   { key1: 5, key2: 15, key3: "also not a number" },
//   { key1: 10, key2: 12, key3: 18 },
// ];

// const normalizedObjects = normalizeNumericObjectValues(objects,false);
// console.log(normalizedObjects);