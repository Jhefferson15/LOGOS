/**
 * Shop Data
 * Contains all shop items including daily deals, chests, and currency packs
 */

export const SHOP_DATA = {
    dailyDeals: [
        { id: 'deal_01', type: 'philosopher', philosopherId: 1, quantity: 5, cost: { currency: 'scrolls', amount: 50 } },
        { id: 'deal_02', type: 'philosopher', philosopherId: 2, quantity: 2, cost: { currency: 'scrolls', amount: 100 } },
        { id: 'deal_03', type: 'philosopher', philosopherId: 14, quantity: 1, cost: { currency: 'scrolls', amount: 500 } },
    ],
    chests: [
        { id: 'chest_01', type: 'chest', name: 'Baú de Madeira', icon: 'fa-box', description: 'Um baú simples com algumas cartas.', cost: { currency: 'books', amount: 10 } },
        { id: 'chest_02', type: 'chest', name: 'Baú de Ouro', icon: 'fa-gem', description: 'Contém ouro e cartas épicas.', cost: { currency: 'books', amount: 50 } }
    ],
    currencyPacks: [
        { id: 'pack_01', type: 'currency', name: 'Pilha de Ouro', quantity: 100, cost: { currency: 'real', amount: 4.99 }, icon: 'fa-coins' },
        { id: 'pack_02', type: 'currency', name: 'Saco de Ouro', quantity: 550, cost: { currency: 'real', amount: 24.99 }, icon: 'fa-briefcase' }
    ]
};