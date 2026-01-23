import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam } from './utils.mjs';

const category = getParam('category');


const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const myList = new ProductList(category, dataSource, listElement);

if (category) {
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    document.querySelector('.title').innerHTML = `Top Products: ${capitalizedCategory}`;
}

myList.init();