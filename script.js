// Grab the pricesDiv element where we will display the NFT prices
const pricesDiv = document.getElementById("prices");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Your actual API key

// Array of collection contract addresses
const collections = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example: BAYC
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',  // Add more contract addresses here
    '0xAnotherCollectionContractAddressHere'
];

// Function to fetch prices for a single collection
function fetchPricesForCollection(contractAddress) {
    fetch(`https://api.reservoir.tools/tokens/v5?collection=${contractAddress}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Display collection header
        pricesDiv.innerHTML += `<h2>Collection: ${contractAddress}</h2>`;
        
        // Check if tokens data exists in the response
        if (data.tokens) {
            // Loop through each token and display its price and name (or token ID)
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";
                const title = token.token.name || `Token ID: ${token.token.tokenId}`;

                // Display the token name and price in the pricesDiv element
                pricesDiv.innerHTML += `<p>${title}: ${price} ETH</p>`;
            });
        } else {
            pricesDiv.innerHTML += "<p>No tokens found for this collection.</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching data from Reservoir:', error);
        pricesDiv.innerHTML += "<p>Failed to load prices for this collection.</p>";
    });
}

// Loop through the collections array and fetch prices for each collection
collections.forEach(contractAddress => {
    fetchPricesForCollection(contractAddress);
});
