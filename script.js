// =========================================================
// Sincronização com o Painel Admin (localStorage)
// =========================================================

// Produtos Padrão (Caso ainda não haja nada cadastrado no Admin)
const defaultProducts = [
    { id: 1, name: "Calabresa Especial", category: "Pizzas Salgadas", price: 54.90, description: "Molho de tomate caseiro, muçarela, calabresa fatiada, cebola roxa e azeitonas pretas.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=80" },
    { id: 2, name: "Margherita Tradicional", category: "Pizzas Salgadas", price: 49.90, description: "Molho italiano, muçarela de búfala, rodelas de tomate e manjericão fresco.", image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&q=80" },
    { id: 3, name: "Chocolate com Morango", category: "Pizzas Doces", price: 45.90, description: "Massa crocante, creme de chocolate ao leite e morangos frescos fatiados.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
    { id: 4, name: "Coca-Cola 2L", category: "Bebidas", price: 14.00, description: "Refrigerante Coca-Cola Garrafa 2 Litros bem gelada.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" }
];

// Busca os produtos atualizados pelo Admin
function getProducts() {
    const stored = localStorage.getItem('dom_amantino_products');
    if (!stored) {
        localStorage.setItem('dom_amantino_products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

// Estado do Carrinho
let cart = JSON.parse(localStorage.getItem('dom_amantino_cart') || '[]');
let currentCategory = 'all';
let searchQuery = '';

// =========================================================
// Renderização do Cardápio
// =========================================================

function renderProducts() {
    const products = getProducts();
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    if (!grid) return;

    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = filtered.map(product => `
        <div class="bg-white rounded-3xl overflow-hidden shadow-lg border border-dom-brown/10 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div class="relative h-48 overflow-hidden bg-dom-creamDark">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80'}" 
                         alt="${product.name}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         onerror="this.src='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80'">
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-dom-brown font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                        ${product.category}
                    </span>
                </div>
                <div class="p-5">
                    <h3 class="font-serif font-bold text-xl text-dom-brown group-hover:text-dom-red transition-colors">${product.name}</h3>
                    <p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">${product.description || 'Delicioso item preparado com ingredientes frescos.'}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <div>
                    <span class="text-xs text-gray-400 block">Preço</span>
                    <span class="text-lg font-extrabold text-dom-red">R$ ${Number(product.price).toFixed(2).replace('.', ',')}</span>
                </div>
                <button onclick="addToCart(${product.id})" class="px-4 py-2.5 bg-dom-red hover:bg-dom-redDark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5">
                    <i data-lucide="plus" class="w-4 h-4"></i> Adicionar
                </button>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

// =========================================================
// Gestão do Carrinho e Sincronização de Compras no Admin
// =========================================================

function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('dom_amantino_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const checkoutForm = document.getElementById('checkoutForm');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.textContent = totalCount;

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'flex';
        if (checkoutForm) checkoutForm.classList.add('hidden');
        if (cartFooter) cartFooter.classList.add('hidden');
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (checkoutForm) checkoutForm.classList.remove('hidden');
    if (cartFooter) cartFooter.classList.remove('hidden');

    if (cartSubtotal) cartSubtotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    if (cartTotal) cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <img src="${item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80'}" class="w-12 h-12 rounded-xl object-cover">
                <div class="flex-grow min-w-0">
                    <h4 class="font-bold text-xs text-dom-brown truncate">${item.name}</h4>
                    <p class="text-xs text-dom-red font-bold">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200">
                    <button onclick="updateQuantity(${item.id}, -1)" class="text-gray-500 hover:text-dom-red font-bold text-sm px-1">-</button>
                    <span class="text-xs font-bold text-dom-brown w-4 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="text-gray-500 hover:text-dom-green font-bold text-sm px-1">+</button>
                </div>
            </div>
        `).join('');
    }

    if (window.lucide) lucide.createIcons();
}

// Salva o Pedido no Histórico do Painel Admin
function saveOrderToAdmin(customerData, totalPrice) {
    const orders = JSON.parse(localStorage.getItem('dom_amantino_orders') || '[]');
    const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString(),
        customerName: customerData.name || 'Cliente Sem Nome',
        address: {
            street: customerData.street || '',
            number: customerData.number || '',
            neighborhood: customerData.neighborhood || ''
        },
        payment: customerData.payment || 'PIX',
        notes: customerData.notes || '',
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: totalPrice,
        status: 'Pendente'
    };

    orders.unshift(newOrder);
    localStorage.setItem('dom_amantino_orders', JSON.stringify(orders));
}

// Envio do Pedido via WhatsApp
function handleCheckout() {
    const custName = document.getElementById('custName')?.value.trim();
    const custStreet = document.getElementById('custStreet')?.value.trim();
    const custNumber = document.getElementById('custNumber')?.value.trim();
    const custNeighborhood = document.getElementById('custNeighborhood')?.value.trim();
    const custPayment = document.getElementById('custPayment')?.value;
    const orderNotes = document.getElementById('orderNotes')?.value.trim();

    if (!custName || !custStreet || !custNumber || !custNeighborhood) {
        alert("Por favor, preencha todos os campos obrigatórios do endereço e seu nome!");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 1. Salva no banco/admin
    saveOrderToAdmin({
        name: custName,
        street: custStreet,
        number: custNumber,
        neighborhood: custNeighborhood,
        payment: custPayment,
        notes: orderNotes
    }, totalPrice);

    // 2. Monta mensagem do WhatsApp
    let msg = `*NOVO PEDIDO - DOM AMANTINO*\n\n`;
    msg += `*Cliente:* ${custName}\n`;
    msg += `*Endereço:* ${custStreet}, ${custNumber} - ${custNeighborhood}\n`;
    msg += `*Pagamento:* ${custPayment}\n`;
    if (orderNotes) msg += `*Obs:* ${orderNotes}\n`;
    msg += `\n*ITENS:* \n`;

    cart.forEach(item => {
        msg += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    msg += `\n*TOTAL: R$ ${totalPrice.toFixed(2)}*`;

    // Limpa o carrinho
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart(false);

    // Redireciona para o WhatsApp (Substitua pelo número da pizzaria)
    const phone = "5511999999999"; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// =========================================================
// Utilitários de Interface (Drawer e Toast)
// =========================================================

function toggleCart(open) {
    const overlay = document.getElementById('cartOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (!overlay || !drawer) return;

    if (open) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            drawer.classList.remove('translate-x-full');
        }, 10);
    } else {
        overlay.classList.add('opacity-0');
        drawer.classList.add('translate-x-full');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}

// Event Listeners ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    // Eventos de Busca e Categorias
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    }

    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => {
                b.classList.remove('bg-dom-red', 'text-white');
                b.classList.add('bg-white', 'text-dom-brown');
            });
            btn.classList.remove('bg-white', 'text-dom-brown');
            btn.classList.add('bg-dom-red', 'text-white');

            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });

    // Abrir/Fechar Carrinho
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) toggleCart(false);
    });
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
});