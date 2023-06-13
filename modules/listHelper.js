const { ListOfObjectKeys } = require("./objHelper");

function checkInput(arr) {
    if (!Array.isArray(arr)) {
        console.log("🔴 Input is not an array");
        return false
    }

    if (arr.length === 0) {
        console.log("🔴 Array is empty");
        return false
    }

    return true
}

 // Helper function to check if two arrays are equal
  function arraysAreEqual(arr1, arr2, debug=false) {
    try {
      if (arr1.length !== arr2.length) {
        return false;
      }
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
      
    } catch (error) {
      if(debug) console.log("🔴 error:", error)
      return false
    }
  }

function calcMean(arr) {
    if (checkInput(arr)) {
        const sum = arr.reduce((acc, value) => acc + value, 0);
        const mean = sum / arr.length;
        return mean;
    }
}


function calcStdDev(arr) {
    if (checkInput(arr)) {
        // Step 1: Calculate the mean
        const mean = calcMean(arr);
        // Step 2: Calculate the square of the absolute differences from the mean
        const squaredDifferences = arr.map((value) =>
            Math.pow(Math.abs(value - mean), 2)
        );
        const sumOfAbsoluteDifferences = squaredDifferences.reduce(
            (accumulator, value) => accumulator + value, 0
        );
        // Step 3: Calculate the variance
        const varience = sumOfAbsoluteDifferences / arr.length - 1;
        // Step 4: Calculate the standard deviation
        const standardDeviation = Math.sqrt(varience);
        return standardDeviation;
    }
}
    
function calcOutlierness(arr) {
    if (checkInput(arr)) {
        // Calculate the mean of the data
        const mean = calcMean(arr)

        // Calculate the standard deviation of the data
        const standardDeviation = calcStdDev(arr);

        // Calculate the Z-score for each data point
        const zScores = arr.map((value) => (value - mean) / standardDeviation);

        // Calculate the average absolute Z-score
        const avgAbsoluteZScore =
            zScores.reduce((acc, value) => acc + Math.abs(value), 0) / arr.length;

        return avgAbsoluteZScore;
    }
}

/**
 * 
 * @param {any} val1 Value from the array
 * @param {any} val2 Value from the array
 * @param {number} threshhold value represeenting the tolerance of the fuzzy match. Not used for string comparison
 * @returns boolean representing if the values match.
 * todo test this function.
 */
function areValuesFuzzyMatch(val1, val2, threshhold) {
    if (typeof val1 === "string" && typeof val2 === "string") {
        // Implement your fuzzy string matching logic here
        // For example, you can use string similarity algorithms like Levenshtein distance
        // or implement custom rules based on your requirements
        // Return true if the strings are a fuzzy match, false otherwise
        // Here's a simple example using case-insensitive comparison:
        return val1.toLowerCase() === val2.toLowerCase();
        //todo lemetize or stem the string values if you can
    } else {
        // Implement your fuzzy number matching logic here
        // For example, you can define a tolerance level to consider numbers as fuzzy matches
        // Return true if the numbers are a fuzzy match, false otherwise
        // Here's a simple example using a tolerance of 0.1:
        return Math.abs(val1 - val2) <= threshhold;
    }
}


/**
 * 
 * @param {array} arr The list of values to calculate
 * @param {number} threshold the differnece that needs to be surpassed to identify a match
 * @param {boolean} debug truth value to provide verbose output or not
 * @returns object containing hubnessScore(float), disctinctCount (integer), and frequencyCounts(object of items and frequencies)
 */
function calcHubness(arr, threshold = 0, debug = false) {
    if (checkInput(arr)) {
        const totalCount = arr.length;
       if(debug) console.log("🚀 ~ file: listHelper.js:92 ~ calcHubness ~ original Length:", totalCount)
        

        const frequencyCounts = {};

        arr.forEach((value) => {
            let foundMatch = false;
            for (const key in frequencyCounts) {
                if (areValuesFuzzyMatch(value, key, threshold)) {
                    if(debug) console.log(">>>>>>>Found ---MATCH---", value, "fuzzy matches", key)
                    frequencyCounts[key]++;
                    foundMatch = true;
                    break;
                }
            }
            if (!foundMatch) {
                if(debug) console.log("Term added to list:", value)
                frequencyCounts[value] = 1;
            }
        });

        const distinctCount = ListOfObjectKeys(frequencyCounts).length

        const hubnessScore = 1 - (distinctCount / totalCount);

        return {
            hubnessScore,
            distinctCount,
            frequencyCounts,
        };
    }
}

/**
 * 
 * @param {array} arr A list of numbers to normalize
 * @param {boolean} debug show debugging logs?
 * @returns an array with values normalized between 0 and 1 inclusive. minimum value = 0, and max = 1.
 */
function minMaxNormalization(arr, debug = false) {
  if(debug) console.log("🚀 ~ file: listHelper.js:133 ~ minMaxNormalization ~ arr:", arr)
  if (checkInput(arr)) {
    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    if (debug) console.log(minVal, "< x <", maxVal)
    if (minVal === maxVal) {
      // Handle the case when all elements in the array are the same
      console.log(">>> Bad Array, only one value or no difference in values")
      return arr.map(() => 0);
    } else if (isNaN(minVal) || isNaN(maxVal)) {
      console.log(">>> Bad Array, Can not determine Min or Max")
      return null
    }
    const normalizedArr = arr.map((x) =>{
      if (debug) console.log("~ x:", x, "~ diff: ", x-minVal, "~ denominator:", (maxVal- minVal))
        return (x - minVal) / (maxVal - minVal)
    });
          
        if(debug) console.log(normalizedArr)
        return normalizedArr;
    } else {
      return null
    }
}
module.exports = { calcMean, calcStdDev, calcOutlierness, calcHubness, minMaxNormalization };


function testHubness() {
    const arr = [1, 2.5, 3.3, 4.8, 2.1, 5, 6.7, 3.9, 4.2, 7.1];
    const result = calcHubness(arr, 0.8,true);
    console.log(result);
    const arr2 = [
      "apple",
      "banana",
      "pineapple",
      "Apple",
      "orange",
      "pineApple",
      "kiwi",
    ];
    const result2 = calcHubness(arr2,null,true);
    console.log(result2);
}
// testHubness()

function testMinMaxNormalization() {
  // Test case 1: Normalization of positive values
  const arr1 = [1, 2, 3, 4, 5];
  const expected1 = [0, 0.25, 0.5, 0.75, 1];
  const result1 = minMaxNormalization(arr1);
  console.log(
    "Test case 1:",
    arraysAreEqual(result1, expected1) ? "Passed" : "Failed"
  );

  // Test case 2: Normalization of negative values
  const arr2 = [-5, -3, -1, 0, 2, 4];
  const expected2 = [
    0, 0.2222222222222222, 0.4444444444444444, 0.5555555555555556,
    0.7777777777777778, 1,
  ];
  const result2 = minMaxNormalization(arr2);
  console.log(
    "Test case 2:",
    arraysAreEqual(result2, expected2) ? "Passed" : "Failed"
  );

  // Test case 3: Empty array
  const arr3 = [];
  const expected3 = null;
  const result3 = minMaxNormalization(arr3);
  console.log(
          "Test case 3:",
    result3 === expected3 ? "Passed" : "Failed"
  );

  // Test case 4: Array with one element
  const arr4 = [10];
  const expected4 = [0];
  const result4 = minMaxNormalization(arr4);
  console.log(
    "Test case 4:",
    arraysAreEqual(result4, expected4) ? "Passed" : "Failed"
  );

  // Test case 5: Array with duplicate values
  const arr5 = [2, 2, 2, 2, 2];
  const expected5 = [0, 0, 0, 0, 0];
  const result5 = minMaxNormalization(arr5);
  console.log(
    "Test case 5:",
    arraysAreEqual(result5, expected5) ? "Passed" : "Failed"
  );

  // Test case 6: Array with non-numeric values
  const arr6 = ["1", 2, "3", 4, 5];
  const expected6 = [0, 0.25, 0.5, 0.75, 1]; // Expected to correct for string integers.
  const result6 = minMaxNormalization(arr6);
  console.log(
    "Test case 6:",
    arraysAreEqual(result5, expected5) ? "Passed" : "Failed"
  );

  // Test case 7: Array with mixed numeric and non-numeric values
  const arr7 = [1, "2", 3, "four", 5];
  const expected7 = null; // Expected result when checkInput fails
  const result7 = minMaxNormalization(arr7);
  console.log("Test case 7:", result7 === expected7 ? "Passed" : "Failed");

 
}
// testMinMaxNormalization();
