const { reverseSearch } = require("../pre-processing/searchMetrics");

function appendSearchResults(interacitons, documents, debug = true) {
    let outgoingInteractions = []
    interacitons.forEach(interaction => {
        outgoingInteractions.append(interaction)
        if (interaction.type == "search") {
            let term = interaction.text
            if ( debug ) console.log("🚀 ~ file: correctSearchResults.js:9 ~ appendSearchResults ~ term:", term)
            let searchResultList = reverseSearch(term, documents)
            if ( debug ) console.log("🚀 ~ file: correctSearchResults.js:10 ~ appendSearchResults ~ searchResultList:", searchResultList)
            let searchResultObject = { ...interaction, "text": searchResultList, "type": "search result" }
            if ( debug ) console.log("🚀 ~ file: correctSearchResults.js:11 ~ appendSearchResults ~ searchResultObject:", searchResultObject)
            outgoingInteractions.append(searchResultObject)
        }
    });
    return outgoingInteractions
}

modules.export = {appendSearchResults}