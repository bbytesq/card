import type { CartItem } from './types';

const getCartCounterElement = (): HTMLElement | null => document.getElementById('cartCounter');

const getCartItemsListElement = (): HTMLTableSectionElement | null => {
  const element = document.getElementById('cartItemsList');
  if (!element) return null;
  return element as HTMLTableSectionElement;
};

export const getCartTotalCount = (items: CartItem[]): number => items
  .reduce((sum, item) => sum + item.count, 0);

export const setCartCounter = (count: number): void => {
  const counterElement = getCartCounterElement();
  if (!counterElement) return;
  counterElement.textContent = String(count);
};

export const renderCartItems = (items: CartItem[]): void => {
  const tbody = getCartItemsListElement();
  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = '';
    return;
  }

  const rowsHtml = items.map((item) => {
    const { name, price, discount, count } = item;
    const discounted = price * (1 - discount / 100);
    const discountedStr = discounted.toFixed(2);

    return `
      <tr>
        <td>${name}</td>
        <td>${discountedStr}</td>
        <td>${count}</td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rowsHtml;
};

export const applyCartState = (items: CartItem[]): void => {
  renderCartItems(items);
  const totalCount = getCartTotalCount(items);
  setCartCounter(totalCount);
};


