'use strict';

const cartItemsList = document.querySelector("#cart-items-list");
const cartTotalElement = document.querySelector("#cart-total-amount");
const cartBadgeElement = document.querySelector("#cart-btn .btn-badge");

let cart = {
  items: [] // Initialize with an empty items array
};

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

function updateCartUI() {
  cartItemsList.innerHTML = ""; // Clear previous items
  let total = 0; // Initialize total price

  cart.items.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
      <span class="cart-item-name">${item.name} - $${item.price.toFixed(1)}</span>
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 50px; height: auto; display: inline-block; margin-left: 10px;">
      <div class="quantity-control">
        <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
        <span class="item-quantity">${item.quantity}</span>
        <button class="quantity-btn increase-btn" data-index="${index}">+</button>
      </div>
    </div>
    `;
    cartItemsList.appendChild(listItem);

    // Calculate total price
    total += item.price * item.quantity;
  });

  // Update total price and badge
  cartTotalElement.textContent = `$${total.toFixed(1)}`; // Update the total
  cartBadgeElement.textContent = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  // Add event listeners for quantity buttons
  const decreaseBtns = document.querySelectorAll(".decrease-btn");
  const increaseBtns = document.querySelectorAll(".increase-btn");

  decreaseBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"));
      if (cart.items[index].quantity > 1) {
        cart.items[index].quantity--;
        updateCartUI();
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

document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.querySelector("#cart-btn");
  const cartModal = document.querySelector("#cart-modal");
  const closeCartBtn = document.querySelector("#close-cart");
  
  // let cart = {
  //   items: []
  // };

  cartBtn.addEventListener("click", function () {
    cartModal.style.display = cartModal.style.display === "block" ? "none" : "block"; // Toggle display
  });

  // Function to update the cart UI

  // Event listener to add products to cart
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
      const price = parseFloat(button.getAttribute("data-price"));
      const productName = button.getAttribute("data-product-name");
      const productImage = button.getAttribute("data-product-image");

      // Check if item already exists in cart
      const existingItem = cart.items.find(item => item.name === productName);
      if (existingItem) {
        existingItem.quantity++; // Increase quantity
      } else {
        cart.items.push({ name: productName, price: price, quantity: 1, image: productImage }); // Add new item
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

document.addEventListener("DOMContentLoaded", function () {
  // Open product detail modal
  function openProductDetail(button) {
    const productName = button.getAttribute('data-product-name');
    const productPrice = button.getAttribute('data-product-price');
    const productDescription = button.getAttribute('data-product-description');
    const productImage = button.getAttribute('data-product-image');

    // Update modal with product details
    document.getElementById('product-title').textContent = productName;
    document.getElementById('product-price').textContent = productPrice;
    document.getElementById('product-description').textContent = productDescription;
    document.getElementById('product-image').src = productImage;

    // Show the modal
    document.getElementById('product-detail-modal').style.display = 'flex';
  }

  // Attach event listeners to all product detail buttons
  const productButtons = document.querySelectorAll('.action-btn[data-product-price]');
  productButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      // Prevent adding to cart when clicking on detail button
      event.stopPropagation();
      openProductDetail(this); // Pass the clicked button to the function
    });
  });

  // Close button functionality
  document.getElementById('close-detail').addEventListener('click', function () {
    document.getElementById('product-detail-modal').style.display = 'none';
  });

  // Function to handle adding the product to the cart
  function addToCart(product) {
    const existingItem = cart.items.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity++; // Increase quantity if already in cart
    } else {
      cart.items.push({ name: product.name, price: product.price, quantity: 1 }); // Add new product
    }

    updateCartUI(); // Update the cart UI
  }
});


document.querySelectorAll('.action-btn[data-product-price]').forEach(button => {
  button.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent event bubbling
    const productName = button.getAttribute('data-product-name');
    const productPrice = parseFloat(button.getAttribute('data-product-price').replace('$', ''));
    const productDescription = button.getAttribute('data-product-description');
    const productImage = button.getAttribute('data-product-image');

    // Populate the modal with the product details
    document.getElementById('product-title').textContent = productName;
    document.getElementById('product-price').textContent = `$${productPrice.toFixed(1)}`;
    document.getElementById('product-description').textContent = productDescription;
    document.getElementById('product-image').src = productImage;

    // Show the product detail modal
    document.getElementById('product-detail-modal').style.display = 'flex';

    // Add functionality to the Add to Cart button in the modal
    document.querySelector('.add-to-cart').onclick = function () {
      const size = document.getElementById('size-select').value; // Get the selected size
      const product = {
        name: `${productName} - Size: ${size}`,
        price: productPrice,
        quantity: 1,
      };
      addToCart(product); // Add product to cart
      document.getElementById('product-detail-modal').style.display = 'none'; // Close modal after adding
    };
  });
});

//Payment method
document.addEventListener("DOMContentLoaded", function () {
  const payButton = document.getElementById("pay-button");

  payButton.addEventListener("click", function () {
    const totalAmount = document.getElementById("cart-total-amount").textContent.replace('$', '');
    const amountInMomoFormat = totalAmount * 10000; // Convert to Momo's currency format (if needed)

    // Show the QR code modal
    showQRCode(amountInMomoFormat);
  });

//   function showQRCode(amount) {
//     const qrCodeContainer = document.createElement('div');
//     qrCodeContainer.id = 'qr-code-container';

//     // Create a wrapper for the QR code and title
//     const qrWrapper = document.createElement('div');
//     qrWrapper.style.textAlign = 'center'; // Center the content
//     qrWrapper.style.marginBottom = '20px'; // Add bottom margin to title

//     // Add title to the QR wrapper
//     const title = document.createElement('h3');
//     title.textContent = "Scan to Pay";
//     title.style.marginBottom = '10px'; // Margin below the title
//     qrWrapper.appendChild(title);

//     // Create QR code
//     const qrcode = new QRCode(qrWrapper, {
//         text: `https://me.momo.vn/OeIRuaTosKIQuqUPuZie`, // Use your MoMo link
//         width: 128,
//         height: 128,
//         colorDark: "#000000",
//         colorLight: "#ffffff",
//         correctLevel: QRCode.CorrectLevel.H,
//     });

//     // Create buttons container
//     const buttonsContainer = document.createElement('div');
//     buttonsContainer.style.display = 'flex';
//     buttonsContainer.style.justifyContent = 'center'; // Center the buttons
//     buttonsContainer.style.marginTop = '10px'; // Margin above buttons

//     // Create checkout button
//     const checkoutButton = document.createElement('button');
//     checkoutButton.textContent = "Checkout";
//     checkoutButton.classList.add('btn', 'btn-primary'); // Use your existing button class
//     checkoutButton.style.backgroundColor = 'green'; // Change the background color to green
//     checkoutButton.style.color = 'white'; // Change text color to white
//     checkoutButton.style.marginRight = '10px'; // Margin to the right of the Checkout button
//     checkoutButton.onclick = function() {
//         // Clear the cart items
//         cart.items = []; // Reset cart items
//         updateCartUI(); // Update the cart UI to reflect changes
//         document.body.removeChild(qrCodeContainer); // Close the QR code modal
//     };

//     // Create close button
//     const closeButton = document.createElement('button');
//     closeButton.textContent = "Close";
//     closeButton.classList.add('btn', 'btn-secondary'); // Use your existing button class
//     closeButton.style.backgroundColor = 'red'; // Change the background color to red
//     closeButton.style.color = 'white'; // Change text color to white
//     closeButton.onclick = function() {
//         document.body.removeChild(qrCodeContainer);
//     };

//     // Append buttons to the container
//     buttonsContainer.appendChild(checkoutButton);
//     buttonsContainer.appendChild(closeButton);

//     // Append QR code and buttons to the QR code container
//     qrCodeContainer.appendChild(qrWrapper);
//     qrCodeContainer.appendChild(buttonsContainer);

//     // Optional: Style the QR code modal
//     qrCodeContainer.style.position = 'fixed';
//     qrCodeContainer.style.top = '50%';
//     qrCodeContainer.style.left = '50%';
//     qrCodeContainer.style.transform = 'translate(-50%, -50%)';
//     qrCodeContainer.style.padding = '20px';
//     qrCodeContainer.style.backgroundColor = 'white';
//     qrCodeContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
//     qrCodeContainer.style.textAlign = 'center'; // Center the QR code and title within the container
//     qrCodeContainer.style.display = 'flex';
//     qrCodeContainer.style.flexDirection = 'column'; // Stack items vertically
//     qrCodeContainer.style.alignItems = 'center'; // Center align items in the flex container

//     // Append to modal
//     document.body.appendChild(qrCodeContainer);
// }
});
