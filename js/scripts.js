// ---------- CART SYSTEM ----------------- //

let cradleStatus = false; // Variable to track the status of the cradle (open or closed)

let toggleCradle = () => {
    cradleStatus = !cradleStatus; 
    console.log("Cradle " + cradleStatus); // Debugging

    if (cradleStatus) {
        document.querySelector(".cradleContainer").style.display = "flex"; // Show the cradle
    } else {
        document.querySelector(".cradleContainer").style.display = "none"; // Hide the cradle
    }
}

// Creature Database
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

let cart = []; // cart array to manage items in cart

let overallTotal = 0; // Variable to keep track of the total price of the cart

let totalElement = document.querySelector(".total") // total element selector

let clearCart = () => {
    cart = []; // Empty cart
    overallTotal = 0; // Resetting the overall total
    document.querySelectorAll(".cartTableItem").forEach(el => el.remove()); // Remove the HTML of the items

    totalElement.textContent = "R " + overallTotal; // update Total

    document.querySelector(".empty").style.display = "flex"; // Display empty Cradle message

    document.querySelector(".notification").textContent = `Removed ALL items from Cradle!`; // Edit notification
    document.querySelector(".notificationContainer").style.visibility = "visible"; // Show notification
    setTimeout(() => {
        document.querySelector(".notificationContainer").style.visibility = "hidden"; // Hide notification after 1.5 seconds
    }, 1500);

    console.log(cart); // Debugging
    console.log("Cart cleared. Total: R" + overallTotal); // Debugging
}

let fetchQuantity = (event) => {
    // Asking for the closest container to be able to reference the correct <p> element
    let container = event.target.closest(".adoptButtons");

    let quantity = parseInt(container.querySelector(".quantity").textContent);

    return quantity;
}

let updateQuantity = (event, operation, quantity) => {
    if (operation === "plus") {
        quantity++; // +1 to the quantity
    } else if (operation === "minus") {
        if (quantity <= 0) { // If the quantity is equal to 0 or less than 0 exit this function
        return;
        }
        quantity--; // -1 to the quantity
    } else if (operation === "reset") {
        quantity = 0;
    }
    console.log("quantity updated " + quantity); // Debugging
    // Changing the textContent of the <p> element to reflect the new quantity
    event.target.closest(".adoptButtons").querySelector(".quantity").textContent = quantity;
}

let notification = (quantity, creatureType, operation) => {
    if (operation == "+") {
        document.querySelector(".notification").textContent = `${quantity} ${creatureType} ADDED to Cradle!`;
    } else if (operation == "-") {
        document.querySelector(".notification").textContent = `${quantity} ${creatureType} REMOVED from Cradle!`;
    } else if (operation == "remove") {
        document.querySelector(".notification").textContent = `${creatureType} REMOVED from Cradle!`;
    }
    
    document.querySelector(".notificationContainer").style.visibility = "visible"; // Show the notification

    setTimeout(() => {
        document.querySelector(".notificationContainer").style.visibility = "hidden"; // Hide the notification after 3 seconds
     }, 1500);
}


let plus = (event) => {
    console.log("Plus button clicked"); // Debugging
    
    let quantityNum = fetchQuantity(event);

    console.log("quantityNum " + quantityNum); // Debugging

    updateQuantity(event, "plus", quantityNum);
}

let minus = (event) => {
    console.log("Minus button clicked"); // Debugging
    
    let quantityNum = fetchQuantity(event);

    console.log("quantityNum " + quantityNum); // Debugging

    updateQuantity(event, "minus", quantityNum);
}


let addToCart = (event) => {
    console.log("Add to Cart button clicked"); // Debugging
    
    let creatureQuantity = fetchQuantity(event);
    console.log("Fetched Quantity: " + creatureQuantity); // Debugging

    if (creatureQuantity === 0) { // If the quantity is 0 exit this function
        console.log(cart);
        return; // Exit the function
    }

    document.querySelector(".empty").style.display = "none";

    // Fetching the id of the button that was clicked which will tell us which creature to add to the cart because the id corresponds with our creature database array
    let creatureId = event.target.closest(".adoptButtons").id;

    // Assigning the creature's properties based on the unique id we just fetched to correspond the details with our creature database
    let creatureName = creatureDatabase[creatureId].name;
    let creatureType = creatureDatabase[creatureId].type;
    let creaturePrice = creatureDatabase[creatureId].price;

    console.log(`Creature ID: ${creatureId} Type: ${creatureType}`); // Debugging
    notification(creatureQuantity, creatureType, "+"); // Displaying the notification with the quantity added

    // Checking if the creature is already in cart then just changing the values in the array instead of pushing a whole new object
    if (cart.some(checkId => checkId.id === creatureId)) { 

        notification(creatureQuantity, creatureType); // Displaying the notification with the quantity added

        overallTotal += creaturePrice * creatureQuantity; // Adding the total price of the new quantity to the overall total

        let existingCreature = cart.find(existingId => existingId.id === creatureId); // Finding the already existing creature in the cart

        let originalQuantity = existingCreature.quantity; // Fetching the original quantity number

        let newQuantity = creatureQuantity + originalQuantity; // Adding the new quantity to the old one

        existingCreature.quantity += creatureQuantity; // Updating the quantity of the existing creature in the cart
        
        existingCreature.total = creaturePrice * newQuantity; // Updating the total price * new quantity

        refreshCartHtml();

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
    quantity: creatureQuantity,
    total: creaturePrice * creatureQuantity // Total price based on the quantity
    };

    cart.push(creatureData); // Adding the creature data to the cart array

    overallTotal += creaturePrice * creatureQuantity; // Adding the total price of the new amount of creature/s to the overall total

    // notification(creatureQuantity, creatureType, "+"); // Displaying the notification with the quantity added

    // input data to html
    refreshCartHtml();

    updateQuantity(event, "reset"); // Updating the quantity display back to 0

    console.log(cart); // Debugging

    console.log("Overall Total: " + overallTotal); // Debugging
}

let refreshCartHtml = () => {
    let items = document.querySelectorAll(".cartTableItem").forEach(el => el.remove());

    let targetElement = document.querySelector(".bottomContainer");

    for (let i = 0; i < cart.length; i++) {

        let htmlString = `
            <div class="cartTableItem" id="creatureId${cart[i].id}">
                <div class="creatureQuantity">${cart[i].quantity}</div>
                <div class="creatureType">${cart[i].type}</div>
                <div class="creatureName">${cart[i].name}</div>
                <div class="creaturePrice">R ${cart[i].price}</div>
                <div class="creatureTotal">R ${cart[i].total}</div>
                <div class="cartTableControls">
                    <button class="minusItem" onclick="controls(event)">-</button>
                    <button class="plusItem" onclick="controls(event)">+</button>
                    <button class="removeItem" onclick="controls(event)">X</button>
                </div>
            </div>
        `;

        targetElement.insertAdjacentHTML('beforebegin', htmlString)
    }

    totalElement.textContent = "R " + overallTotal;
}

let controls = (event) => {

    let creatureId = event.target.closest(".cartTableItem").id.slice(-1); // Finding cartTableItem class then its id then slicing off the last character of the string to get the id of the creature
    let cartIndex = cart.findIndex(item => item.id == creatureId); // Find index of the creature in the cart

    console.log("Creature ID:" + creatureId + " " + cart[cartIndex].type); // Debugging
    console.log("Current Quantity: " + cart[cartIndex].quantity);

    let item = cart[cartIndex]; // creating a temp version of the objects at the selected index

    let targetClass = event.target.className; // fetching class name of the control
    console.log(targetClass); // Debugging

    switch (targetClass) {
        case "minusItem":
            item.quantity--;
            item.total = item.quantity * item.price;
            overallTotal -= item.price;

            if (item.quantity === 0) {
                let string = item.type
                overallTotal -= item.total; // Remove from total
                cart.splice(cartIndex, 1); // Dropping the removed item
                notification(0, item.type, "remove")
                console.log("Removed: " + item.type + "from cart" )
            } else {
                cart[cartIndex] = item; // updating the array with the new values
                notification(1, item.type, "-")
                console.log("New Quantity: " + cart[cartIndex].quantity);
            }
            break;

        case "plusItem":
            item.quantity++;
            item.total = item.quantity * item.price;
            overallTotal += item.price;
            cart[cartIndex] = item; // updating the array with the new values
            notification(1, item.type, "+")
            console.log("New Quantity: " + cart[cartIndex].quantity);
            break;

        case "removeItem":
            overallTotal -= item.total; // Remove from total
            cart.splice(cartIndex, 1); // Dropping the removed item
            notification(0, item.type, "remove")
            break;
    }

    refreshCartHtml(); // Refresh

    if (cart.length == 0) {
        document.querySelector(".empty").style.display = "flex";
    } else {
        document.querySelector(".empty").style.display = "none";
    }

    console.log(cart); // Debugging
}

// ---------- FORM SYSTEM ----------------- //

let form = document.querySelector("#contactForm");

let displayThankYouMessage = (name) => {
    document.querySelector(".name").textContent = name;
    document.querySelector(".contactFormContainer").style.display = "none";
    document.querySelector(".message").style.display = "flex";
}

let collectData = (event) => {
    event.preventDefault();

    // if (validateForm() == false) {
    //     return; // stop if form is invalid
    // }

    let fullName = document.getElementById("name").value.trim(); // fetch name
    displayThankYouMessage(fullName);
}

form.addEventListener("submit", collectData)