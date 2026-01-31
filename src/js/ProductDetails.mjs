import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {

    this.product = await this.dataSource.findProductById(this.productId);

    if (this.product) {
      this.renderProductDetails();

      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {

    let cartItems = getLocalStorage("so-cart") || [];

    if (!Array.isArray(cartItems)) {
      cartItems = [cartItems];
    }

    cartItems.push(this.product);

    setLocalStorage("so-cart", cartItems);

    alertMessage(`${this.product.NameWithoutBrand} added to cart!`);
  }

  renderProductDetails() {

    document.getElementById("productBrandName").textContent = this.product.Brand.Name;
    document.getElementById("productNameWithoutBrand").textContent = this.product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.src = this.product.Images.PrimaryLarge;
    productImage.alt = this.product.Name;

    document.getElementById("productPrice").textContent = `$${this.product.FinalPrice}`;
    document.getElementById("productColor").textContent = `Color: ${this.product.Colors[0].ColorName}`;
    document.getElementById("productDesc").innerHTML = this.product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = this.product.Id;
  }
}