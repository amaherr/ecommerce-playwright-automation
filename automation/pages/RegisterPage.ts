import { type Page, type Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;

    readonly fullnameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly createAccountButton: Locator;

    readonly url: string;

    constructor(page: Page) {
        this.page = page;

        this.fullnameInput = page.getByLabel('Full Name');
        this.emailInput = page.getByLabel('Email Address');
        this.passwordInput = page.getByLabel('Password', { exact: true });
        this.confirmPasswordInput = page.getByLabel('Confirm Password');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

        this.url = '/register.html';
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async register(fullname: string, email: string, password: string, confirmPassword: string) {
        await this.fullnameInput.fill(fullname);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);

        await this.createAccountButton.click();
    }
}
