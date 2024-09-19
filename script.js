// Grab the pricesDiv element where we will display the NFT prices
const pricesDiv = document.getElementById("prices");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Your actual API key

// Define the collection contract address you want to fetch data from
const collectionContract = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';  // Your NFT collection contract address

// Fetch data from the Reservoir API
fetch(`https://api.reservoir.tools/tokens/v5?collection=${collectionContract}`, {
    headers: {
        'x-api-key': apiKey  // Pass the API key in the headers
    }
})
    .then(response => {
        console.log('Full Response:', response); // Log the response object
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Check for non-200 status
        }
        return response.json(); // Parse JSON if response is OK
    })
    .then(data => {
        console.log('Reservoir API Response:', data); // Log the API response

        // Check if tokens data exists in the response
        if (data.tokens) {
            // Loop through each token and display its price and name (or token ID)
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";  // Get price
                const title = token.token.name || `Token ID: ${token.token.tokenId}`;  // Get token name or ID

                // Display the token name and price in the pricesDiv element
                pricesDiv.innerHTML += `<p>${title}: ${price} ETH</p>`;
            });
        } else {
            pricesDiv.innerHTML = "<p>No tokens found for this collection.</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching data from Reservoir:', error);  // Log any error that occurs
        pricesDiv.innerHTML = "<p>Failed to load prices from Reservoir.</p>";  // Display error message on the page
    });
