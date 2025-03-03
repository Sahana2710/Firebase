const firebaseConfig = {
    apiKey: "AIzaSyCGnPEDBGQlKs9KrmqeF_mso0wrVcdVj7A",
    authDomain: "food-app-1099c.firebaseapp.com",
    projectId: "food-app-1099c",
    storageBucket: "food-app-1099c.firebasestorage.app",
    messagingSenderId: "270067079567",
    appId: "1:270067079567:web:6aa9f61ee39d47e803d3fa",
    measurementId: "G-SSDWPQTWL3"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let cart = [];
let totalAmount = 0;

// Ensure script is running
console.log("Script loaded");

// Function to add items to cart
function addItem(item, price) {
    console.log("Adding item:", item, price); // Debugging

    cart.push({ item, price });
    totalAmount += price;
    displayCart();
}

// Function to display cart
function displayCart() {
    console.log("Cart:", cart); // Debugging

    const cartItems = document.getElementById('cart-items');
    if (!cartItems) {
        console.error("Cart element not found!");
        return;
    }

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Cart is empty</li>';
    } else {
        cart.forEach(({ item, price }, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item} - ₹${price}`;

            // Add remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.style.marginLeft = '10px';
            removeBtn.onclick = () => removeItem(index);

            listItem.appendChild(removeBtn);
            cartItems.appendChild(listItem);
        });
    }

    document.getElementById('total-amount').textContent = totalAmount;
}

// Function to remove an item
function removeItem(index) {
    totalAmount -= cart[index].price;
    cart.splice(index, 1);
    displayCart();
}

// Function to place order
function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const orderData = {
        items: cart,
        total: totalAmount,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('orders').add(orderData)
        .then(() => {
            alert('Your order has been placed and saved to the database!');
            cart = [];
            totalAmount = 0;
            displayCart();
        })
        .catch(error => {
            console.error("Error placing order: ", error);
            alert("Error placing order. Please try again.");
        });
}