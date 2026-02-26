import axios from 'axios';
import cardWrapper from './cardWrapper';
import type { Product, CartItem } from './types';
import { applyCartState, setCartCounter } from './setCart';

const showModal = (): void => {
  const modalElement = document.getElementById('cartModal');
  if (!modalElement) return;

  modalElement.classList.add('show');
  modalElement.setAttribute('aria-hidden', 'false');
  modalElement.style.display = 'block';
};

const hideModal = (): void => {
  const modalElement = document.getElementById('cartModal');
  if (!modalElement) return;

  modalElement.classList.remove('show');
  modalElement.setAttribute('aria-hidden', 'true');
  modalElement.style.display = 'none';
};

const app = (): void => {
  const productContainer = document.querySelector('.product-container') as HTMLElement | null;
  const resetButtons = document.querySelectorAll<HTMLButtonElement>('.resetBtn');
  const cartButton = document.getElementById('cartButton') as HTMLButtonElement | null;
  const cartButtonClose = document.getElementById('cartButtonClose') as HTMLButtonElement | null;

  const loadProducts = async (): Promise<void> => {
    if (!productContainer) return;

    try {
      const response = await axios.get<Product[]>('/products');
      const products = response.data;

      const cardsHtml = products.map((product) => cardWrapper(product)).join('');
      productContainer.innerHTML = cardsHtml;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading products', error);
    }
  };

  const syncCartFromServer = async (): Promise<void> => {
    try {
      const response = await axios.get<CartItem[]>('/cart');
      const items = response.data;
      applyCartState(items);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading cart', error);
    }
  };

  const handleAddToCartClick = async (event: MouseEvent): Promise<void> => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const button = target.closest('button.addToCart') as HTMLButtonElement | null;
    if (!button || button.disabled) return;

    const idAttr = button.getAttribute('data-id');
    if (!idAttr) return;

    const id = Number(idAttr);
    if (Number.isNaN(id)) return;

    try {
      await axios.post('/cart', { id });
      await syncCartFromServer();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding to cart', error);
    }
  };

  const attachResetHandlers = (): void => {
    resetButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await axios.post('/reset');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error resetting cart', error);
        }

        applyCartState([]);
      });
    });
  };

  const attachModalHandlers = (): void => {
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        showModal();
      });
    }

    if (cartButtonClose) {
      cartButtonClose.addEventListener('click', () => {
        hideModal();
      });
    }
  };

  const init = async (): Promise<void> => {
    setCartCounter(0);
    await loadProducts();

    if (productContainer) {
      productContainer.addEventListener('click', (event) => {
        void handleAddToCartClick(event as MouseEvent);
      });
    }

    attachResetHandlers();
    attachModalHandlers();
    await syncCartFromServer();
  };

  void init();
};

export default app;


