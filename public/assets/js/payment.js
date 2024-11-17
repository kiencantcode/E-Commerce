document.addEventListener("DOMContentLoaded", function () {
    const payButton = document.getElementById("pay-button");
    const qrModal = document.getElementById("qr-modal");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeBtn = document.getElementById("close-btn");
  
    // Payment button click event
    payButton.addEventListener("click", function () {
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const phone = document.getElementById("phone").value;
  
      // Validate if all fields are filled
      if (name && address && phone) {
        // Generate QR code
        const qrCodeContainer = document.getElementById("qr-code");
        const qrData = {
          name: name,
          address: address,
          phone: phone,
          amount: "100", // Example amount, you can calculate dynamically
          paymentLink: "https://me.momo.vn/OeIRuaTosKIQuqUPuZie" // Example payment link
        };
        
        // Create the QR code
        QRCode.toCanvas(qrCodeContainer, JSON.stringify(qrData), function (error) {
          if (error) console.error(error);
        });
  
        // Show the QR code modal
        qrModal.style.display = "flex";
      } else {
        alert("Please fill in all fields.");
      }
    });
  
    // Close modal
    closeBtn.addEventListener("click", function () {
      qrModal.style.display = "none";
    });
  
    // Checkout button click event
    checkoutBtn.addEventListener("click", function () {
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const phone = document.getElementById("phone").value;
  
      // Send data to the server (you can use fetch to make an API call)
      const orderData = {
        name: name,
        address: address,
        phone: phone,
        amount: "100" // Example amount
      };
  
      fetch("http://localhost:3000/saveOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      })
      .then(response => response.json())
      .then(data => {
        alert("Order placed successfully!");
        qrModal.style.display = "none"; // Hide modal after checkout
      })
      .catch(error => {
        console.error("Error:", error);
        alert("There was an error processing your order.");
      });
    });
  });
  