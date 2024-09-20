// Get the div where we will display the NFT prices
const pricesDiv = document.getElementById("prices");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Replace with your actual API key

// Array of collection contract addresses you want to display prices for
const collections = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example: Bored Ape Yacht Club
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',   // Add more contract addresses here
    '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D',
    '0xB852c6b5892256C264Cc2C888eA462189154D8d7',

];

// Function to fetch and display NFT data
function fetchAndDisplayNFTData(contract) {
    // Fetch data from the Reservoir API for each contract address
    fetch(`https://api.reservoir.tools/tokens/v5?collection=${contract}`, {
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
        // Check if tokens data exists in the response
        if (data.tokens) {
            // Create a table for each collection's data
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price (ETH)</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');
            
            // Loop through each token and add rows to the table
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";
                const title = token.token.name || `Token ID: ${token.token.tokenId}`;
                
                const row = `<tr><td>${title}</td><td>${price}</td></tr>`;
                tbody.innerHTML += row;
            });

            // Add the table to the pricesDiv (side by side if screen size allows)
            pricesDiv.appendChild(table);
        } else {
            const message = document.createElement('p');
            message.textContent = `No tokens found for collection: ${contract}`;
            pricesDiv.appendChild(message);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Failed to load prices for collection: ${contract}`;
        pricesDiv.appendChild(errorMessage);
    });
}

// Loop through all collections and fetch their data
collections.forEach(contract => {
    fetchAndDisplayNFTData(contract);
});
