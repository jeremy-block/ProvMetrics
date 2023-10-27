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

/**
 * Sets the event log times to be relative to the first event. Subtracts the start time from all other events in a session.
 * @param {Array<Object>} eventLogs - The list of events
 * @returns time adjusted listed of events.
 */
function correctStartTime(eventLogs) {
  const startTime = eventLogs[0].time;
  return eventLogs.map((eventlog) => {
    eventlog.time = eventlog.time - startTime;
    return eventlog;
  })
}

module.exports = {
  correctTimes,
  correctStartTime,
};
