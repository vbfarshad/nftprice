// Grab the pricesDiv element where we will display the NFT prices
const pricesDiv = document.getElementById("prices");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Your actual API key

// Array of collection contract addresses
const collections = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example: BAYC
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f'   // Another collection contract
    '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D'
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

        // Create table structure for the collection
        let table = `
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Token Name / ID</th>
                    <th>Price (ETH)</th>
                </tr>
        `;

        // Check if tokens data exists in the response
        if (data.tokens) {
            // Loop through each token and create table rows for each one
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";
                const title = token.token.name || `Token ID: ${token.token.tokenId}`;

                // Add the token info to the table as a new row
                table += `
                    <tr>
                        <td>${title}</td>
                        <td>${price}</td>
                    </tr>
                `;
            });
        } else {
            table += `<tr><td colspan="2">No tokens found for this collection.</td></tr>`;
        }

        // Close the table and append it to the pricesDiv element
        table += `</table>`;
        pricesDiv.innerHTML += table;
    })
    .catch(error => {
        console.error('Error fetching data from Reservoir:', error);
        pricesDiv.innerHTML += `<p>Failed to load prices for collection: ${contractAddress}</p>`;
    });
}

// Loop through the collections array and fetch prices for each collection
collections.forEach(contractAddress => {
    fetchPricesForCollection(contractAddress);
});
