
                //********** Fetch data from backend **********//

const API = "http://localhost:3001";

// Load products on page load
async function getProducts() {
const res = await fetch(`${API}/products`);
const data = await res.json();

const container = document.getElementById("product-list");
container.innerHTML = "";

data.data.forEach(p => {
container.innerHTML += `<div class="product">
                        <h3>${p.title}</h3> 
                        <p>Price: ₹${p.price}</p>         
                        <p>Category: ${p.category}</p>         
                        <p>Brand: ${p.brand}</p>       
                        </div>
                            `;
                        });
}

getProducts();


                //********** Add proucts **********//


async function addProduct() {
const title = document.getElementById("title").value;
const price = document.getElementById("price").value;
const category = document.getElementById("category").value;
const brand = document.getElementById("brand").value;

await fetch(`${API}/products`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title,
description: "Sample product",
price: Number(price),
category,
brand
})
});

alert("Product Added!");
getProducts(); // refresh list
}
