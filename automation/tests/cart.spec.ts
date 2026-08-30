import { test, expect } from '@playwright/test';

import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

////// Helpers //////
function getPrice(price: string) {
    return Number(price.replace('$', ''));
}

let productsPage: ProductsPage;
let cartPage: CartPage;

// setup before each test
test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);

    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await productsPage.goto();
});

test('add product to cart works correctly', async ({ page }) => {
    // add a product to cart
    await productsPage.addToCartButtons.first().click();

    // save the product details for later verification
    const productName = (await productsPage.productNames.first().textContent()) || '';
    const productPrice = (await productsPage.productPrices.first().textContent()) || '';

    // verify cart total
    await expect(productsPage.cartTotal).toHaveText('1');

    await cartPage.goto();

    // verify only one product appears
    await expect(cartPage.productsInCart).toHaveCount(1);

    // verify correct product appears
    await expect(cartPage.productNames.first()).toHaveText(productName);
    await expect(cartPage.productPrices.first()).toHaveText(productPrice);

    // verify correct subtotal
    await expect(cartPage.subtotal).toHaveText(productPrice);
});

test('adding multiple products to cart works correctly', async () => {
    // add multiple products
    const productNames: string[] = [];
    const productPrices: number[] = [];
    for (let i = 0; i < 3; i++) {
        await productsPage.addToCartButtons.nth(i).click();

        productNames.push((await productsPage.productNames.nth(i).textContent()) || '');
        productPrices.push(getPrice((await productsPage.productPrices.nth(i).textContent()) || ''));
    }

    // verify cart total
    await expect(productsPage.cartTotal).toHaveText('3');

    await cartPage.goto();

    // verify products' details
    for (let i = 0; i < 3; i++) {
        await expect(cartPage.productNames.nth(i)).toHaveText(productNames[i]);
        expect(getPrice((await cartPage.productPrices.nth(i).textContent()) || '')).toEqual(
            productPrices[i],
        );
    }

    // verify subtotal (convert to cents)
    const expectedSubtotalCents: number = Math.round(
        productPrices.reduce((acc, i) => acc + i, 0) * 100,
    );
    const actualSubtotalCents: number = Math.round(
        getPrice((await cartPage.subtotal.textContent()) || '') * 100,
    );

    expect(actualSubtotalCents).toEqual(expectedSubtotalCents);
});

test('change quantity of products in cart works correctly', async () => {
    // add a product to cart
    await productsPage.addToCartButtons.first().click();

    await cartPage.goto();

    // add two more quantites
    await cartPage.addQuantityButtons.first().click();
    await cartPage.addQuantityButtons.first().click();

    // verify product quantity
    await expect(cartPage.productQuantities.first()).toHaveText('3');

    // verify cart subtotal (convert to cents)
    const productPriceText = await cartPage.productPrices.first().textContent();
    const productPriceCents = Math.round(getPrice(productPriceText ?? '') * 100);

    const expectedSubtotalCents = productPriceCents * 3;

    // read actual subtotal
    const subtotalText = await cartPage.subtotal.textContent();
    const actualSubtotalCents = Math.round(getPrice(subtotalText ?? '') * 100);

    expect(actualSubtotalCents).toEqual(expectedSubtotalCents);
});

test('empty cart works correctly', async ({ page }) => {
    // add multiple products
    for (let i = 0; i < 3; i++) {
        await productsPage.addToCartButtons.nth(i).click();
    }

    await cartPage.goto();

    // clear cart
    await cartPage.clearCart();

    // verify cart is cleared
    await expect(page.getByText('Your cart is empty')).toBeVisible();
});
