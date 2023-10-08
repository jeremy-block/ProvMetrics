/**
 * Modifies the "doc_id" property of interaction events in a list by appending
 * a specified prefix and suffix to the original value.
 *
 * @param {Array<interactions>} events - The list of interaction events to be modified.
 * @param {string} prefix - The string to prepend at the beginning of "doc_id" value.
 * @param {string} suffix - The string to append after the original "doc_id" value.
 * @returns {Array<interactions>} - A new array of modified interaction events.
*/
function correctDocIDs(events, prefix, suffix) {
  return events.map((event) => {
    if (event.hasOwnProperty("doc_id")) {
      event.doc_id = prefix + event.doc_id + suffix;
    }
    return event;
  });
}

module.exports = { correctDocIDs };
