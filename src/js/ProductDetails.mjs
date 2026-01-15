import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails('main');
    document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    // Get existing cart items or start with an empty array
    let cartItems = getLocalStorage('so-cart') || [];

    // Push the current product into the array
    cartItems.push(this.product);

    // Save the whole array back to local storage
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      'afterbegin',
      `<h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img class="divider" src="${this.product.Image}" alt="${this.product.NameWithoutBrand}" />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>`
    );
  }
}