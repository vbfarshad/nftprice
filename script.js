const pricesDiv = document.getElementById("prices");

fetch('https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=5')
    .then(response => response.json())
    .then(data => {
        data.assets.forEach(asset => {
            const price = asset.sell_orders ? asset.sell_orders[0].current_price : "Not for sale";
            const title = asset.name ? asset.name : "Unnamed Asset";
            pricesDiv.innerHTML += `<p>${title}: ${price}</p>`;
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        pricesDiv.innerHTML = "<p>Failed to load prices.</p>";
    });
