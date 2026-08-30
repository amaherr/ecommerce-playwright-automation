import { test, expect } from '@playwright/test';

import { ProductsPage } from '../pages/ProductsPage';

////// Helpers //////
function getPrice(price: string) {
    return Number(price.replace('$', ''));
}

test('product cards are displayed correctly', async ({ page }) => {
    const productsPage: ProductsPage = new ProductsPage(page);

    await productsPage.goto();

    // get all product cards
    const products = productsPage.products;

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
        await productsPage.search(searchString);

        const products = productsPage.products;

        // make sure there is at least one result
        await expect.poll(async () => products.count()).toBeGreaterThan(0);

        // make sure that all products include the search string
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const product = products.nth(i);

            await expect(product.getByRole('heading')).toContainText(searchString, {
                ignoreCase: true,
            });
        }
    });

    test('searchbar does not find nonexistent products', async ({ page }) => {
        // search for a nonexistent product
        await productsPage.search('abcd123');
        const products = productsPage.products;

        // verify no products appear
        await expect(products).toHaveCount(0);

        await expect(page.getByText('No products found matching your criteria.')).toBeVisible();
    });

    test('searchbar finds existing product(s) with partial search', async ({ page }) => {
        // search for an existing product
        const searchString = 'Keyboard';
        await productsPage.search(searchString);

        const products = productsPage.products;

        // make sure there is at least one result
        await expect.poll(async () => products.count()).toBeGreaterThan(0);

        // make sure that all products include the search string
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const product = products.nth(i);

            await expect(product.getByRole('heading')).toContainText(searchString, {
                ignoreCase: true,
            });
        }
    });
});

test.describe('filtering and sorting wotks correctly', async () => {
    let productsPage: ProductsPage;

    // create a new products page object model before each test
    test.beforeEach(async ({ page }) => {
        console.log(`Running ${test.info().title}`);

        productsPage = new ProductsPage(page);
        await productsPage.goto();
    });

    test('filtering by category works correctly', async ({ page }) => {
        // filter by electronics
        const category = 'Electronics';
        await productsPage.filterByCategory(category);

        const products = productsPage.products;

        // make sure there are no empty results
        await expect.poll(async () => products.count()).toBeGreaterThan(0);

        // make sure all products returned are within the correct category
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const product = products.nth(i);

            await expect(product.locator('.product-category')).toHaveText(category, {
                ignoreCase: true,
            });
        }
    });

    test('filtering by max price works correctly', async ({ page }) => {
        // filter by max price
        const maxPrice = 70;
        await productsPage.filterByMaxPrice(maxPrice);

        const products = productsPage.products;

        // make sure there are results
        await expect.poll(async () => products.count()).toBeGreaterThan(0);

        // make sure all products have a correct price
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const product = products.nth(i);

            const price = await product.locator('.product-price').textContent();
            expect(getPrice(price || '')).toBeLessThanOrEqual(maxPrice);
        }
    });

    test('filtering by max price and category works correctly', async ({ page }) => {
        // filter by max price and category
        const maxPrice = 30;
        const category = 'Accessories';

        await productsPage.filterByCategory(category);
        await productsPage.filterByMaxPrice(maxPrice);

        const products = productsPage.products;

        // make sure results appear
        await expect.poll(async () => products.count()).toBeGreaterThan(0);

        // make sure every product mathces the filters
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const product = products.nth(i);

            // category verification
            await expect(product.locator('.product-category')).toHaveText(category, {
                ignoreCase: true,
            });

            // price verification
            const price = await product.locator('.product-price').textContent();
            expect(getPrice(price || '')).toBeLessThanOrEqual(maxPrice);
        }
    });
});
