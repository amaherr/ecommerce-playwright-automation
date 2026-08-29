import { test, expect } from '@playwright/test';

import { ProductsPage } from '../pages/ProductsPage';

test('product cards are displayed correctly', async ({ page }) => {
    const productsPage: ProductsPage = new ProductsPage(page);

    await productsPage.goto();

    // get all product cards
    const products = productsPage.allProducts;

    // make sure there are more than 1 product displaying
    const productsCount = await products.count();
    expect(productsCount).toBeGreaterThan(0);

    // validate information for each product
    for (let i = 0; i < productsCount; i++) {
        const product = products.nth(i);

        // product name exists and not empty
        const productName = await product.getByRole('heading').textContent();
        expect(productName?.trim().length).toBeGreaterThan(0);

        // product details exist and not empty
        const classNames = ['.product-category', '.product-price', '.product-stock'];
        for (const className of classNames) {
            const text = await product.locator(className).textContent();
            expect(text?.trim().length).toBeGreaterThan(0);
        }

        // add to cart button
        await expect(product.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
    }
});

test.describe('searchbar works correctly', async () => {
    let productsPage: ProductsPage;

    // create a new products page object before each test
    test.beforeEach(async ({ page }) => {
        console.log('Running ', test.info().title);

        productsPage = new ProductsPage(page);
        await productsPage.goto();
    });

    test('searchbar finds existing product(s)', async ({ page }) => {
        // search for an existing product
        const searchString = 'Keyboard';
        const result = await productsPage.search(searchString);

        // make sure there is at least one result
        const count = await result.count();
        expect(count).toBeGreaterThan(0);

        // make sure that all products include the search string
        for (let i = 0; i < count; i++) {
            const product = result.nth(i);

            const productName = await product.getByRole('heading').textContent();
            expect(productName?.toLowerCase()).toContain(searchString.toLowerCase());
        }
    });
});
