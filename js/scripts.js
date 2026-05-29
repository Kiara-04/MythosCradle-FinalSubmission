// ---------- CART SYSTEM ----------------- //

let cradleStatus = false;

let toggleCradle = () => {
    cradleStatus = !cradleStatus; 
    console.log("Cradle " + cradleStatus);

    if (cradleStatus) {
        document.querySelector(".cradleContainer").style.display = "flex";
    } else {
        document.querySelector(".cradleContainer").style.display = "none";
    }
}

let creatureDatabase = [
    {
        id: 0,
        type: "Blue Dragon",
        name: "Azuron",
        price: 2500,
        image: "../assets/Images/adopt1.png"
    },
    {
        id: 1,
        type: "Kitsune",
        name: "Yuki",
        price: 4500,
        image: "../assets/Images/adopt2.png"
    },
    {
        id: 2,
        type: "Griffon",
        name: "Aurelia",
        price: 6500,
        image: "../assets/Images/adopt3.png"
    },
    {
        id: 3,
        type: "Water Wisp",
        name: "Lumina",
        price: 40000,
        image: "../assets/Images/adopt4.png"
    },
    {
        id: 4,
        type: "Pegasus",
        name: "Starwind",
        price: 5000,
        image: "../assets/Images/adopt5.png"
    },
    {
        id: 5,
        type: "Forest Spirit",
        name: "Briar",
        price: 3500,
        image: "../assets/Images/adopt6.png",
    },

];

let cart = [];

let overallTotal = 0;

let totalElement = document.querySelector(".total")

let clearCart = () => {
    cart = [];
    overallTotal = 0;
    document.querySelectorAll(".cartTableItem").forEach(el => el.remove());

    totalElement.textContent = "R " + overallTotal;

    document.querySelector(".empty").style.display = "flex";

    document.querySelector(".notification").textContent = `Removed ALL items from Cradle!`;
    document.querySelector(".notificationContainer").style.visibility = "visible";
    setTimeout(() => {
        document.querySelector(".notificationContainer").style.visibility = "hidden";
    }, 1500);

    console.log(cart);
    console.log("Cart cleared. Total: R" + overallTotal);
}

let fetchQuantity = (event) => {

    let container = event.target.closest(".adoptButtons");

    let quantity = parseInt(container.querySelector(".quantity").textContent);

    return quantity;
}

let updateQuantity = (event, operation, quantity) => {
    if (operation === "plus") {
        quantity++; 
    } else if (operation === "minus") {
        if (quantity <= 0) {
        return;
        }
        quantity--; 
    } else if (operation === "reset") {
        quantity = 0;
    }
    console.log("quantity updated " + quantity); 

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
    
    document.querySelector(".notificationContainer").style.visibility = "visible"; 

    setTimeout(() => {
        document.querySelector(".notificationContainer").style.visibility = "hidden"; 
     }, 1500);
}


let plus = (event) => {
    console.log("Plus button clicked"); 
    
    let quantityNum = fetchQuantity(event);

    console.log("quantityNum " + quantityNum); 

    updateQuantity(event, "plus", quantityNum);
}

let minus = (event) => {
    console.log("Minus button clicked"); 
    
    let quantityNum = fetchQuantity(event);

    console.log("quantityNum " + quantityNum); 

    updateQuantity(event, "minus", quantityNum);
}


let addToCart = (event) => {
    console.log("Add to Cart button clicked"); 
    
    let creatureQuantity = fetchQuantity(event);
    console.log("Fetched Quantity: " + creatureQuantity); 

    if (creatureQuantity === 0) { 
        console.log(cart);
        return; 
    }

    document.querySelector(".empty").style.display = "none";

    let creatureId = event.target.closest(".adoptButtons").id;

    let creatureName = creatureDatabase[creatureId].name;
    let creatureType = creatureDatabase[creatureId].type;
    let creaturePrice = creatureDatabase[creatureId].price;
    let creatureImage = creatureDatabase[creatureId].image;

    console.log(`Creature ID: ${creatureId} Type: ${creatureType}`); 
    notification(creatureQuantity, creatureType, "+"); 

    if (cart.some(checkId => checkId.id === creatureId)) { 

        notification(creatureQuantity, creatureType); 

        overallTotal += creaturePrice * creatureQuantity; 

        let existingCreature = cart.find(existingId => existingId.id === creatureId); 
        existingCreature.quantity += creatureQuantity; 

        let originalQuantity = existingCreature.quantity; 
        let newQuantity = creatureQuantity + originalQuantity;
        existingCreature.total = creaturePrice * newQuantity; 

        refreshCartHtml();

        console.log(cart); 

        creatureQuantity = 0; 
        updateQuantity(event, "reset", creatureQuantity);

        return; 
    }

    let creatureData = {
    id: creatureId,
    name: creatureName,
    type: creatureType,
    price: creaturePrice,
    image: creatureImage,
    quantity: creatureQuantity,
    total: creaturePrice * creatureQuantity 
    };

    cart.push(creatureData); 

    overallTotal += creaturePrice * creatureQuantity; 

    refreshCartHtml();

    updateQuantity(event, "reset"); 

    console.log(cart); 

    console.log("Overall Total: " + overallTotal); 
}

let refreshCartHtml = () => {
    let items = document.querySelectorAll(".cartTableItem").forEach(el => el.remove());

    let targetElement = document.querySelector(".bottomContainer");

    for (let i = 0; i < cart.length; i++) {

        let htmlString = `
            <div class="cartTableItem" id="creatureId${cart[i].id}">
                <div><img class="creatureImage" src=${cart[i].image} alt=""></div>
                <div class="creatureQuantity"> ${cart[i].quantity}</div>
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
    let creatureId = event.target.closest(".cartTableItem").id.slice(-1); 
    let cartIndex = cart.findIndex(item => item.id == creatureId); 

    console.log("Creature ID:" + creatureId + " " + cart[cartIndex].type); 
    console.log("Current Quantity: " + cart[cartIndex].quantity);

    let item = cart[cartIndex]; 

    let targetClass = event.target.className; 
    console.log(targetClass); 

    switch (targetClass) {
        case "minusItem":
            item.quantity--;
            item.total = item.quantity * item.price;
            overallTotal -= item.price;

            if (item.quantity === 0) {
                let string = item.type
                overallTotal -= item.total; 
                cart.splice(cartIndex, 1); 
                notification(0, item.type, "remove")
                console.log("Removed: " + item.type + "from cart" )
            } else {
                cart[cartIndex] = item; 
                notification(1, item.type, "-")
                console.log("New Quantity: " + cart[cartIndex].quantity);
            }
            break;

        case "plusItem":
            item.quantity++;
            item.total = item.quantity * item.price;
            overallTotal += item.price;
            cart[cartIndex] = item; 
            notification(1, item.type, "+")
            console.log("New Quantity: " + cart[cartIndex].quantity);
            break;

        case "removeItem":
            overallTotal -= item.total; 
            cart.splice(cartIndex, 1); 
            notification(0, item.type, "remove")
            break;
    }

    refreshCartHtml(); 

    if (cart.length == 0) {
        document.querySelector(".empty").style.display = "flex";
    } else {
        document.querySelector(".empty").style.display = "none";
    }

    console.log(cart); 
}

let finishScreenStatus = false;

let toggleFinishScreen = () => {

    cart = [];
    overallTotal = 0;
    document.querySelectorAll(".cartTableItem").forEach(el => el.remove());
    totalElement.textContent = "R " + overallTotal;
    document.querySelector(".empty").style.display = "flex";

    finishScreenStatus = !finishScreenStatus;

    if (finishScreenStatus) {
        document.querySelector("#returnBtn").style.display = "flex";
        document.querySelector("#finishAdoptionBtn").style.display = "none";

        document.querySelector(".cartTable").style.display = "none";
        document.querySelector(".thank").style.display = "flex";
        document.querySelector(".leaveCradle").style.display = "none";
        document.querySelector(".finishBox").style.justifyContent = "center";
    } 
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
    let fullName = document.getElementById("name").value.trim(); // fetch name
    displayThankYouMessage(fullName);
}

if (form) {
    form.addEventListener("submit", collectData)
}

// ---------- SEARCH SYSTEM ----------------- //

let dropDownStatus = false;

console.log(dropDownStatus);

let toggleDropdown = () => {
    dropDownStatus = !dropDownStatus;
    console.log(dropDownStatus);

    if (dropDownStatus) {
        document.getElementById("dropDown").style.display = "flex";
    } else {
        document.getElementById("dropDown").style.display = "none";
    }
}

let filter = () => {
    let input = document.getElementById("searchInput").value.toUpperCase();

    document.querySelectorAll("#dropDown a").forEach(dropDownItem => {
        let dropDownItemText = dropDownItem.textContent.toUpperCase();
        let isMatch = dropDownItemText.includes(input);
        dropDownItem.style.display = isMatch ? "" : "none";
    });
}

document.querySelectorAll("#dropDown a").forEach(dropDownItem => {
    dropDownItem.addEventListener("click", toggleDropdown)
});

document.getElementById("searchInput").addEventListener("focus", toggleDropdown);

document.getElementById("searchInput").addEventListener("keyup", filter);