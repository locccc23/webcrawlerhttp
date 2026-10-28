const { crawlPage } = require('./crawl.js')
const {printReport} = require('./report.js')
const {saveReport} = require('./report.js')

async function main(){
    if (process.argv.length <3) {
        console.log("no website provided")
        process.exit(1)
    }
    if (process.argv.length > 4){
        console.log("too many arguments")
        process.exit(1)
    }
    const baseURL = process.argv[2]
    const maxPages = Number(process.argv[3] ?? 10)

    if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages >50) {
        console.log("Max pages must be an integer between 1 and 50")
        process.exit(1)
    }

    console.log(`starting crawl of ${baseURL}, limit: ${maxPages} pages`)
    const pages = await crawlPage(baseURL, baseURL, {}, maxPages)
    printReport(pages)
    saveReport(pages, 'report.json')
}
main()
