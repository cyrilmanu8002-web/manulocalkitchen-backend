// Ghanaian Food Database Array
const ghanaianMenu = [
    { id: 1, name: "Fufu with Light Soup", price: 65.00, category: "mains", desc: "Freshly pounded fufu served with local spicy light soup, tender goat meat, and tripe." },
    { id: 2, name: "Banku with Grilled Tilapia", price: 80.00, category: "mains", desc: "Warm corn and cassava dough paired with large charcoal-grilled tilapia, fresh pepper, and shito." },
    { id: 3, name: "Smoky Ghanaian Jollof Rice", price: 55.00, category: "mains", desc: "Rich, tomato-infused spiced jollof rice served with crispy fried chicken, salad, and black shito." },
    { id: 4, name: "Plain Rice with Tomato Stew", price: 45.00, category: "mains", desc: "Fragrant white rice layered over spicy local tomato gravy, accompanied by seasoned fried beef." },
    { id: 5, name: "Omotuo with Groundnut Soup", price: 60.00, category: "mains", desc: "Soft mashed rice balls swimming in a rich, creamy peanut soup served with seasoned chicken." },
    { id: 6, name: "Tuo Zaafi (TZ) with Ayoyo Soup", price: 50.00, category: "mains", desc: "Soft northern corn mush matched perfectly with green ayoyo soup, stew, and cow wele." },
    { id: 7, name: "Kelewele (Spiced Plantain)", price: 20.00, category: "sides", desc: "Ripe plantain cubes heavily seasoned with ginger, chili, and local spices, deep-fried." },
    { id: 8, name: "Extra Fried Chicken Piece", price: 25.00, category: "sides", desc: "An additional helping of seasoned, gold-fried crunchy chicken breast." },
    { id: 9, name: "Chilled Sobolo Drink", price: 15.00, category: "drinks", desc: "Deep crimson hibiscus flower infusion brewed heavily with fresh ginger and pineapple rind." },
    { id: 10, name: "Ice-Cold Malta Guinness", price: 18.00, category: "drinks", desc: "Premium dark malt non-alcoholic beverage, served ice cold." }
];

let clientOrder = [];

// Generate Card Layout UI
function renderLocalMenu(items) {
    const grid = document.getElementById("food-grid");
    if (!grid) return;
    grid.innerHTML = "";

    items.forEach(dish => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <div>
                <div class="card-title-row">
                    <h3 class="food-title">${dish.name}</h3>
                    <span class="food-price">GH₵${dish.price.toFixed(2)}</span>
                </div>
                <p class="food-desc">${dish.desc}</p>
            </div>
            <button class="add-btn" onclick="addDishToBill(${dish.id})">Add to Order</button>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(category, event) {
    const buttons = document.querySelectorAll(".filter-link");
    buttons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    if (category === "all") {
        renderLocalMenu(ghanaianMenu);
    } else {
        const filteredData = ghanaianMenu.filter(dish => dish.category === category);
        renderLocalMenu(filteredData);
    }
}

function addDishToBill(dishId) {
    const matchedDish = ghanaianMenu.find(dish => dish.id === dishId);
    if (!matchedDish) return;
    clientOrder.push(matchedDish);
    refreshBillInvoice();
}

function refreshBillInvoice() {
    document.getElementById("cart-counter").innerText = clientOrder.length;
    const invoiceBox = document.getElementById("invoice-items");
    invoiceBox.innerHTML = "";
    
    let subtotal = 0;
    clientOrder.forEach(dish => {
        subtotal += dish.price;
        const row = document.createElement("div");
        row.className = "invoice-row";
        row.innerHTML = `<span>🍲 ${dish.name}</span> <span>GH₵${dish.price.toFixed(2)}</span>`;
        invoiceBox.appendChild(row);
    });

    const localTaxValue = subtotal * 0.15; 
    const absoluteTotalBalance = subtotal + localTaxValue;

    document.getElementById("bill-subtotal").innerText = `GH₵${subtotal.toFixed(2)}`;
    document.getElementById("bill-tax").innerText = `GH₵${localTaxValue.toFixed(2)}`;
    document.getElementById("bill-total").innerText = `GH₵${absoluteTotalBalance.toFixed(2)}`;
}

function toggleCartDashboard() {
    const panel = document.getElementById("checkout-sidebar");
    if (panel) { panel.classList.toggle("active"); }
}

function clearCart() {
    clientOrder = [];
    refreshBillInvoice();
}

// NETWORK API DATA BRIDGE TRANSMITTER
function transmitOrderToKitchen() {
    if (clientOrder.length === 0) {
        alert("⚠️ Your order sheet is completely empty!");
        return;
    }

    const customerName = document.getElementById("client-name").value.trim();
    const customerPhone = document.getElementById("client-phone").value.trim();
    const serviceSelection = document.getElementById("service-type").value;

    if (!customerName || !customerPhone) {
        alert("⚠️ Please enter your Full Name and Phone Number to submit your order!");
        return;
    }

    const dishNamesList = clientOrder.map(dish => dish.name);

    const orderPayload = {
        name: customerName,
        phone: customerPhone,
        type: serviceSelection,
        items: dishNamesList
    };

    // FIXED LINK: Direct connection route to your local Python server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(`🎉 Success, ${customerName}! Your order has been transmitted directly to Manu's Kitchen Monitor!`);
            document.getElementById("client-name").value = "";
            document.getElementById("client-phone").value = "";
            clearCart();
            toggleCartDashboard();
        }
    })
    .catch(error => {
        console.error('Network Error:', error);
        alert("❌ Server Transmission Interrupted! Make sure your Python server is running.");
    });
}

window.addEventListener("DOMContentLoaded", () => { renderLocalMenu(ghanaianMenu); });