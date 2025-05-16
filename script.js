document.addEventListener("DOMContentLoaded", function () {
  // Cart functionality
  let cart = [];
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const mobileCartCount = document.getElementById("mobileCartCount");
  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const cartToggle = document.getElementById("cartToggle");
  const mobileCartToggle = document.getElementById("mobileCartToggle");
  const closeCart = document.getElementById("closeCart");
  const cartSidebar = document.querySelector(".cart-sidebar");
  // Format price to Persian numerals
  function formatPrice(price) {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  }
  // Convert English numbers to Persian
  function toPersianNum(num) {
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/[0-9]/g, function (w) {
      return persianNumbers[w];
    });
  }
  // Update cart UI
  function updateCart() {
    // Clear cart items
    while (cartItems.firstChild && cartItems.firstChild !== emptyCartMessage) {
      cartItems.removeChild(cartItems.firstChild);
    }
    // Update cart count
    cartCount.textContent = toPersianNum(cart.length);
    mobileCartCount.textContent = toPersianNum(cart.length);
    // Show/hide empty cart message
    if (cart.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      cartTotal.textContent = formatPrice(0);
      return;
    }
    emptyCartMessage.classList.add("hidden");
    // Calculate total
    let total = 0;
    // Add cart items
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const cartItem = document.createElement("div");
      cartItem.className = "flex items-center gap-4 py-4 border-b";
      cartItem.innerHTML = `
      <div class="w-20 h-20 flex-shrink-0">
      <img src="${item.image}" alt="${item.name
        }" class="w-full h-full object-cover object-top rounded">
      </div>
      <div class="flex-1">
      <h4 class="text-sm font-medium">${item.name}</h4>
      <div class="flex justify-between items-center mt-2">
      <span class="text-primary text-sm">${formatPrice(item.price)}</span>
      <div class="flex items-center">
      <button class="decrease-quantity w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary" data-index="${index}">
      <i class="ri-subtract-line"></i>
      </button>
      <span class="w-8 text-center text-sm">${toPersianNum(
          item.quantity
        )}</span>
      <button class="increase-quantity w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary" data-index="${index}">
      <i class="ri-add-line"></i>
      </button>
      </div>
      </div>
      </div>
      <button class="remove-from-cart w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500" data-index="${index}">
      <i class="ri-delete-bin-line"></i>
      </button>
      `;
      cartItems.insertBefore(cartItem, emptyCartMessage);
    });
    // Update total
    cartTotal.textContent = formatPrice(total);
    // Add event listeners to cart item buttons
    document.querySelectorAll(".remove-from-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        removeFromCart(index);
      });
    });
    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        increaseQuantity(index);
      });
    });
    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        decreaseCartItemQuantity(index);
      });
    });
  }
  // Add to cart
  function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      });
    }
    updateCart();
    openCart();
  }
  // Remove from cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }
  // Increase quantity
  function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
  }
  // Decrease cart item quantity
  function decreaseCartItemQuantity(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      removeFromCart(index);
    }
    updateCart();
  }
  // Open cart
  function openCart() {
    cartSidebar.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  // Close cart
  function closeCartSidebar() {
    cartSidebar.classList.remove("open");
    document.body.style.overflow = "";
  }
  // Add event listeners for cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card");
      const productId = productCard.getAttribute("data-product-id");
      const productName = productCard.getAttribute("data-product-name");
      const productPrice = parseInt(
        productCard.getAttribute("data-product-price")
      );
      const productImage = productCard.getAttribute("data-product-image");
      addToCart(productId, productName, productPrice, productImage);
    });
  });
  cartToggle.addEventListener("click", openCart);
  mobileCartToggle.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartSidebar);
  // Initialize cart
  updateCart();
  // Sticky Header
  const header = document.querySelector(".sticky-header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  // Back to Top Button
  const backToTopButton = document.querySelector(".back-to-top");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  // Mobile Menu Toggle
  const hamburger = document.querySelectorAll(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  hamburger.forEach(function (btn) {
    btn.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
      hamburger.forEach((h) => h.classList.toggle("open"));
      document.body.style.overflow = mobileMenu.classList.contains("open")
        ? "hidden"
        : "";
    });
  });
  // Tab Buttons
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
  // Cookie Consent
  const cookieConsent = document.getElementById("cookieConsent");
  const acceptCookies = document.getElementById("acceptCookies");
  const declineCookies = document.getElementById("declineCookies");
  if (localStorage.getItem("cookiesAccepted") === "true") {
    cookieConsent.style.display = "none";
  }
  acceptCookies.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    cookieConsent.style.display = "none";
  });
  declineCookies.addEventListener("click", function () {
    cookieConsent.style.display = "none";
  });
  // Size Guide Modal
  const sizeGuideModal = document.getElementById("sizeGuideModal");
  const openSizeGuide = document.getElementById("openSizeGuide");
  const closeSizeGuide = document.getElementById("closeSizeGuide");
  const floatingSizeGuide = document.getElementById("floatingSizeGuide");
  function openSizeGuideModal() {
    sizeGuideModal.classList.remove("hidden");
    sizeGuideModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  function closeSizeGuideModal() {
    sizeGuideModal.classList.add("hidden");
    sizeGuideModal.classList.remove("flex");
    document.body.style.overflow = "";
  }
  if (openSizeGuide) {
    openSizeGuide.addEventListener("click", openSizeGuideModal);
  }
  if (closeSizeGuide) {
    closeSizeGuide.addEventListener("click", closeSizeGuideModal);
  }
  if (floatingSizeGuide) {
    floatingSizeGuide.addEventListener("click", openSizeGuideModal);
  }
  // Quick View Modal
  const quickViewModal = document.getElementById("quickViewModal");
  const quickViewButtons = document.querySelectorAll(".quick-view");
  const closeQuickView = document.getElementById("closeQuickView");
  function openQuickViewModal() {
    quickViewModal.classList.remove("hidden");
    quickViewModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  function closeQuickViewModal() {
    quickViewModal.classList.add("hidden");
    quickViewModal.classList.remove("flex");
    document.body.style.overflow = "";
  }
  quickViewButtons.forEach(function (button) {
    button.addEventListener("click", openQuickViewModal);
  });
  if (closeQuickView) {
    closeQuickView.addEventListener("click", closeQuickViewModal);
  }
  // Quick view quantity input controls
  const quickViewDecreaseBtn = document.getElementById("decreaseQuantity");
  const quickViewIncreaseBtn = document.getElementById("increaseQuantity");
  const quickViewQuantityInput = document.getElementById("quantity");
  if (quickViewDecreaseBtn && quickViewIncreaseBtn && quickViewQuantityInput) {
    quickViewDecreaseBtn.addEventListener("click", function () {
      const currentValue = parseInt(quickViewQuantityInput.value);
      if (currentValue > 1) {
        quickViewQuantityInput.value = currentValue - 1;
      }
    });
    increaseQuantity.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
    quantityInput.addEventListener("change", function () {
      if (this.value < 1) {
        this.value = 1;
      }
    });
  }
  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === sizeGuideModal) {
      closeSizeGuideModal();
    }
    if (event.target === quickViewModal) {
      closeQuickViewModal();
    }
    if (event.target === cartSidebar) {
      closeCartSidebar();
    }
  });
});
