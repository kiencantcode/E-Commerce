'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header sticky & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);


/**
 * redirect to registration page on button click
 */
const registerButton = document.getElementById('register-btn');

registerButton.addEventListener('click', function () {
  window.location.href = 'registration.html'; // Redirect to the registration page
});


document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.querySelector("#cart-btn");
  const cartModal = document.querySelector("#cart-modal");
  const cartItemsList = document.querySelector("#cart-items-list");
  const closeCartBtn = document.querySelector("#close-cart");
  const cartTotalElement = document.querySelector("#cart-total-amount");
  const cartBadgeElement = document.querySelector("#cart-btn .btn-badge");

  let cart = {
    items: []
  };

  // Function to update the cart UI
  function updateCartUI() {
    cartItemsList.innerHTML = ""; // Clear previous items
    let total = 0; // Initialize total price

    cart.items.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <span>${item.name} - $${item.price.toFixed(2)}</span>
          <div class="quantity-control">
              <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
              <span class="item-quantity">${item.quantity}</span>
              <button class="quantity-btn increase-btn" data-index="${index}">+</button>
          </div>
      `;
      cartItemsList.appendChild(listItem);

      // Calculate total price
      total += item.price * item.quantity;
    });

    // Update total price and badge
    cartTotalElement.textContent = `$${total.toFixed(2)}`; // Update the total
    cartBadgeElement.textContent = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    // Add event listeners for quantity buttons
    const decreaseBtns = document.querySelectorAll(".decrease-btn");
    const increaseBtns = document.querySelectorAll(".increase-btn");

    decreaseBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        const index = parseInt(btn.getAttribute("data-index"));
        if (cart.items[index].quantity > 1) {
          cart.items[index].quantity--;
          // updateCartUI();
        } else {
          cart.items.splice(index, 1); // Remove item if quantity is 0
          updateCartUI();
        }
      });
    });

    increaseBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        const index = parseInt(btn.getAttribute("data-index"));
        cart.items[index].quantity++;
        updateCartUI();
      });
    });
  }

  // Event listener to add products to cart
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
      const price = parseFloat(button.getAttribute("data-price"));
      const productName = button.getAttribute("data-product-name");

      // Check if item already exists in cart
      const existingItem = cart.items.find(item => item.name === productName);
      if (existingItem) {
        existingItem.quantity++; // Increase quantity
      } else {
        cart.items.push({ name: productName, price: price, quantity: 1 }); // Add new item
      }

      // Update the UI
      updateCartUI();

      // Show cart modal
      cartModal.style.display = "block";
    });
  });

  // Show cart modal
  cartBtn.addEventListener("click", function () {
    cartModal.style.display = "block";
  });

  // Close cart modal
  closeCartBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
  });
});

