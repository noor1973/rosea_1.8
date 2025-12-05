// fetch products from server and render
const productsEl = document.getElementById('products');
const template = document.getElementById('product-template');
const cartBtn = document.getElementById('cart-btn');
const cartPanel = document.getElementById('cart-panel');
const cartCount = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');

function saveCart() {
  localStorage.setItem('cart_v1', JSON.stringify(cart));
  renderCart();
}

function renderProducts() {
  productsEl.innerHTML = '';
  products.forEach(p => {
    const node = template.content.cloneNode(true);
    node.querySelector('.prod-img').src = p.images && p.images[0] ? p.images[0] : '/static/placeholder.jpg';
    node.querySelector('.prod-title').textContent = p.title;
    node.querySelector('.prod-desc').textContent = p.description || '';
    node.querySelector('.prod-price').textContent = p.price.toFixed(2) + ' $';
    const sel = node.querySelector('.color-select');
    p.colors.forEach(c => {
      const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
    const qty = node.querySelector('.qty-input');
    node.querySelector('.add-to-cart').addEventListener('click', () => {
      const color = sel.value;
      const q = Math.max(1, parseInt(qty.value || '1'));
      addToCart(p.id, color, q);
    });
    productsEl.appendChild(node);
  });
}

function addToCart(productId, color, qty) {
  const existing = cart.find(i => i.productId === productId && i.color === color);
  if (existing) existing.qty += qty;
  else cart.push({ productId, color, qty });
  saveCart();
  alert('تمت الإضافة إلى السلة');
}

function renderCart() {
  cartCount.textContent = cart.reduce((s,i) => s + i.qty, 0);
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const p = products.find(x => x.id === item.productId);
    if (!p) return;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${p.images && p.images[0] ? p.images[0] : '/static/placeholder.jpg'}" />
      <div style="flex:1">
        <div><strong>${p.title}</strong></div>
        <div>اللون: ${item.color}</div>
        <div>السعر: ${p.price.toFixed(2)}$</div>
      </div>
      <div>
        <input type="number" min="1" value="${item.qty}" data-idx="${idx}" class="cart-qty" />
        <div><button class="remove" data-idx="${idx}">حذف</button></div>
      </div>
    `;
    cartItemsEl.appendChild(div);
    total += p.price * item.qty;
  });
  cartTotalEl.textContent = total.toFixed(2);

  // event listeners for qty change and remove
  cartItemsEl.querySelectorAll('.cart-qty').forEach(inp => {
    inp.addEventListener('change', e => {
      const idx = parseInt(e.target.dataset.idx,10);
      const v = Math.max(1, parseInt(e.target.value || '1'));
      cart[idx].qty = v;
      saveCart();
    });
  });
  cartItemsEl.querySelectorAll('.remove').forEach(b => {
    b.addEventListener('click', e => {
      const idx = parseInt(e.target.dataset.idx,10);
      cart.splice(idx,1);
      saveCart();
    });
  });
}

cartBtn.addEventListener('click', () => {
  cartPanel.classList.toggle('hidden');
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) { alert('السلة فارغة'); return; }
  const order = {
    items: cart,
    createdAt: new Date().toISOString()
  };
  // إرسال مُحاكى إلى السيرفر
  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  }).then(r => r.json()).then(data => {
    alert('تم ارسال الطلب (محاكاة).');
    cart = [];
    saveCart();
  }).catch(err => {
    console.error(err);
    alert('حدث خطأ أثناء إرسال الطلب');
  });
});

// init
fetch('/api/products').then(r => r.json()).then(data => {
  products = data;
  renderProducts();
  renderCart();
}).catch(err => {
  console.error('Failed to load products', err);
  products = [];
});
