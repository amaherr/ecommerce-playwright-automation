import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;

    readonly allProducts: Locator;
    readonly searchbarInput: Locator;
    readonly searchbarButton: Locator;

    readonly url: string;

    constructor(page: Page) {
        this.page = page;

        this.allProducts = this.page.locator('.product-card');
        this.searchbarInput = this.page.getByPlaceholder('Search products');
        this.searchbarButton = this.page.locator('#searchBtn');

        this.url = '/';
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async search(searchWord: string) {
        await this.searchbarInput.fill(searchWord);
        await this.searchbarButton.click();

        return this.page.locator('.product-card');
    }
}
