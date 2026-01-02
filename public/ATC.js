// Array to store available products
let availableProducts = [
  {
    product: "Panneer Biryani - Without Onion",
    price: 215,
    description: "Delicious Panneer Biryani prepared without onions",
  },
  {
    product: "Veg Noodles - Gluten-Free",
    price: 175,
    description: "Gluten-free vegetable noodles",
  },
  {
    product: "Oyster Sauce Chicken - Gluten-Free",
    price: 225,
    description: "Gluten-free chicken with oyster sauce",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
// Modified to include quantity in cart items
updateCartWithQuantities();

function updateCartWithQuantities() {
  // Update existing cart items to include quantity if not present
  cart = cart.map((item) => {
    if (!item.quantity) {
      return { ...item, quantity: 1 };
    }
    return item;
  });
  calculateTotalPrice();
}

function calculateTotalPrice() {
  totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addToCart(index) {
  const item = availableProducts[index];
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.product === item.product
  );

  if (existingItemIndex !== -1) {
    // Increment quantity if item already exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item with quantity 1
    cart.push({ ...item, quantity: 1 });
  }

  calculateTotalPrice();
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  cartItems.innerHTML = "<h2>Cart Items</h2>";

  cart.forEach((item, index) => {
    const itemCard = document.createElement("div");
    itemCard.className = "cart-item";

    itemCard.innerHTML = `
      <div class="item-details">
        <h3>${item.product}</h3>
        <p>Price: €${item.price.toFixed(2)}</p>
        <div class="item-controls-row">
          <div class="quantity-controls">
            <button onclick="decrementQuantity(${index})" class="quantity-btn">-</button>
            <span class="quantity">${item.quantity}</span>
            <button onclick="incrementQuantity(${index})" class="quantity-btn">+</button>
          </div>
          <div class="item-total">
            <p>Total: €${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button onclick="removeFromCart(${index})" class="remove-btn">🗑️</button>
        </div>
      </div>
    `;

    cartItems.appendChild(itemCard);
  });

  document.querySelectorAll(".total-price").forEach((element) => {
    element.textContent = `€${totalPrice.toFixed(2)}`;
  });

  // Update item count in summary
  const itemCountElements = document.querySelectorAll(".item-count");
  if (itemCountElements) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    itemCountElements.forEach((el) => {
      el.textContent = totalItems;
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateSummarySection();

  // Add back to shop link to the top right
  addBackToShopLink();
}

function addBackToShopLink() {
  // Remove any existing back to shop link
  const existingLink = document.querySelector(".back-to-shop-link");
  if (existingLink) {
    existingLink.remove();
  }

  // Create and add the back to shop link
  const containerElement =
    document.querySelector(".container") || document.body;
  const backToShopLink = document.createElement("div");
  backToShopLink.className = "back-to-shop-link";
  backToShopLink.style.textAlign = "right";
  backToShopLink.style.marginBottom = "10px";
  backToShopLink.innerHTML = `
    <a href="javascript:void(0)" onclick="backToShop()" style="text-decoration: none; color:rgb(0, 0, 0);">← Back to shop</a>
  `;

  // Insert at the top of the container or body
  if (containerElement.firstChild) {
    containerElement.insertBefore(backToShopLink, containerElement.firstChild);
  } else {
    containerElement.appendChild(backToShopLink);
  }
}

function incrementQuantity(index) {
  cart[index].quantity += 1;
  calculateTotalPrice();
  updateCart();
}

function decrementQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    calculateTotalPrice();
    updateCart();
  } else {
    removeFromCart(index);
  }
}

function removeFromCart(index) {
  totalPrice -= cart[index].price * cart[index].quantity;
  cart.splice(index, 1);
  updateCart();
}

function updateSummarySection() {
  const summarySection = document.getElementById("summarySection");
  if (summarySection) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = 5.0;

    summarySection.innerHTML = `
      <h2>Summary</h2>
      <div class="summary-items">
        <p>ITEMS ${totalItems}</p>
        <p class="total-price">€${totalPrice.toFixed(2)}</p>
      </div>
      <div class="shipping">
        <p>Shipping</p>
        <select class="shipping-selector">
          <option value="standard">Standard-Delivery- ${shippingCost.toFixed(
            2
          )}</option>
          <option value="express">Express Delivery: 10.00</option>
        </select>
      </div>
      <div class="promo-code">
        <p>Give Code</p>
        <div class="code-input-container">
          <input type="text" placeholder="Enter your code" class="promo-input">
          <button class="apply-code-btn">→</button>
        </div>
      </div>
      <div class="total">
        <p><strong>Total Price</strong></p>
        <p class="total-price"><strong>€${(totalPrice + shippingCost).toFixed(
          2
        )}</strong></p>
      </div>
      <button onclick="proceedToCheckout()" class="checkout-btn">Checkout</button>
    `;
  }
}

function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to the cart first.");
    return;
  }
  const deliverySection = document.getElementById("deliverySection");
  if (deliverySection) {
    deliverySection.style.display = "block";
  }
}

function handleOrderConfirmation() {
  const orderConfirmation = document.getElementById("orderConfirmation");
  if (orderConfirmation) {
    orderConfirmation.style.display = "block";
  }
}

function clearCart() {
  cart = [];
  totalPrice = 0;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function continueShopping() {
  document.getElementById("orderConfirmation").style.display = "none";
  window.location.href = "menu.html";
}

function backToShop() {
  window.location.href = "menu.html";
}

// Initialize on page load
window.onload = function () {
  // Initialize cart
  updateCart();
};

// Handle address form submission
document.addEventListener("DOMContentLoaded", () => {
  const addressForm = document.getElementById("addressForm");
  if (addressForm) {
    addressForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleOrderConfirmation();
    });
  }

  // Add CSS for the horizontal layout
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .item-controls-row {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 10px;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    
    .quantity-btn {
      width: 30px;
      height: 30px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .quantity {
      margin: 0 10px;
      min-width: 20px;
      text-align: center;
    }
    
    .item-total {
      margin-right: 20px;
    }
    
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
    }
    
    .back-to-shop-link {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    
    .checkout-btn {
      width: 100%;
      padding: 12px;
      background: #4267B2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 20px;
    }
    
    .code-input-container {
      display: flex;
      margin-top: 5px;
    }
    
    .promo-input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #ddd;
    }
    
    .apply-code-btn {
      width: 40px;
      border: 1px solid #ddd;
      background: #f5f5f5;
      cursor: pointer;
    }
  `;
  document.head.appendChild(styleElement);
});

function generateInvoice() {
  const buyerName = document.getElementById("name").value;
  const buyerAddress =
    document.getElementById("address").value +
    ", " +
    document.getElementById("city").value +
    ", " +
    document.getElementById("postal").value;

  // Retrieve cart data from localStorage
  let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = savedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  let shippingCost = 5.0;
  let totalAmount = subtotal + shippingCost;

  let invoiceWindow = window.open("", "_blank");
  let invoiceContent = `
    <html>
    <head>
        <title>Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-container { max-width: 600px; margin: auto; background: #fff; padding: 20px; 
                                 box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #3b5998; color: white; }
        </style>
    </head>
    <body>
        <div class='invoice-container'>
            <h2>Invoice</h2>
            <p><strong>Seller:</strong> Recipe Sharing App</p>
            <p><strong>Buyer:</strong> ${buyerName}</p>
            <p><strong>Address:</strong> ${buyerAddress}</p>
            <table>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                </tr>
                ${savedCart
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.product}</td>
                        <td>${item.quantity}</td>
                        <td>€${item.price.toFixed(2)}</td>
                        <td>€${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
            <p><strong>Subtotal:</strong> €${subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> €${shippingCost.toFixed(
              2
            )} (Standard Delivery)</p>
            <p><strong>Total Amount:</strong> €${totalAmount.toFixed(2)}</p>
            <p><strong>Payment Status:</strong> Paid/Pending</p>
        </div>
    </body>
    </html>
  `;

  invoiceWindow.document.write(invoiceContent);
  invoiceWindow.document.close();
  invoiceWindow.print();
}

// Ensure invoice is generated before clearing cart
document.addEventListener("DOMContentLoaded", () => {
  const addressForm = document.getElementById("addressForm");
  if (addressForm) {
    addressForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Save invoice to MongoDB
      saveInvoiceToDB();
      // Generate the invoice first
      generateInvoice();

      // Delay clearing the cart to ensure invoice is generated
      setTimeout(() => {
        handleOrderConfirmation();
      }, 3000); // Wait for 3 seconds before clearing the cart
    });
  }
});

function saveInvoiceToDB() {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotal = savedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 5.0;

  const invoiceData = {
    buyerName: document.getElementById("name").value,
    buyerAddress:
      document.getElementById("address").value +
      ", " +
      document.getElementById("city").value +
      ", " +
      document.getElementById("postal").value,
    items: savedCart,
    subtotal: subtotal,
    shipping: shippingCost,
    totalAmount: subtotal + shippingCost,
    paymentStatus: "Pending",
  };

  fetch("http://localhost:5002/save-invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceData),
  })
    .then((response) => response.json())
    .then((data) => console.log("Invoice Saved:", data))
    .catch((error) => console.error("Error:", error));
}
