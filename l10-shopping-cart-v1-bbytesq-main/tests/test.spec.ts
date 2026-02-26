import { test, expect } from '@playwright/test';
import cardWrapper from '../src/cardWrapper';
import { products } from '../__fixtures__/responsets';

let cart = [];

test.beforeEach(async ({ page }) => {
  await page.route('/products', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(products),
      });
    }
  });

  await page.route('/cart', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cart),
      });
    }
    if (route.request().method() === 'POST') {
      const data = route.request().postData();
      const item = products.find((product) => +product.id === +data.id);
      const cartItem = cart.find((product) => +product.id === +data.id);
      if (cartItem) {
        cartItem.count += 1;
      } else cart.push({ ...item, count: 1 });
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'ok',
      });
    }
  });

  await page.route('/reset', (route) => {
    cart = [];
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'ok',
    });
  });

  await page.goto('http://localhost:8080');
});

test('step1', async () => {
  const card = cardWrapper({
    id: 1,
    name: 'Смартфон Xiaomi Redmi Note 12',
    description: '6.67-дюймовый AMOLED дисплей, 128 ГБ памяти, 8 ГБ ОЗУ',
    stock: 25,
    price: 19999,
    discount: 10,
  });
  await expect(card).toMatch('<span class="badge bg-danger position-absolute mt-2 ms-2">-10%</span>');
  await expect(card).toMatch('<h5 class="card-title">Смартфон Xiaomi Redmi Note 12</h5>');
  await expect(card).toMatch('<p class="card-text text-muted small">6.67-дюймовый AMOLED дисплей, 128 ГБ памяти, 8 ГБ ОЗУ</p>');
  await expect(card).toMatch('<span class="fs-5 fw-bold">17999.10 ₽</span>');
});

test('step2', async ({ page }) => {
  await page.goto('http://localhost:8080');
  const cards = await page.locator('.card');
  const buttonsDisabled = cards.locator('button:disabled');
  await expect(cards).toHaveCount(15);
  await expect(buttonsDisabled).toHaveCount(3);
});

test('step3', async ({ page }) => {
  const resetBtn = page.locator('.resetBtn').first();
  await resetBtn.click();

  const cardCounter = page.locator('#cartCounter');
  await expect(cardCounter).toHaveText('0');

  const card1 = page.locator('.card').first();
  await card1.locator('button').click();
  await expect(cardCounter).toHaveText('1');

  const card3 = page.locator('.card').nth(3);
  await card3.locator('button').click();
  await expect(cardCounter).toHaveText('2');

  await resetBtn.click();
  await expect(cardCounter).toHaveText('0');
});

test('step4', async ({ page }) => {
  const resetBtn1 = page.locator('.resetBtn').first();
  const resetBtn2 = page.locator('.resetBtn').last();
  await resetBtn1.click();

  const cardCounter = page.locator('#cartCounter');
  await expect(cardCounter).toHaveText('0');

  const card1 = page.locator('.card').first();
  await card1.locator('button').click();
  const card3 = page.locator('.card').nth(2);
  await card3.locator('button').click();
  await card3.locator('button').click();

  await expect(cardCounter).toHaveText('3');

  const cartButton = page.locator('#cartButton');
  await cartButton.click();

  const modal = page.locator('.modal');
  const heading = await modal.getByText('Ваша корзина');
  await expect(heading).toBeVisible();

  // const price = await modal.getByText('2');
  // await expect(price).toBeVisible();

  await resetBtn2.click();
  const closeCartBtn = await page.locator('#cartButtonClose');
  await closeCartBtn.click();
  await expect(cardCounter).toHaveText('0');
});
