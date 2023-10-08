const { DateTime } = require("luxon");

/**
 * Modify the "time" property of JSON objects based on the provided time format.
 * @param {Array<Object>} eventLogs - List of JSON objects with a "time" property in the specified format.
 * @param {string} timeFormat - The time format string, e.g., "H:MM:SS.dd".
 * @returns {Array<Object>} - Modified event logs with the "time" property as integers.
 */
function correctTimes(eventLogs, timeFormat) {
  return eventLogs.map((eventLog) => {
    if (eventLog && eventLog.time) {
      const parsedTime = DateTime.fromFormat(eventLog.time, timeFormat);
      if (parsedTime.isValid) {
        eventLog.time = parsedTime.valueOf()
      } else { // Odd case for Dataset 4 to catch the events that use a different time format.
        // try modifying the time format string just for the odd case where sometimes the format is wild.
        const newTimeFormat = timeFormat.replace(".", ":")
        const newerParsedTime = DateTime.fromFormat(eventLog.time, newTimeFormat);
        eventLog.time = newerParsedTime.valueOf()
        if (!newerParsedTime.isValid) {
          console.log("still invalid date string after replacing '.' with ':' ", eventLog, newerParsedTime);
          eventLog.time = null;
        }
      }
    }
    return eventLog;
  });
}

module.exports = {
  correctTimes,
};
