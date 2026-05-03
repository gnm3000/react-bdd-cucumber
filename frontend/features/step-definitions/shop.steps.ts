import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { PWWorld } from '../support/world';

Given('the product list is loaded', async function (this: PWWorld) {
  await this.page.goto('/');
  await this.page.waitForSelector('[data-testid^="add-"]');
});

When('the user adds {string} to the cart', async function (this: PWWorld, name: string) {
  await Promise.all([
    this.page.waitForResponse('**/api/cart/items'),
    this.page.click(`[data-testid="add-${name}"]`)
  ]);
});

When('the user navigates to cart', async function (this: PWWorld) {
  await this.page.goto('/cart');
});

When('the user navigates to checkout', async function (this: PWWorld) {
  await this.page.goto('/checkout');
});

When('the user confirms the order', async function (this: PWWorld) {
  await this.page.click('[data-testid="confirm-order"]');
});

When('the user navigates to orders', async function (this: PWWorld) {
  await this.page.goto('/orders');
});

Then('the order should be created as paid', async function (this: PWWorld) {
  const text = await this.page.textContent('[data-testid="order-status"]');
  expect(text?.trim()).to.equal('paid');
});

Then('the cart should be empty', async function (this: PWWorld) {
  await this.page.goto('/cart');
  const text = await this.page.textContent('[data-testid="cart-items"]');
  expect(text).to.include('Your cart is empty');
});

Then('the cart count should be {int}', async function (this: PWWorld, count: number) {
  await this.page.waitForFunction(
    (c) => document.querySelector('[data-testid="go-cart"]')?.textContent?.includes(`(${c})`),
    count
  );
});

Then('the cart total should be {int}', async function (this: PWWorld, total: number) {
  await this.page.waitForFunction(
    (t) => document.querySelector('[data-testid="cart-total"]')?.textContent?.includes(`$${t}`),
    total
  );
});
