// Run after the DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Your code here runs after DOM is ready
  toggleAuthButtons();
  loadProducts();
  loadUserProfile(localStorage.getItem("userName"));
  updateCartBadge();
  loadUserAddress();
  updateOrderTotal();
  document.querySelector(".cart-btn").addEventListener("click", () => {
    window.location.href = "cart.html";
  });
  const savedCart = localStorage.getItem("cart");
  // let cart;
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  renderCartItems(cart);

  const checkoutBtn = document.getElementById("checkout-btn");
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  if (loggedIn) {
    if (checkoutBtn) {
      checkoutBtn.textContent = "Place Order";
      // Remove href to disable navigation
      checkoutBtn.removeAttribute("href");
    }
  } else {
    if (checkoutBtn) {
      checkoutBtn.textContent = "Login to Place Order";
      checkoutBtn.href = "login.html"; // Change to your login page URL
    }
  }

  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) {
    return;
  }

  const product = await fetchProductDetails(productId);
  updateProductDetails(product);
});

document.getElementById("add-to-cart-btn").addEventListener("click", () => {
  // Get product ID: If your product ID is known globally or via data attributes, use it here; example:
  const productId = new URLSearchParams(window.location.search).get("id");
  console.log(productId);

  // Get quantity from the input
  const quantityInput = document.querySelector(".qty-input");
  const quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity < 1) {
    alert("Please enter a valid quantity");
    return;
  }

  // Fetch existing cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already in cart
  const existingProductIndex = cart.findIndex((item) => item.id === productId);

  if (existingProductIndex !== -1) {
    // Increase quantity
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Add new product (you may add product details as well)
    cart.push({ id: productId, quantity });
  }

  // Save updated cart
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update badge count
  updateCartBadge();
});

async function fetchProductDetails(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    if (!response.ok) throw new Error("Product not found");
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function updateProductDetails(product) {
  if (!product) {
    document.getElementById("product-title").textContent = "Product not found";
    // Optionally hide sections or show error message
    return;
  }

  document.getElementById("product-image").src =
    product.image_url || "assets/img/product/default.png";
  document.getElementById("product-image").alt = product.name;

  document.getElementById("product-title").textContent = product.name;
  document.getElementById("product-description").textContent =
    product.description || "";
  document.getElementById(
    "product-price"
  ).textContent = `Rs ${product.price.toFixed(2)}`;
  const oldPrice = document.getElementById("product-old-price");
  if (product.old_price && product.old_price > product.price) {
    oldPrice.textContent = `Rs ${product.old_price.toFixed(2)}`;
    oldPrice.style.display = "inline";
  } else {
    oldPrice.style.display = "none";
  }

  // Update availability
  const availabilityEl = document.querySelector(".stock");
  if (product.available == 1) {
    availabilityEl.textContent = "In Stock";
    availabilityEl.classList.add("in-stock");
    availabilityEl.classList.remove("out-of-stock");
  } else {
    availabilityEl.textContent = "Out of Stock";
    availabilityEl.classList.add("out-of-stock");
    availabilityEl.classList.remove("in-stock");
  }

  // Update SKU
  const skuEl = document.querySelector(".sku");
  skuEl.textContent = product.sku || "";

  // Update category links
  const catEl = document.querySelector(".posted_in a");
  catEl.textContent = product.category || "Uncategorized";
  catEl.href = `shop.html?category=${encodeURIComponent(
    product.category || ""
  )}`;

  // Update tags (may require HTML rebuild if multiple)
  const tagsEl = document.querySelector(".product_meta span:last-child");
  if (product.tags && product.tags.length > 0) {
    tagsEl.innerHTML =
      "Tags: " +
      product.tags
        .map(
          (tag) =>
            `<a href="shop.html?tag=${encodeURIComponent(tag)}">${tag}</a>`
        )
        .join(" ");
  } else {
    tagsEl.textContent = "Tags: -";
  }
}

function logoutUser() {
  // localStorage.removeItem("userName");
  // localStorage.removeItem("isAdmin");
  localStorage.clear();
  window.location.href = "login.html";
}

// Call this function after the page loads
function toggleAuthButtons() {
  // Check for a login marker, e.g., 'loggedIn' or 'username'
  const isLoggedIn = localStorage.getItem("loggedIn"); // or 'username', depending on your system
  if (isLoggedIn) {
    // Show Profile, Hide Login
    document.getElementById("profileBtn").style.display = "inline-block";
    document.getElementById("loginBtn").style.display = "none";
  } else {
    // Show Login, Hide Profile
    document.getElementById("profileBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "inline-block";
  }
}

async function loadProducts(category = "", page = 1, pageSize = 8) {
  try {
    let apiUrl = `http://localhost:3000/api/products?page=${page}&pageSize=${pageSize}`;
    if (category) {
      apiUrl += `&category=${encodeURIComponent(category.category)}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    const products = data.products;

    const totalItems = data.totalItems;
    const currentPage = data.page; // Rename to avoid conflict
    const currentPageSize = data.pageSize; // Rename to avoid conflict

    updateResultCount(totalItems, currentPage, currentPageSize);
    renderPagination(data.totalPages, currentPage);

    const container = document.getElementById("product-container");
    if (container) {
      container.innerHTML = ""; // Clear existing content
      products.forEach((product) => {
        const productHTML = `
      <div class="col-xl-3 col-lg-4 col-sm-6 mt-4">
        <div class="th-product product-grid">
          <div class="product-img">
            <div class="food-mask" data-mask-src="assets/img/bg/menu-1-msk-bg.png"></div>
            <a href="#">
              <img src="${
                product.image_url || "assets/img/product/default.png"
              }" alt="Product Image" />
            </a>
            <div class="actions">
              <a href="#" class="icon-btn add-to-cart-btn" data-product-id="${
                product.id
              }" title="Add to Cart">
                <i class="far fa-cart-plus"></i>
              </a>
            </div>
          </div>
          <div class="product-content">
            <div class="woocommerce-product-rating">
              <span class="count"></span>
              <div class="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                <span>Rated <strong class="rating">5.00</strong> out of 5 based on <span class="rating">1</span> customer rating</span>
              </div>
            </div>
            <h3 class="product-title">
              <a href="#">${product.name}</a>
            </h3>
            <h5 class="product-title">
              <spa>${product.description}</spa>
            </h5>
            <span class="price">Rs ${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
        container.insertAdjacentHTML("beforeend", productHTML);
      });
    }

    attachAddToCartListeners(products);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function updateResultCount(totalItems, page, pageSize) {
  const start = (page - 1) * pageSize + 1;
  let end = page * pageSize;
  if (end > totalItems) end = totalItems;

  const countText = `Showing ${start}–${end} of ${totalItems} results`;
  const result = document.querySelector(".woocommerce-result-count");
  if (result) {
    result.textContent = countText;
  }
}

function renderPagination(totalPages, currentPage) {
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = ""; // Clear previous page numbers

    // Previous button
    const prevClass = currentPage === 1 ? "disabled" : "";
    pagination.insertAdjacentHTML(
      "beforeend",
      `
    <li class="${prevClass}">
      <a href="#" data-page="${currentPage - 1}" aria-label="Previous">
        <i class="fas fa-arrow-left"></i>
      </a>
    </li>
  `
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? "active" : "";
      pagination.insertAdjacentHTML(
        "beforeend",
        `
      <li class="${activeClass}">
        <a href="#" data-page="${i}">${i}</a>
      </li>
    `
      );
    }

    // Next button
    const nextClass = currentPage === totalPages ? "disabled" : "";
    pagination.insertAdjacentHTML(
      "beforeend",
      `
    <li class="${nextClass}">
      <a href="#" data-page="${currentPage + 1}" aria-label="Next">
        <i class="fas fa-arrow-right"></i>
      </a>
    </li>
  `
    );

    // Add click event listeners to pagination links
    pagination.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = parseInt(e.currentTarget.getAttribute("data-page"));
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          loadProducts(undefined, page); // Pass default category and new page number
        }
      });
    });
  }
}

function addToCart(product) {
  // Get current cart or empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already in cart
  const index = cart.findIndex((item) => item.id === product.id);
  if (index !== -1) {
    // Increase quantity
    cart[index].quantity += 1;
  } else {
    // Add new product with quantity 1
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

function attachAddToCartListeners(products) {
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const productId = parseInt(btn.getAttribute("data-product-id"));
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      addToCart(product);

      updateCartBadge(); // Update badge immediately

      alert(`${product.name} added to cart!`); // Optional confirmation
    });
  });
}

function renderCartItems(cartItems) {
  const tbody = document.getElementById("cart-items-body");
  if (tbody) {
    tbody.innerHTML = ""; // Clear existing rows
    cartItems.forEach((item) => {
      const total = item.price * item.quantity;

      const row = `
        <tr class="cart_item" data-id="${item.id}">
          <td data-title="Product">
            <a class="cart-productimage" href="shop-details.html">
              <img width="91" height="91" src="${item.image_url}" alt="Image" />
            </a>
          </td>
          <td data-title="Name">
            <a class="cart-productname" href="shop-details.html">${
              item.name
            }</a>
          </td>
          <td data-title="Price">
            <span class="amount"><bdi><span>Rs&nbsp;</span>${item.price.toFixed(
              2
            )}</bdi></span>
          </td>
          <td data-title="Quantity">
            <div class="quantity">
              <button class="quantity-minus qty-btn" onclick="updateQuantity(${
                item.id
              }, -1)">-</button>
              <input type="number" class="qty-input" value="${
                item.quantity
              }" min="1" max="99" onchange="setQuantity(${
        item.id
      }, this.value)" />
              <button class="quantity-plus qty-btn" onclick="updateQuantity(${
                item.id
              }, 1)">+</button>
            </div>
          </td>
          <td data-title="Total">
            <span class="amount"><bdi><span>Rs&nbsp;</span>${total.toFixed(
              2
            )}</bdi></span>
          </td>
          <td data-title="Remove">
            <a href="#" class="remove" onclick="removeFromCart(${
              item.id
            }); return false;">
              <i class="fal fa-trash-alt"></i>
            </a>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity = Math.min(Math.max(item.quantity + change, 1), 99);
  saveCart();
  refreshCartUI();
}

function setQuantity(productId, qty) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  const quantity = parseInt(qty);
  if (!isNaN(quantity) && quantity >= 1 && quantity <= 99) {
    item.quantity = quantity;
    saveCart();
    refreshCartUI();
  }
}

function removeFromCart(productId) {
  const index = cart.findIndex((i) => i.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
    refreshCartUI();
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart)); // Save cart persistently
}

function refreshCartUI() {
  renderCartItems(cart); // Renders cart rows with current cart data
  updateCartBadge(); // Updates badge count display
  updateOrderTotal(); // Updates total price in cart totals section
}

function updateCartBadge() {
  // const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // const badge = document.querySelector(".cart-btn .badge");

  // const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // if (totalQuantity > 0) {
  //   badge.textContent = totalQuantity;
  //   badge.style.display = "inline-block";
  // } else {
  //   badge.style.display = "none"; // Hide badge if cart empty
  // }
  const badge = document.querySelector(".cart-btn .badge");
  if (!badge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    badge.textContent = totalQuantity;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

function updateOrderTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalElement = document.getElementById("order-total-amount");
  if (totalElement) {
    totalElement.innerHTML = `<bdi><span>Rs&nbsp;</span>${totalAmount.toFixed(
      2
    )}</bdi>`;
  }
}

async function loadUserProfile(username) {
  try {
    if (username) {
      const response = await fetch(
        `http://localhost:3000/api/user/username/${encodeURIComponent(
          username
        )}`
      );
      if (!response.ok) throw new Error("User not found");
      const data = await response.json();
      const user = data.user;
      localStorage.setItem("userInfo", JSON.stringify(user));

      // Populate fields if data exists
      if (user) {
        document.getElementById("full-name").value = user.name || "";
        document.getElementById("street-address").value =
          user.street_address || "";
        document.getElementById("address-line-2").value =
          user.address_line_2 || "";
        document.getElementById("city").value = user.city || "";
        document.getElementById("country").value = user.country || "";
        document.getElementById("postal-code").value = user.postal_code || "";
        document.getElementById("username").value = user.username || "";
        document.getElementById("phone-number").value = user.phone_number || "";
      }
    }
  } catch (error) {
    console.error("Failed to load user profile:", error);
  }
}

async function updateUser() {
  const username = document.getElementById("username").value; // user identifier for API

  // Gather form data
  const updates = {
    name: document.getElementById("full-name").value.trim(),
    street_address: document.getElementById("street-address").value.trim(),
    address_line_2: document.getElementById("address-line-2").value.trim(),
    city: document.getElementById("city").value.trim(),
    country: document.getElementById("country").value.trim(),
    postal_code: document.getElementById("postal-code").value.trim(),
    phone_number: document.getElementById("phone-number").value.trim(),
  };

  console.log(updates);
  try {
    const response = await fetch(`http://localhost:3000/api/user/${username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Update failed");
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }
}

async function loadUserAddress() {
  try {
    const user = JSON.parse(localStorage.userInfo);
    if (!user) {
      document.getElementById(
        "order-address"
      ).innerHTML = `<a href="profile.html" class="th-btn style3 style-radius">Add Address In Profile</a>`;
      return;
    }

    // Construct full address string from available fields
    const addressParts = [
      user.street_address,
      user.address_line_2,
      user.city,
      user.state,
      user.postal_code,
      user.country,
      user.phone_number,
    ].filter(Boolean); // filter out undefined or empty parts

    const fullAddress = addressParts.join(", ");
    if (fullAddress) {
      document.getElementById("order-address").textContent = fullAddress;
      localStorage.setItem("fullAddress", fullAddress);
    } else {
      document.getElementById(
        "order-address"
      ).innerHTML = `<a href="profile.html" class="th-btn style3 style-radius">Add Address In Profile</a>`;
    }
  } catch (error) {
    console.error("Failed to load user address:", error);
    document.getElementById("order-address").textContent =
      "Error loading address";
  }
}
