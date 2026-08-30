import { type Page, type Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;

    // product information
    readonly productsInCart: Locator;
    readonly productPrices: Locator;
    readonly productTotals: Locator;
    readonly productNames: Locator;
    readonly productQuantities: Locator;

    readonly addQuantityButtons: Locator;

    readonly subtotal: Locator;
    readonly clearCartButton: Locator;

    readonly url: string;

    constructor(page: Page) {
        this.page = page;

        this.productsInCart = this.page.locator('.cart-item');
        this.productPrices = this.productsInCart.locator('.item-price');
        this.productTotals = this.productsInCart.locator('.item-total');
        this.productNames = this.productsInCart.getByRole('heading');
        this.productQuantities = this.productsInCart.locator('.qty-value');

        this.addQuantityButtons = this.productsInCart.getByRole('button', { name: '+' });

        this.subtotal = this.page.locator('#subtotal');
        this.clearCartButton = this.page.getByRole('button', { name: 'Clear Cart' });

        this.url = '/cart.html';
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async clearCart() {
        await this.clearCartButton.click();
    }
}
