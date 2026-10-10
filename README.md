# JavaScript Web Crawler

## Overview

This project is a web crawler built with JavaScript. It explores web pages by visiting URLs and extracting links from them. I built this project as part of my journey into JavaScript and web development.

This was my first project using JavaScript, and it helped me practice working with URLs, HTML pages, and asynchronous operations.

## Features

- Crawls web pages starting from a given URL.
- Extracts links from HTML pages.
- Normalizes URLs to keep them in a consistent format.
- Tracks crawl results to avoid processing the same pages repeatedly.
- Avoids crawling unncessary pages based on status and content type.
- Saves crawl results to JSON and CSV files.

## Technologies Used

- **JavaScript**
- **Node.js** 
- **Git and GitHub** 

## What I Learned

- Learning how to build a webcrawler function:
  + Checks and stops pages that already visited or do not have the same hostname.
  + Fetchs the pages and avoids fetching untargeted pages based on status and content type.
  + Makes recursive calls to keep crawling to the next URLs.
  + Stores pages' info for other purposes.
- Learning how to normalize URLs:
  + Converts the URL string into a URL object so you can access its components.
  + Keep the hostname and pathname for a consistent identifier.
  + Finds all <a> elements with querySelectorAll('a')
  + Checks and slices the trailing slash and return the hostpath
- Understading how to work with Javascript:
  + Working with JavaScript functions, objects, and arrays.
  + Understanding asynchronous operations and HTTP requests.
  + Saving  results using JSON.
  + Using Git to track changes and manage my project.

## How to Run

1. Clone this repository:

   ```bash
   git clone webcrawlerhttp
   ```

2. Navigate to the project directory:

   ```bash
   cd webcrawlerhttp
   ```

3. Install dependencies, if required:

   ```bash
   npm install
   ```

4. Run the crawler using the command configured in the project:

   ```bash
   npm start
   ```

## Example Output

The crawler collects information about the pages it visits. The results are saved in report.json file, for example:

```  "wagslane.dev/posts/developers-learn-to-say-no": {
    "visits": 1,
    "status": 200,
    "contentType": "text/html; charset=utf-8"
  } ```

## Future Improvements

- Implement support for reading and respecting robots.txt rules to determine which pages the crawler is allowed to access.
- Reduce server load and avoiding too many requests in a short time.
- Improve more handling of HTTP errors, timeouts, and inaccessible pages.
 