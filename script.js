// Get the div where we will display the NFT prices
const pricesDiv = document.getElementById("prices");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Replace with your actual API key

// Array of collection contract addresses you want to display prices for
const collections = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example: Bored Ape Yacht Club
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',   // Another collection contract
    '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D',
    '0xb852c6b5892256c264cc2c888ea462189154d8d7',

];

// Function to fetch and display NFT data
function fetchAndDisplayNFTData(contract) {
    // First, fetch collection metadata to get the collection icon
    fetch(`https://api.reservoir.tools/collections/v5?id=${contract}`, {
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
        const collection = data.collections[0];  // Get the first collection from the response
        const collectionIcon = collection.image || '';  // Fetch the collection icon
        const collectionName = collection.name || `Collection ${contract}`;

        // Create a container for each collection's data
        const collectionContainer = document.createElement('div');
        collectionContainer.classList.add('collection-container');  // Add some styling class if needed

        // Add the collection icon and name above the table
        const collectionHeader = `
            <div class="collection-header" style="display: flex; align-items: center;">
                <img src="${collectionIcon}" alt="${collectionName}" width="50" height="50" style="margin-right: 10px;">  <!-- Collection icon -->
                <h2>${collectionName}</h2>  <!-- Collection name -->
            </div>`;
        collectionContainer.innerHTML += collectionHeader;

        // Now fetch token-level data
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
            // Create a table for each collection's data
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price (ETH)</th>
                        <th>Marketplace Link</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');
            
            // Loop through each token and add rows to the table
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";
                const title = token.token.name || `Token ID: ${token.token.tokenId}`;
                const tokenImage = token.token.image || '';  // Fetch token image
                const tokenId = token.token.tokenId;  // Get token ID

                // Construct OpenSea and Blur URLs
                const openSeaUrl = `https://opensea.io/assets/ethereum/${contract}/${tokenId}`;
                const blurUrl = `https://blur.io/eth/asset/${contract}/${tokenId}`;

                const row = `
                    <tr>
                        <td><img src="${tokenImage}" alt="${title}" width="50" height="50"></td>  <!-- Token image -->
                        <td>${title}</td>
                        <td>${price}</td>
                        <td>
                            <a href="${openSeaUrl}" target="_blank">View on OpenSea</a> |
                            <a href="${blurUrl}" target="_blank">View on Blur</a>
                        </td>
                    </tr>`;
                
                tbody.innerHTML += row;
            });

            // Add the table to the collection container
            collectionContainer.appendChild(table);
            pricesDiv.appendChild(collectionContainer);  // Add the entire container (icon + table) to the page
        })
        .catch(error => {
            console.error('Error fetching token data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Failed to load prices for collection: ${contract}`;
            collectionContainer.appendChild(errorMessage);
            pricesDiv.appendChild(collectionContainer);
        });
    })
    .catch(error => {
        console.error('Error fetching collection metadata:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Failed to load collection data for: ${contract}`;
        pricesDiv.appendChild(errorMessage);
    });
}

// Loop through all collections and fetch their data
collections.forEach(contract => {
    fetchAndDisplayNFTData(contract);
});
