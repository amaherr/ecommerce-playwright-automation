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

    test('searchbar finds existing product(s) with exact search', async ({ page }) => {
        // search for an existing product
        const searchString = 'Mechanical Keyboard';
        const results = await productsPage.search(searchString);

        // make sure there is at least one result
        await expect.poll(async () => results.count()).toBeGreaterThan(0);

        // make sure that all products include the search string
        const count = await results.count();
        for (let i = 0; i < count; i++) {
            const product = results.nth(i);

            await expect(product.getByRole('heading')).toContainText(searchString, {
                ignoreCase: true,
            });
        }
    });

    test('searchbar does not find nonexistent products', async ({ page }) => {
        // search for a nonexistent product
        const results = await productsPage.search('abcd123');

        // verify no products appear
        await expect(results).toHaveCount(0);

        await expect(page.getByText('No products found matching your criteria.')).toBeVisible();
    });

    test('searchbar finds existing product(s) with partial search', async ({ page }) => {
        // search for an existing product
        const searchString = 'Keyboard';
        const results = await productsPage.search(searchString);

        // make sure there is at least one result
        await expect.poll(async () => results.count()).toBeGreaterThan(0);

        // make sure that all products include the search string
        const count = await results.count();
        for (let i = 0; i < count; i++) {
            const product = results.nth(i);

            await expect(product.getByRole('heading')).toContainText(searchString, {
                ignoreCase: true,
            });
        }
    });
});
