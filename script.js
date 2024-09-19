const pricesDiv = document.getElementById("prices");

// Use the CORS proxy by prepending its URL to the OpenSea API request
fetch('https://cors-anywhere.herokuapp.com/https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=5')
    .then(response => response.json())
    .then(data => {
        if (data.assets) {
            // Iterate through the assets and display the price and title
            data.assets.forEach(asset => {
                const price = asset.sell_orders ? asset.sell_orders[0].current_price : "Not for sale";
                const title = asset.name ? asset.name : "Unnamed Asset";
                pricesDiv.innerHTML += `<p>${title}: ${price}</p>`;
            });
        } else {
            pricesDiv.innerHTML = "<p>No assets found.</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        pricesDiv.innerHTML = "<p>Failed to load prices.</p>";
    });
