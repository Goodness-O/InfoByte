const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

const navigateButton = document.getElementById("navigate-button");

if (navigateButton) {
  navigateButton.addEventListener("click", async () => {
    const response = await fetch("/api/cart-items");
    const cartItems = await response.json();

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.location.href = "checkout.html";
  });
}

const navigateButton1 = document.getElementById("navigate-button1");

if (navigateButton1) {
  navigateButton1.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
}

function addToCart(product) {
  const cartItem = {
    image: product.querySelector("img").src,
    product: product.querySelector("h5").textContent,
    price: parseFloat(
      product.querySelector("h4").textContent.replace(/[^0-9.-]+/g, "")
    ),
    quantity: 1,
  };

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems.push(cartItem);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  alert("Item added to cart!");
}

const addToCartButtons = document.querySelectorAll(".cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const product = event.target.closest(".pro");
    addToCart(product);
  });
});

function getCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  return cartItems;
}

function generateCartTable() {
  const cartTableBody = document.querySelector("#cart tbody");
  cartTableBody.innerHTML = "";

  const cartItems = getCartItems();
  let totalSubtotal = 0;

  cartItems.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><button class="remove-item" data-index="${index}"><i class="far fa-times-circle"></i></button></td>
      <td><img src="${item.image}" alt="${item.product}" /></td>
      <td>${item.product}</td>
      <td>₦${item.price ? item.price.toFixed(2) : ""}</td>
      <td><input type="number" class="quantity-input" value="${
        item.quantity
      }" /></td>
      <td class="subtotal">₦${(item.price * item.quantity).toFixed(2)}</td>
    `;

    cartTableBody.appendChild(row);

    if (item.price && item.quantity) {
      totalSubtotal += item.price * item.quantity;
    }
  });

  const subTotalElements = document.querySelectorAll(".sub-total");
  subTotalElements.forEach((element) => {
    element.textContent = `₦${totalSubtotal.toFixed(2)}`;
  });
}

function handleRemoveItem(event) {
  const index = event.currentTarget.dataset.index;
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  generateCartTable();
}

window.addEventListener("DOMContentLoaded", () => {
  generateCartTable();

  async function fetchAndDisplayCartContent() {
    const response = await fetch("/api/cart-items");
    const cartItems = await response.json();

    const cartContent = document.getElementById("cart-content");
    cartContent.innerHTML = "";

    cartItems.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cart-item");
      cartItemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.product}" />
        <h4>${item.product}</h4>
        <p>₦${item.price ? item.price.toFixed(2) : ""}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: ₦${(item.price * item.quantity).toFixed(2)}</p>
      `;
      cartContent.appendChild(cartItemDiv);
    });

    let totalSubtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const subTotalElements = document.querySelectorAll(".sub-total");
    subTotalElements.forEach((element) => {
      element.textContent = `₦${totalSubtotal.toFixed(2)}`;
    });
  }

  fetchAndDisplayCartContent();
});

document
  .getElementById("navigate-button")
  .addEventListener("click", async () => {
    const response = await fetch("/api/cart-items");
    const cartItems = await response.json();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "checkout.html";

    cartItems.forEach((item) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "cartItems";
      input.value = JSON.stringify(item);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  });
