import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {    
  const formData = new FormData(formElement),
    convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items
    .filter((item) => item !== null && item !== undefined)
    .map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1,
    }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(`${this.outputSelector} #subtotal`);
    const numElement = document.querySelector(`${this.outputSelector} #num-items`);

    if (this.list && Array.isArray(this.list)) {
      const validItems = this.list.filter(item => item !== null);
      
      const amounts = validItems.map((item) => item.FinalPrice || 0);
      this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);

      if (summaryElement) summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
      if (numElement) numElement.innerText = validItems.length;
    } else {
      this.itemTotal = 0;
      if (summaryElement) summaryElement.innerText = "$0.00";
      if (numElement) numElement.innerText = 0;
    }
  }

  calculateOrderTotal() {

    if (this.list.length > 0) {
        this.tax = (this.itemTotal * 0.06).toFixed(2);
        this.shipping = (10 + (this.list.length - 1) * 2).toFixed(2);
        this.orderTotal = (
          parseFloat(this.itemTotal) +
          parseFloat(this.tax) +
          parseFloat(this.shipping)
        ).toFixed(2);

        this.displayOrderTotals();
    }
  }

  displayOrderTotals() {
    const shippingElem = document.querySelector(`${this.outputSelector} #shipping`);
    const taxElem = document.querySelector(`${this.outputSelector} #tax`);
    const totalElem = document.querySelector(`${this.outputSelector} #orderTotal`);

    if(shippingElem) shippingElem.innerText = `$${this.shipping}`;
    if(taxElem) taxElem.innerText = `$${this.tax}`;
    if(totalElem) totalElem.innerText = `$${this.orderTotal}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    
    // Double check that we have items before trying to process
    if (this.list.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const json = formDataToJSON(formElement);

    json.orderDate = new Date().toISOString();
    json.orderTotal = String(this.orderTotal);
    json.shipping = String(this.shipping);
    json.tax = String(this.tax);
    json.items = packageItems(this.list);

    console.log("Final Payload:", json);

    try {
      const res = await services.checkout(json);
      console.log(res);
      localStorage.removeItem(this.key); 
      location.assign("./success.html"); 
    } catch (err) {

      console.error("Checkout Error:", err);

      if (err.message && typeof err.message === 'object') {

        const errorMessages = Object.values(err.message).join("\n");
        alertMessage("Submission Errors:\n" + errorMessages);
      } else {
        alertMessage("An error occurred during checkout. Please try again.");
      }
    }
  }
}