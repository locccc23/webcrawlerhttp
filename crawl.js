const {JSDOM} = require('jsdom')

// This module contains functions to crawl web pages and extract links from them.   
async function crawlPage(baseURL, currentURL, pages, maxPages = 10) {

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    // Only crawl pages that are on the same hostname as the base URL.
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }
    
    const normalizedCurrentURL = normalizeURL(currentURL)
    // Check if the page has already been visited.
    // If it has been visited, increment the visit count and return.
    if (pages[normalizedCurrentURL]) {
        pages[normalizedCurrentURL].visits++
        return pages
    }
    if (Object.keys(pages).length >= maxPages) {
        return pages
    }
    // If the page has not been visited, proceed to fetch and process it.
    console.log(`active crawling: ${currentURL}`)
    
    try {
        const resp = await fetch(currentURL)
        //Check the response status code
        // If the status code is greater than 399, log an error and return.
        if (resp.status >399) {
            console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`)
            return pages
        }
        // Check the content type of the response.
        const contentType = resp.headers.get("content-type")
        //If the content type is not HTML, log a msg and return.
        if (!contentType || !contentType.includes("text/html")) {
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        } 
        //Store the page info in the pages object.
        pages[normalizedCurrentURL] = {
            visits: 1,
            status: resp.status,
            contentType: contentType,

        }
        // Extract the HTML body of the response.
        const htmlBody =  await resp.text()

        //Extract readable text from this webpage
        const extractedText = extractTextFromHTML(htmlBody, currentURL);

        //Save the page infomation and extracted text
        pages[normalizedCurrentURL].text = extractedText.slice(0,10000);

        // Get the next URLs from the HTML body.
        const nextURLs = getURLsFromHTML (htmlBody, currentURL)
        console.log(`Found ${nextURLs.length} links on {currentURL}`)
        console.log(nextURLs)
        // Recursively crawl the next URLs.
        for (const nextURL of nextURLs) {
            if (Object.keys(pages).length >= maxPages){
                console.log("Reached page limit")
                break
            }
            console.log(`Trying to crawl: ${nextURLs}`)
            pages = await crawlPage (baseURL, nextURL, pages, maxPages)
            
        }
        }  
     
    catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
        }
        return pages
        }

// Extracts all URLs from the given HTML body.
function getURLsFromHTML(htmlBody, pageURL) {
    const urls = []
    // Create a new JSDOM instance with the HTML body.
    const dom = new JSDOM(htmlBody, {url: pageURL})
    // Get all anchor elements from the document.
    const linkElements = dom.window.document.querySelectorAll('a[href]')

    for (const linkElement of linkElements){
      
        try {
            // Create a new URL object with the base URL and the relative path.
            const urlObj = new URL(linkElement.href, pageURL)

            if(
                urlObj.protocol === 'http:' ||
                urlObj.protocol === 'https:'
            ) {
                urls.push(urlObj.href)
            }

        } catch (err){
            console.log(`Invalid URL: ${err.message}`)
        }
       }
       return urls
      }
// Normalizes the given URL string by removing the trailing slash if present.
function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath =  `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}
function  extractTextFromHTML (htmlBody, pageURL) {
    const dom = new JSDOM (htmlBody, {url: pageURL});
    const document = dom.window.document;

    //Remove elements that usually don't contain main article content.
    const unwantedElements = document.querySelectorAll(
        'script, style, nav, footer, header, noscript'
    );
    for (const element of unwantedElements) {
        element.remove();
    }
    
    return document.body?.textContent
           .replace(/\s+/g, ' ')
           .trim() || '';

}


module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
    extractTextFromHTML
}