const {JSDOM} = require('jsdom')

// This module contains functions to crawl web pages and extract links from them.   
async function crawlPage(baseURL, currentURL, pages) {
    

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
        // Get the next URLs from the HTML body.
        const nextURLs = getURLsFromHTML (htmlBody, baseURL)
        // Recursively crawl the next URLs.
        for (const nextURL of nextURLs) {
            pages = await crawlPage (baseURL, nextURL, pages)
            
        }
        }  
     
    catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
        }
        return pages
        }

// Extracts all URLs from the given HTML body.
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    // Create a new JSDOM instance with the HTML body.
    const dom = new JSDOM(htmlBody)
    // Get all anchor elements from the document.
    const linkElements = dom.window.document.querySelectorAll('a')

    for (const linkElement of linkElements){
        // Check if the link is a relative path or an absolute path.
        if (linkElement.href.slice(0, 1) ===  '/') {
            //relative path
            try {
            // Create a new URL object with the base URL and the relative path.
            const urlObj = new URL(`${baseURL}${linkElement.href}`)
            urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with relative url: ${err.message}`)
            }
        } else {
            // absolute path
            // Create a new URL object with the absolute path.
            try {
            const urlObj = new URL(`${linkElement.href}`)
            urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with absolute url: ${err.message}`)
            }              
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

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}