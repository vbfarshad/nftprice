const pricesDiv = document.getElementById("prices");

// Use AllOrigins to bypass CORS issues
fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=5'))
    .then(response => response.json())
    .then(data => {
        // Check if the content returned is valid JSON or an error message
        try {
            const parsedData = JSON.parse(data.contents);

            if (parsedData.assets) {
                parsedData.assets.forEach(asset => {
                    const price = asset.sell_orders ? asset.sell_orders[0].current_price : "Not for sale";
                    const title = asset.name ? asset.name : "Unnamed Asset";
                    pricesDiv.innerHTML += `<p>${title}: ${price}</p>`;
                });
            } else {
                pricesDiv.innerHTML = "<p>No assets found.</p>";
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            pricesDiv.innerHTML = "<p>Failed to parse prices.</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        pricesDiv.innerHTML = "<p>Failed to load prices.</p>";
    });
