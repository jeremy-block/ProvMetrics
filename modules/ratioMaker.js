const divider = require("./divider")

/**
 * 
 * @param {Object} countsObj - The object that has counts of some event
 * @param {Number} divisor - the value everything will be divided by
 * @returns object of ratios
 */
function countsToRatios(countsObj, divisor) {
    output = {}
    for (key in countsObj) {
        output[key] = divider(countsObj[key], divisor)
    }
    return output
}
module.exports = { countsToRatios };