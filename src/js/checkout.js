import { loadHeaderFooter } from "./utils.mjs";

import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  
  const myForm = document.forms['checkout'];
  
  const chk_status = myForm.checkValidity();
  
  myForm.reportValidity();
  
  if (chk_status) {
    myCheckout.checkout();
  }
});

document.querySelector('#zip').addEventListener('blur', () => {
    myCheckout.calculateOrderTotal();
});