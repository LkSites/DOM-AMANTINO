// Produtos da Pizzaria Dom Amantino
const products = [
    {
        id: 1,
        name: "Calabresa Especial Dom Amantino",
        category: "Pizzas Salgadas",
        price: 58.90,
        description: "Molho artesanal, mussarela de cura, calabresa moída selecionada, cebola roxa marinada e azeitonas pretas.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80"
    },
    {
        id: 2,
        name: "Margherita Tradizionale",
        category: "Pizzas Salgadas",
        price: 54.90,
        description: "Molho de tomate italiano, mussarela de búfala fresco, rodelas de tomate e manjericão fresco colhido no dia.",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80"
    },
    {
        id: 3,
        name: "Pepperoni Supremo",
        category: "Pizzas Salgadas",
        price: 64.90,
        description: "Generosa camada de pepperoni artesanal levemente picante, mussarela especial e orégano fresco.",
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=80"
    },
    {
        id: 4,
        name: "Quatro Queijos Nobre",
        category: "Pizzas Salgadas",
        price: 62.90,
        description: "Combinação harmoniosa de Mussarela, Gorgonzola cremoso, Catupiry original e Parmesão gratinado.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"
    },
    {
        id: 5,
        name: "Frango com Catupiry",
        category: "Pizzas Salgadas",
        price: 59.90,
        description: "Peito de frango desfiado e temperado com ervas finas, coberto com o autêntico Catupiry.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"
    },
    {
        id: 6,
        name: "Pizza Chocolate com Morango",
        category: "Pizzas Doces",
        price: 49.90,
        description: "Base crocantinha coberta com ganache de chocolate ao leite e morangos frescos fatiados.",
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80"
    },
    {
        id: 7,
        name: "Pizza Banana com Canela",
        category: "Pizzas Doces",
        price: 45.90,
        description: "Brotinho doce com creme de leite, bananas flambadas, açúcar refinado e canela em pó.",
        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&q=80"
    },
    {
        id: 8,
        name: "Refrigerante Guaraná Antarctica 2L",
        category: "Bebidas",
        price: 14.00,
        description: "Garrafa de 2 Litros geladíssima.",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80"
    },
    {
        id: 9,
        name: "Coca-Cola Original 2L",
        category: "Bebidas",
        price: 15.00,
        description: "Garrafa de 2 Litros trincando de gelada.",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80"
    },
    {
        id: 10,
        name: "Petit Gâteau com Sorvete",
        category: "Sobremesas",
        price: 24.90,
        description: "Bolo quente de chocolate com recheio cremoso acompanhado de uma bola de sorvete de creme.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80"
    }
];

let cart = JSON.parse(localStorage.getItem('dom_amantino_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';

const formatMoney = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const checkoutForm = document.getElementById('checkoutForm');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function renderProducts() {
    const filtered = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    productGrid.innerHTML = filtered.map(product => `
        <div class="bg-white rounded-3xl overflow-hidden border border-dom-brown/10 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden aspect-[4/3] bg-dom-cream">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/500x350/F4EAD5/3A2618?text=Dom+Amantino'">
                <span class="absolute top-3 left-3 bg-dom-brown/80 backdrop-blur-md text-dom-cream text-xs font-bold px-3 py-1 rounded-full border border-dom-gold/40">${product.category}</span>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-serif font-bold text-dom-brown text-xl mb-2 group-hover:text-dom-red transition-colors">${product.name}</h3>
                <p class="text-gray-500 text-xs leading-relaxed mb-4 flex-grow">${product.description}</p>
                <div class="mt-auto pt-4 flex items-center justify-between border-t border-dom-brown/10">
                    <div>
                        <span class="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Valor</span>
                        <span class="text-xl font-bold text-dom-brown">${formatMoney(product.price)}</span>
                    </div>
                    <button onclick="addToCart(${product.id})" class="px-4 py-2.5 bg-dom-red hover:bg-dom-redDark text-white rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5 font-bold text-xs">
                        <i data-lucide="plus" class="w-4 h-4"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" adicionado ao pedido!`);
}

function updateQuantity(productId, change) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('dom_amantino_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.classList.remove('hidden');
        emptyCartMessage.classList.add('flex');
        checkoutForm.classList.add('hidden');
        cartFooter.classList.add('hidden');
    } else {
        emptyCartMessage.classList.add('hidden');
        emptyCartMessage.classList.remove('flex');
        checkoutForm.classList.remove('hidden');
        cartFooter.classList.remove('hidden');

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3 p-3 bg-dom-cream/50 rounded-2xl border border-dom-brown/10 shadow-sm">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl bg-gray-100">
                <div class="flex-grow">
                    <h4 class="font-serif font-bold text-dom-brown text-sm leading-tight">${item.name}</h4>
                    <span class="text-xs text-dom-red font-bold">${formatMoney(item.price)}</span>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded-md bg-white border border-gray-300 hover:bg-gray-100 text-dom-brown flex items-center justify-center text-xs font-bold">-</button>
                        <span class="text-xs font-bold text-dom-brown w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded-md bg-white border border-gray-300 hover:bg-gray-100 text-dom-brown flex items-center justify-center text-xs font-bold">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-dom-red p-1.5 transition-colors">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartSubtotal.textContent = formatMoney(total);
    cartTotal.textContent = formatMoney(total);

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openCart() {
    cartOverlay.classList.remove('hidden');
    setTimeout(() => {
        cartOverlay.classList.remove('opacity-0');
        cartDrawer.classList.remove('translate-x-full');
    }, 10);
}

function closeCart() {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.add('opacity-0');
    setTimeout(() => {
        cartOverlay.classList.add('hidden');
    }, 300);
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    const name = document.getElementById('custName').value.trim();
    const street = document.getElementById('custStreet').value.trim();
    const number = document.getElementById('custNumber').value.trim();
    const neighborhood = document.getElementById('custNeighborhood').value.trim();
    const payment = document.getElementById('custPayment').value;
    const notes = document.getElementById('orderNotes').value.trim();

    if (!name || !street || !number || !neighborhood) {
        alert("Por favor, preencha todos os campos obrigatórios de endereço e nome para entrega!");
        return;
    }

    const phone = "5511999999999";
    let message = "*🍕 PEDIDO - PIZZARIA DOM AMANTINO 🍕*\n";
    message += "_A pizza que reúne a família._\n\n";
    
    message += "*📋 ITENS DO PEDIDO:*\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name} (${item.quantity}x)* - ${formatMoney(item.price * item.quantity)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    message += `\n*💰 VALOR TOTAL:* ${formatMoney(total)}\n\n`;

    message += "*📍 DADOS PARA ENTREGA:*\n";
    message += `• *Cliente:* ${name}\n`;
    message += `• *Endereço:* ${street}, Nº ${number}\n`;
    message += `• *Bairro:* ${neighborhood}\n`;
    message += `• *Forma de Pagamento:* ${payment}\n`;

    if (notes) {
        message += `• *Observações:* ${notes}\n`;
    }

    message += "\n*Obrigado! Aguardo a confirmação do pedido.*";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
}

function updateStoreStatus() {
    const badge = document.getElementById('storeStatusBadge');
    if (!badge) return;
    
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + (now.getMinutes() / 60);

    let isOpen = false;
    if (day !== 1) { // Aberto de Terça a Domingo
        if (hour >= 18 && hour <= 23.5) {
            isOpen = true;
        }
    }

    if (isOpen) {
        badge.className = "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-green-100 text-dom-green border border-green-200 shadow-sm";
        badge.innerHTML = `<span class="w-3 h-3 rounded-full bg-dom-green animate-ping"></span> ABERTO AGORA - Aceitando Pedidos`;
    } else {
        badge.className = "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-red-100 text-dom-red border border-red-200 shadow-sm";
        badge.innerHTML = `<span class="w-3 h-3 rounded-full bg-dom-red"></span> FECHADO AGORA (Abre às 18:00)`;
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = msg;

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    updateStoreStatus();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setInterval(updateStoreStatus, 60000);

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('bg-dom-red', 'text-white', 'shadow-md');
                b.classList.add('bg-white', 'border', 'border-dom-brown/20', 'text-dom-brown');
            });
            e.target.classList.remove('bg-white', 'border', 'border-dom-brown/20', 'text-dom-brown');
            e.target.classList.add('bg-dom-red', 'text-white', 'shadow-md');

            activeCategory = e.target.getAttribute('data-category');
            renderProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) closeCart();
        });
    }

    if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutWhatsApp);

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
});