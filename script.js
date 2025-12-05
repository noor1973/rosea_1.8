// تحميل المنتجات عند فتح الموقع
window.onload = function() {
  loadProducts();
  loadCart();
};

// عرض/إخفاء فورم الإضافة
function toggleForm() {
  let f = document.getElementById("form");
  f.style.display = (f.style.display === "none") ? "block" : "none";
}

// إضافة منتج جديد
function addProduct() {
  let name = document.getElementById("pName").value;
  let price = document.getElementById("pPrice").value;
  let colors = document.getElementById("pColors").value.split(",");
  let imgInput = document.getElementById("pImg").files[0];

  if (!name  !price  !imgInput) {
    alert("يجب إدخال الاسم والسعر والصورة");
    return;
  }

  let reader = new FileReader();
  reader.onload = function(e) {
    let imgURL = e.target.result;

    let product = {
      name,
      price,
      colors,
      img: imgURL
    };

    let products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    loadProducts();
    alert("✔️ تم إضافة المنتج");
  };

  reader.readAsDataURL(imgInput);
}

// تحميل المنتجات
function loadProducts() {
  let productsDiv = document.getElementById("products");
  if (!productsDiv) return;

  productsDiv.innerHTML = "";
  let products = JSON.parse(localStorage.getItem("products") || "[]");

  products.forEach((p, i) => {
    let card = `
      <div class="product">
        <img src="${p.img}" width="100%">
        <h3>${p.name}</h3>
        <p>السعر: ${p.price} د.ع</p>
        <p>الألوان: ${p.colors.join(" / ")}</p>
        <button onclick="addToCart(${i})" style="background:#2196F3; color:white;">إضافة للسلة</button>
      </div>
    `;
    productsDiv.innerHTML += card;
  });
}

// إضافة للسلة
function addToCart(index) {
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart.push(products[index]);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("🛒 تمت الإضافة إلى السلة");
}

// تحميل السلة
function loadCart() {
  let cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cartDiv.innerHTML = "";
  cart.forEach((p, i) => {
    cartDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}" width="100%">
        <h3>${p.name}</h3>
        <p>السعر: ${p.price} د.ع</p>
        <button class="remove-btn" onclick="removeCartItem(${i})">حذف</button>
      </div>
    `;
  });
}

// حذف عنصر من السلة
function removeCartItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// مسح السلة
function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
}
