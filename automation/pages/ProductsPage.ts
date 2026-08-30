import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;

    readonly products: Locator;
    readonly searchbarInput: Locator;
    readonly searchbarButton: Locator;
    readonly categoryFilter: Locator;
    readonly priceFilter: Locator;

    readonly url: string;

    constructor(page: Page) {
        this.page = page;

        this.products = this.page.locator('.product-card');
        this.searchbarInput = this.page.getByPlaceholder('Search products');
        this.searchbarButton = this.page.locator('#searchBtn');
        this.categoryFilter = this.page.getByLabel('Category');
        this.priceFilter = this.page.getByLabel('Max Price');

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
}
