

// Prints a report of the pages and their visit counts. 
function printReport(pages){
    console.log("=========")
    console.log("Report")
    console.log("=========")
    const sortedPages = sortPages (pages)
    for (const sortedPage of sortedPages) {
        const url = sortedPage[0]
        const hits = sortedPage[1].visits
        console.log(`Found ${hits} internal links to page: ${url}`)
    }
    console.log("=========")
    console.log("End of Report")
    console.log("=========")
}
// Sorts the pages by their visit counts in descending order.
function sortPages(pages) {
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a, b) => {
        aHits = a[1]
        bHits = b[1]
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