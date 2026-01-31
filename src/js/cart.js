import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");

  if (cartItems && Array.isArray(cartItems)) {
 
    cartItems = cartItems.filter(item => item !== null);

    if (cartItems.length > 0) {

      document.querySelector(".cart-footer").classList.remove("hide");

      const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice || 0), 0);
      document.querySelector(".cart-total").innerText = `Total: $${total.toFixed(2)}`;

      const htmlItems = cartItems.map((item) => cartItemTemplate(item));
      document.querySelector(".product-list").innerHTML = htmlItems.join("");
    } else {
      showEmptyCart();
    }
  } else {
    showEmptyCart();
  }
}

function showEmptyCart() {
  document.querySelector(".cart-footer").classList.add("hide");
  document.querySelector(".product-list").innerHTML = "Your cart is empty.";
}

function cartItemTemplate(item) {

  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

renderCartContents();
