async function doPage(url) {
    const serverTime = Math.floor(Math.random() * 5000) + 1000;
    console.log(`Processing ${url} with server time of ${serverTime}ms`);
    await new Promise(resolve => setTimeout(resolve, serverTime));
    return { data: {}, serverTime };
  }
  
  async function run(urls) {
    let concurrency = 3;
    let consecutiveFastResponses = 0;
  
    // Create an array to hold promises for each URL
    const promises = [];
  
    for (const url of urls) {
      console.log(`Running ${url} with concurrency level of ${concurrency}`);
  
      // Add a new promise to the array for each URL
      promises.push(doPage(url));
  
      // If we've reached the maximum concurrency level, wait for all promises to resolve before continuing
      if (promises.length === concurrency) {
        const results = await Promise.all(promises);
  
        // Process each result as it comes in
        results.forEach(result => {
          if (result.serverTime > 2000) {
            concurrency = Math.max(concurrency - 2, 1);
            console.log(`Reducing concurrency to ${concurrency}`);
          consecutiveFastResponses = 0;
        } else {
          consecutiveFastResponses++;
          if (consecutiveFastResponses >= 3) {
            concurrency = Math.min(concurrency + 1, urls.length);
            console.log(`Increasing concurrency to ${concurrency}`);
            consecutiveFastResponses = 0;
          }
        }
      });

      // Reset the promises array
      promises.length = 0;
    }
  }

  // Wait for any remaining promises to resolve
  const results = await Promise.all(promises);

  // Process each result as it comes in
  results.forEach(result => {
    if (result.serverTime > 2000) {
      concurrency = Math.max(concurrency - 2, 1);
      console.log(`Reducing concurrency to ${concurrency}`);
    } else {
      consecutiveFastResponses++;
      if (consecutiveFastResponses >= 3) {
        concurrency = Math.min(concurrency + 1, urls.length);
        console.log(`Increasing concurrency to ${concurrency}`);
        consecutiveFastResponses = 0;
      }
    }
  });
}

const urls = ['https://www.example.com/page1', 'https://www.example.com/page2', 'https://www.example.com/page3', 'https://www.example.com/page4', 'https://www.example.com/page5'];

run(urls);