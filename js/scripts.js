let cradleStatus = false; // Variable to track the status of the cradle (open or closed)

let toggleCradle = () => {
    cradleStatus = !cradleStatus; 
    console.log("Cradle " + cradleStatus); // Debugging

    if (cradleStatus) {
        document.querySelector(".viewCradle div").textContent = "Close Cradle"; // Change the button text to "Close Cradle"
        document.querySelector(".cradleContainer").style.display = "flex"; // Show the cradle
    } else {
        document.querySelector(".viewCradle div").textContent = "View Cradle"; // Change the button text to "View Cradle"
        document.querySelector(".cradleContainer").style.display = "none"; // Hide the cradle
    }
}

// Each creature will have a unique ID starting from 0 so that it is easy to reference the ID as the index of creature in this array serving as a mini database which we can collect information from
let creatureDatabase = [
    {
        id: 0,
        type: "Blue Dragon",
        name: "Azuron",
        price: 2500
    },
    {
        id: 1,
        type: "Kitsune",
        name: "Yuki",
        price: 4500
    },
    {
        id: 2,
        type: "Griffon",
        name: "Aurelia",
        price: 6500
    },
    {
        id: 3,
        type: "Water Wisp",
        name: "Lumina",
        price: 40000
    },
    {
        id: 4,
        type: "Pegasus",
        name: "Starwind",
        price: 5000
    },
    {
        id: 5,
        type: "Forest Spirit",
        name: "Briar",
        price: 3500
    },

];

let cart = [];

let overallTotal = 0; // Variable to keep track of the total price of the cart

let clearCart = () => {
    cart = [];
    overallTotal = 0; // Resetting the overall total back to 0 when the cart is cleared
    console.log(cart); // Debugging
    console.log("Cart cleared. Total: R" + overallTotal); // Debugging
}

let fetchQuantity = (event) => {
    // Asking for the closest container to be able to reference the correct <p> element
    let container = event.target.closest(".adoptButtons");

    // Then asking for the textContent inside the <p> element which resides inside the quantity class, then wrapping the result with the built-in parseInt() function to convert the textContent from a string into an integer
    let quantityElement = parseInt(container.querySelector(".quantity").textContent);
    console.log("Fetched Quantity: " + quantityElement); // Debugging

    return quantityElement;
}

let updateQuantity = (event, operation, quantity) => {
    if (operation === "plus") {
        quantity++; // +1 to the quantity
    } else if (operation === "minus") {
        if (quantity <= 0) { // If the quantity is equal to 0 or less than 0 exit this function
        return; // Exit the function
        }
        quantity--; // -1 to the quantity
    } else if (operation === "reset") {
        quantity = 0;
    }

     // Changing the textContent of the <p> element to reflect the new quantity
    event.target.closest(".adoptButtons").querySelector(".quantity").textContent = quantity;
    console.log("Updated Quantity: " + quantity); // Debugging
}

let notification = (quantity, creatureType) => {
    document.querySelector(".notification").textContent = `+ ${quantity} ${creatureType} added to Cradle!`;
    document.querySelector(".notificationContainer").style.visibility = "visible"; // Show the notification

    setTimeout(() => {
        document.querySelector(".notificationContainer").style.visibility = "hidden"; // Hide the notification after 3 seconds
     }, 3000);
}


let plus = (event) => {
    console.log("Plus button clicked"); // Debugging
    
    let quantity = fetchQuantity(event);

    updateQuantity(event, "plus", quantity);
}

let minus = (event) => {
    console.log("Minus button clicked"); // Debugging
    
    let quantity = fetchQuantity(event);

    updateQuantity(event, "minus", quantity);
}


let addToCart = (event) => {
    console.log("Add to Cart button clicked"); // Debugging
    
    let quantity = fetchQuantity(event);

    if (quantity === 0) { // If the quantity is 0 exit this function
        return; // Exit the function
    }

    // Fetching the id of the button that was clicked which will tell us which creature to add to the cart because the id corresponds with our creature database array
    let creatureId = event.target.closest(".adoptButtons").id;
    console.log(creatureId); // Debugging

    // Assigning the creature's properties based on the unique id we just fetched to correspond the details with our creature database
    let creatureName = creatureDatabase[creatureId].name;
    let creatureType = creatureDatabase[creatureId].type;
    let creaturePrice = creatureDatabase[creatureId].price;

    // Checking if the creature is already in the cart by checking if any of the objects in the cart have the same id as the creature we are trying to add to prevent duplicate entries of the same creature in the cart and instead just update the quantity of the existing creature in the cart
    if (cart.some(checkId => checkId.id === creatureId)) { 

        notification(quantity, creatureType); // Displaying the notification with the quantity added

        overallTotal += creaturePrice * quantity; // Adding the total price of the new quantity to the overall total

        let existingCreature = cart.find(existingId => existingId.id === creatureId); // Finding the existing creature in the cart that has the same id as the creature we are trying to add

        let originalQuantity = existingCreature.quantity; // Fetching the original quantity

        let newQuantity = quantity + originalQuantity; // Adding the original quantity to the new quantity to get the updated quantity

        existingCreature.quantity += quantity; // Updating the quantity of the existing creature in the cart to the new quantity
        
        existingCreature.total = creaturePrice * newQuantity; // Updating the total price * new quantity

        console.log(cart); // Debugging

        quantity = 0; // Resetting the quantity back to 0 after adding to cart

        updateQuantity(event, "reset", quantity); // Updating the quantity display back to 0

        return; // Exit the function if the creature is already in the cart
    }

    let creatureData = {
    id: creatureId,
    name: creatureName,
    type: creatureType,
    price: creaturePrice,
    quantity: quantity,
    total: creaturePrice * quantity // Total price based on the quantity
    };

    cart.push(creatureData); // Adding the creature data to the cart array

    overallTotal += creaturePrice * quantity; // Adding the total price of the new amount of creature/s to the overall total

    notification(quantity, creatureType); // Displaying the notification with the quantity added

    quantity = 0; // Resetting the quantity back to 0 after adding to cart
    updateQuantity(event, "reset", quantity); // Updating the quantity display back to 0

    console.log(cart); // Debugging

    console.log("Overall Total: " + overallTotal); // Debugging
}

