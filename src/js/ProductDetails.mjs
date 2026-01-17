import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    
    if (!this.product) {
      console.error("Product not found with ID:", this.productId);
      document.querySelector('main').innerHTML = "<h2>Product Not Found</h2>";
      return; 
    }

    this.renderProductDetails('main');
    document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    
    const imagePath = this.product.Image.replace('../', '/');

    element.insertAdjacentHTML(
      'afterbegin',
      `<h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img class="divider" src="${imagePath}" alt="${this.product.NameWithoutBrand}" />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>`
    );
  }
}