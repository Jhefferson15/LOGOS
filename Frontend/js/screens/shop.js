import { SHOP_DATA } from '../data/shop.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { gameState } from '../data/gameState.js';
import { popupManager } from '../ui/PopupManager.js';
import { toast } from '../ui/Toast.js';

function getCurrencyIcon(currency) {
    switch (currency) {
        case 'scrolls':
            return 'fa-scroll';
        case 'books':
            return 'fa-book-open';
        case 'real':
            return 'fa-dollar-sign';
        default:
            return 'fa-question-circle';
    }
}

function renderDailyDeals() {
    const grid = document.getElementById('daily-deals-grid');
    if (!grid) return;

    grid.innerHTML = SHOP_DATA.dailyDeals.map(item => {
        const philosopher = PHILOSOPHERS_DATA[item.philosopherId];
        return `
            <div class="shop-item-card" data-item-id="${item.id}" data-type="philosopher">
                <div class="philosopher-quantity">x${item.quantity}</div>
                <div class="shop-item-image" style="background-image: url('${philosopher.image}')"></div>
                <div class="shop-item-header">
                    <h3 class="shop-item-name">${philosopher.name}</h3>
                </div>
                <div class="shop-item-footer">
                    <button class="btn-purchase" data-item-id="${item.id}">
                        <span class="cost-amount">${item.cost.amount}</span>
                        <i class="fas ${getCurrencyIcon(item.cost.currency)} cost-currency-icon"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderChests() {
    const grid = document.getElementById('chests-grid');
    if (!grid) return;

    grid.innerHTML = SHOP_DATA.chests.map(item => {
        return `
            <div class="shop-item-card" data-item-id="${item.id}" data-type="chest">
                 <div class="shop-item-header">
                    <h3 class="shop-item-name">${item.name}</h3>
                </div>
                <div class="shop-item-image">
                    <i class="fas fa-box fa-10x"></i>
                </div>
                <div class="shop-item-details">
                    <p class="shop-item-description">${item.description}</p>
                </div>
                <div class="shop-item-footer">
                    <button class="btn-purchase" data-item-id="${item.id}">
                        <span class="cost-amount">${item.cost.amount}</span>
                        <i class="fas ${getCurrencyIcon(item.cost.currency)} cost-currency-icon"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderCurrencyPacks() {
    const grid = document.getElementById('currency-grid');
    if (!grid) return;

    grid.innerHTML = SHOP_DATA.currencyPacks.map(item => {
        return `
            <div class="shop-item-card" data-item-id="${item.id}" data-type="currency">
                 <div class="shop-item-header">
                    <h3 class="shop-item-name">${item.name}</h3>
                </div>
                <div class="shop-item-image">
                    <i class="fas ${item.icon} fa-10x"></i>
                </div>
                 <div class="shop-item-details">
                    <p class="shop-item-description">Pacote com ${item.quantity} de ouro.</p>
                </div>
                <div class="shop-item-footer">
                    <button class="btn-purchase" data-item-id="${item.id}">
                        <span class="cost-amount">R$ ${item.cost.amount.toFixed(2)}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function handlePurchase(itemId) {
    const allItems = [...SHOP_DATA.dailyDeals, ...SHOP_DATA.chests, ...SHOP_DATA.currencyPacks];
    const item = allItems.find(i => i.id === itemId);

    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }

    if (item.cost.currency === 'real') {
        popupManager.open('shared:confirmation', {
            title: 'Compra com Dinheiro Real',
            message: 'Esta é uma compra com dinheiro real. Você será redirecionado para a loja de aplicativos. Deseja continuar?',
            onConfirm: () => {
                toast.show('Redirecionando para a loja...', 'info');
                // Em um app real, aqui você chamaria o SDK da loja (Google Play, App Store, etc.)
            }
        });
        return;
    }

    const playerCurrency = gameState[item.cost.currency];
    if (playerCurrency < item.cost.amount) {
        toast.show('Moeda insuficiente!', 'error');
        return;
    }
    
    // Simple confirmation for now. Could be a dedicated popup.
    popupManager.open('shared:confirmation', {
        title: 'Confirmar Compra',
        message: `Você tem certeza que deseja comprar ${item.name || `cartas de ${PHILOSOPHERS_DATA[item.philosopherId].name}`} por ${item.cost.amount} ${item.cost.currency}?`,
        onConfirm: () => {
            // Deduct currency
            gameState[item.cost.currency] -= item.cost.amount;

            // Add item to player's inventory
            switch (item.type) {
                case 'philosopher':
                    if (!gameState.ownedPhilosophers[item.philosopherId]) {
                        gameState.ownedPhilosophers[item.philosopherId] = 0;
                    }
                    gameState.ownedPhilosophers[item.philosopherId] += item.quantity;
                    toast.show(`Você comprou ${item.quantity} cartas de ${PHILOSOPHERS_DATA[item.philosopherId].name}!`, 'success');
                    break;
                case 'chest':
                    // For simplicity, we just show a toast. A real implementation would have a chest opening sequence.
                    toast.show(`Você comprou ${item.name}!`, 'success');
                    // Here you would add the chest to the player's chest slots if there is space.
                    break;
            }
            
            // Update the main UI
            document.dispatchEvent(new CustomEvent('update-ui'));
            popupManager.close();
        }
    });

}


export function initShopScreen(gameState, updateDynamicUI, toast) {
    renderDailyDeals();
    renderChests();
    renderCurrencyPacks();

     // Add event listener for purchase buttons
    const shopScreen = document.querySelector('.shop-screen');
    shopScreen.addEventListener('click', (e) => {
        const purchaseButton = e.target.closest('.btn-purchase');
        if (purchaseButton) {
            handlePurchase(purchaseButton.dataset.itemId);
        }
    });
}

export function handleShopScreenClick(e, gameState, updateDynamicUI, toast) {
    // This screen is simple and all logic is handled by the purchase button listener in init.
}
