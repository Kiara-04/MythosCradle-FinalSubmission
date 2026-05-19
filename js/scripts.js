let cart = [];

// Need to fix this to be dynamic for each card, currently only works for the first card on the page
let addToCart = () => {
    alert("Added to Cradle!");

    let name = document.querySelector(".adoptName").textContent; 
    let quantity = parseInt(document.querySelector(".adoptQuantity p").textContent);

    let cartData = {
    name: name,
    quantity: quantity
    };

    cart.push(cartData);
}