import type { Product } from './types';

const formatDiscountedPrice = (price: number, discount: number): string => {
  const discounted = price * (1 - discount / 100);
  return `${discounted.toFixed(2)} ₽`;
};

const formatOriginalPrice = (price: number): string => `${price} ₽`;

const cardWrapper = (product: Product): string => {
  const {
    id, name, description, stock, price, discount,
  } = product;

  const discountBadge = discount > 0
    ? `<span class="badge bg-danger position-absolute mt-2 ms-2">-${discount}%</span>`
    : '';

  const disabledAttr = stock === 0 ? 'disabled' : '';

  const discountedPrice = formatDiscountedPrice(price, discount);
  const originalPrice = formatOriginalPrice(price);

  return `
<div class="col">
  <div class="card h-100 shadow-sm">
    ${discountBadge}
    <img class="card-img" src="cube-outline-svgrepo-com.svg">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${name}</h5>
      <p class="card-text text-muted small">${description}</p>
      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fs-5 fw-bold">${discountedPrice}</span>
          <span class="text-decoration-line-through text-muted small">${originalPrice}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <button ${disabledAttr} data-id="${id}" class="addToCart btn btn-primary btn-sm">В корзину</button>
          <span class="text-muted small">Осталось: ${stock} шт.</span>
        </div>
      </div>
    </div>
  </div>
</div>`.trim();
};

export default cardWrapper;


