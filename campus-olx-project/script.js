// --- 🛠️ Core Utilities & State Management ---

const PRODUCTS_KEY = 'campus_olx_products';
const USERS_KEY = 'campus_olx_users';
const CURRENT_USER_KEY = 'campus_olx_current_user';

// --- 📦 Initial Sample Data ---
const initialProducts = [
  {
    id: 1,
    title: "Data Structures & Algorithms Notes",
    desc: "Handwritten notes for CS students, covers all major topics.",
    price: "150",
    category: "Notes",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
    date: new Date().toISOString()
  },
  {
    id: 2,
    title: "Engineering Mathematics Textbook",
    desc: "S. Chand publications, latest edition. Almost new condition.",
    price: "450",
    category: "Books",
    img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    date: new Date().toISOString()
  },
  {
    id: 3,
    title: "Scientific Calculator (Casio)",
    desc: "Works perfectly, used for only 2 semesters.",
    price: "800",
    category: "Equipment",
    img: "https://images.unsplash.com/photo-1594672234647-5f714a9be9ca?auto=format&fit=crop&q=80&w=400",
    date: new Date().toISOString()
  },
  {
    id: 4,
    title: "Drawing Board & Clips",
    desc: "Large size board, essential for first-year engineering.",
    price: "300",
    category: "Stationery",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400",
    date: new Date().toISOString()
  },
  {
    id: 5,
    title: "Lab Coat (White) - Size M",
    desc: "Used only for Chemistry practicals. Clean and ironed.",
    price: "200",
    category: "Equipment",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    date: new Date().toISOString()
  },
  {
    id: 6,
    title: "Python Programming for Beginners",
    desc: "Great book for learning Python, very easy to understand.",
    price: "350",
    category: "Books",
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
    date: new Date().toISOString()
  }
];

// --- 🚀 Initialization ---
function initApp() {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  }
  
  // Update Navbar based on login status
  updateNavbar();
  
  // Route-specific logic (Vercel-friendly)
  const path = window.location.pathname.toLowerCase();
  
  if (path === '/' || path.includes('index')) {
    renderHomeProducts();
  } else if (path.includes('resources')) {
    renderAllProducts();
  } else if (path.includes('product')) {
    renderProductDetail();
  }
}

// --- 🧭 Navigation & UI ---
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  const loginLink = document.querySelector('a[href="login.html"]');
  const registerLink = document.querySelector('a[href="register.html"]');
  
  if (user && loginLink && registerLink) {
    loginLink.textContent = 'Profile';
    loginLink.href = 'profile.html';
    registerLink.textContent = 'Logout';
    registerLink.href = '#';
    registerLink.onclick = logout;
  }
}

function logout(e) {
  e.preventDefault();
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'index.html';
}

// --- 🛍️ Product Rendering ---
function renderHomeProducts() {
  const list = document.getElementById('product-list');
  if (!list) return;
  
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  const latest = products.slice(-4).reverse(); // Get last 4
  
  if (latest.length === 0) {
    list.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No products available yet.</p>";
    return;
  }
  
  list.innerHTML = latest.map(p => createProductCard(p)).join('');
}

function renderAllProducts(filter = '') {
  const list = document.getElementById('listings') || document.getElementById('product-list');
  if (!list) return;
  
  let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  
  if (filter) {
    products = products.filter(p => 
      p.title.toLowerCase().includes(filter.toLowerCase()) || 
      p.category.toLowerCase().includes(filter.toLowerCase())
    );
  }
  
  if (products.length === 0) {
    list.innerHTML = `<p style='grid-column: 1/-1; text-align:center;'>No products found matching "${filter}".</p>`;
    return;
  }
  
  list.innerHTML = products.map(p => createProductCard(p)).join('');
}

function createProductCard(p) {
  return `
    <div class="card" onclick="viewProduct(${p.id})">
      <img src="${p.img || 'images/sample.jpg'}" class="product-img" alt="${p.title}">
      <div class="card-content">
        <span class="category">${p.category || 'General'}</span>
        <h4>${p.title}</h4>
        <p class="small">${p.desc ? p.desc.substring(0, 60) + '...' : ''}</p>
        <div class="price">₹${p.price}</div>
      </div>
    </div>
  `;
}

function viewProduct(id) {
  localStorage.setItem('current_product_id', id);
  window.location.href = 'product.html';
}

// --- 🔍 Search Logic ---
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    const q = searchInput.value;
    const isHome = window.location.pathname === '/' || window.location.pathname.toLowerCase().includes('index');
    
    if (isHome) {
      window.location.href = `resources.html?q=${encodeURIComponent(q)}`;
    } else {
      renderAllProducts(q);
    }
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });
}

// Handle search query from URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
if (query && window.location.pathname.toLowerCase().includes('resources')) {
  if (searchInput) searchInput.value = query;
  renderAllProducts(query);
}

// --- 📝 Product Creation ---
function addProductFormHandler(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const desc = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value;
  const imgInput = document.getElementById('imageInput');
  
  let img = 'images/sample.jpg';
  
  // Simple check for image (in real app would use FileReader or upload)
  if (imgInput && imgInput.files && imgInput.files[0]) {
    // For now, use a placeholder or fake path as we can't truly upload here easily
    img = URL.createObjectURL(imgInput.files[0]);
  }

  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  const newProduct = {
    id: Date.now(),
    title,
    desc,
    price,
    category,
    img,
    date: new Date().toISOString()
  };
  
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  
  alert('Product listed successfully!');
  window.location.href = 'resources.html';
}

// --- 📄 Product Detail Rendering ---
function renderProductDetail() {
  const id = localStorage.getItem('current_product_id');
  if (!id) return;
  
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  const p = products.find(item => item.id == id);
  
  if (!p) return;
  
  const detailContainer = document.getElementById('product-detail');
  if (detailContainer) {
    detailContainer.innerHTML = `
      <div style="display:flex; gap:40px; margin-top:40px; flex-wrap:wrap;">
        <div style="flex:1; min-width:300px;">
          <img src="${p.img || 'images/sample.jpg'}" style="width:100%; border-radius:15px; box-shadow:var(--card-shadow);">
        </div>
        <div style="flex:1; min-width:300px;">
          <span class="category" style="background:#e0f2f1; color:var(--accent-color); padding:5px 12px; border-radius:20px; font-weight:bold;">${p.category}</span>
          <h1 style="margin-top:15px; color:var(--primary-color);">${p.title}</h1>
          <p style="font-size:1.5rem; font-weight:bold; color:var(--accent-color); margin:20px 0;">₹${p.price}</p>
          <div style="border-top:1px solid #eee; border-bottom:1px solid #eee; padding:20px 0; margin:20px 0;">
            <h3>Description</h3>
            <p style="color:#666; margin-top:10px;">${p.desc}</p>
          </div>
          <button class="btn-block" onclick="openChat()">Contact Seller</button>
          <button class="btn-block" style="background:#f0f0f0; color:#333; margin-top:10px;" onclick="window.history.back()">Go Back</button>
        </div>
      </div>
    `;
  }
}

// --- 💬 Chat Functionality ---
function openChat() {
  const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  if (!user) {
    alert('Please login to chat with the seller.');
    window.location.href = 'login.html';
    return;
  }

  const modal = document.getElementById('chatModal');
  if (modal) {
    modal.style.display = 'flex';
    loadMessages();
    
    // Setup enter key listener for chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput && !chatInput.dataset.listener) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
      chatInput.dataset.listener = 'true';
    }
  }
}

function closeChat() {
  const modal = document.getElementById('chatModal');
  if (modal) modal.style.display = 'none';
}

function loadMessages() {
  const productId = localStorage.getItem('current_product_id');
  const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  const messagesDiv = document.getElementById('chatMessages');
  
  if (!productId || !user || !messagesDiv) return;

  const chatKey = `chat_${user.email}_${productId}`;
  const messages = JSON.parse(localStorage.getItem(chatKey)) || [];

  if (messages.length === 0) {
    // Add an initial automated message from the "seller"
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const p = products.find(item => item.id == productId);
    
    messages.push({
      sender: 'seller',
      text: `Hi! I'm the seller of "${p ? p.title : 'this item'}". How can I help you?`,
      time: new Date().toISOString()
    });
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }

  messagesDiv.innerHTML = messages.map(m => `
    <div class="message ${m.sender === 'user' ? 'sent' : 'received'}">
      ${m.text}
    </div>
  `).join('');
  
  // Scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const productId = localStorage.getItem('current_product_id');
  const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  if (!productId || !user) return;

  const chatKey = `chat_${user.email}_${productId}`;
  const messages = JSON.parse(localStorage.getItem(chatKey)) || [];

  messages.push({
    sender: 'user',
    text: text,
    time: new Date().toISOString()
  });

  localStorage.setItem(chatKey, JSON.stringify(messages));
  input.value = '';
  loadMessages();

  // Simulate a response from the seller after 1 second
  setTimeout(() => {
    messages.push({
      sender: 'seller',
      text: "Thanks for your interest! Are you available to meet on campus tomorrow?",
      time: new Date().toISOString()
    });
    localStorage.setItem(chatKey, JSON.stringify(messages));
    loadMessages();
  }, 1000);
}

// Run init
document.addEventListener('DOMContentLoaded', initApp);
