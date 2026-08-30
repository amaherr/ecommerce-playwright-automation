import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;

    // product information
    readonly products: Locator;
    readonly productNames: Locator;
    readonly productCategories: Locator;
    readonly productPrices: Locator;
    readonly addToCartButtons: Locator;

    readonly cartTotal: Locator;

    readonly searchbarInput: Locator;
    readonly searchbarButton: Locator;
    readonly categoryFilter: Locator;
    readonly priceFilter: Locator;
    readonly sortingDropdown: Locator;

    readonly url: string;

    constructor(page: Page) {
        this.page = page;

        this.products = this.page.locator('.product-card');
        this.productNames = this.products.getByRole('heading');
        this.productCategories = this.products.locator('.product-category');
        this.productPrices = this.products.locator('.product-price');
        this.addToCartButtons = this.products.getByRole('button', { name: 'Add to Cart' });

        this.cartTotal = this.page.locator('#cartCount');

        this.searchbarInput = this.page.getByPlaceholder('Search products');
        this.searchbarButton = this.page.locator('#searchBtn');
        this.categoryFilter = this.page.getByLabel('Category');
        this.priceFilter = this.page.getByLabel('Max Price');
        this.sortingDropdown = this.page.getByLabel('Sort by');

        this.url = '/';
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async search(searchWord: string) {
        await this.searchbarInput.fill(searchWord);
        await this.searchbarButton.click();
    }

    async filterByCategory(category: string) {
        await this.categoryFilter.selectOption(category);
    }

    async filterByMaxPrice(maxPrice: number) {
        await this.priceFilter.fill(String(maxPrice));
    }

    async sortBy(sort: string) {
        await this.sortingDropdown.selectOption(sort);
    }
}
