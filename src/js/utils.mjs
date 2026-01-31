export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export async function loadHeaderFooter() {
  const headerTemplate = await fetch("/partials/header.html");
  const footerTemplate = await fetch("/partials/footer.html");
  
  const headerHtml = await headerTemplate.text();
  const footerHtml = await footerTemplate.text();

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    headerElement.innerHTML = ""; // Clear existing content
    headerElement.insertAdjacentHTML("afterbegin", headerHtml);
  }
  if (footerElement) {
    footerElement.innerHTML = ""; // Clear existing content
    footerElement.insertAdjacentHTML("afterbegin", footerHtml);
  }
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.querySelector("span").addEventListener("click", () => {
    alert.remove();
  });

  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  if (scroll) window.scrollTo(0, 0);
}