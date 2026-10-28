

// Prints a report of the pages and their visit counts. 
function printReport(pages){
    console.log("=========")
    console.log("Report")
    console.log("=========")
    const sortedPages = sortPages (pages)
    for (const sortedPage of sortedPages) {
        const url = sortedPage[0]
        const page = sortedPage[1]
        console.log(`Found ${page.visits} visits to: ${url}`)
        console.log(`Extracted ${page.text?.length ?? 0} characters`)
    }
    console.log("=========")
    console.log("End of Report")
    console.log("=========")
}
// Sorts the pages by their visit counts in descending order.
function sortPages(pages) {
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a, b) => {
        const aHits = a[1].visits
        const bHits = b[1].visit
        return bHits - aHits
    })
    return pagesArr
}

// Saves the report to a JSON file.
function saveReport (pages, filename) {
    require('fs').writeFileSync(filename, JSON.stringify(pages, null, 2))
}

module.exports = {
    sortPages,
    printReport,
    saveReport
}