import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

// Login tests
test.describe('user login', () => {
    let loginPage: LoginPage;

    // create login page object before each test
    test.beforeEach(async ({ page }) => {
        console.log('Running ', test.info().title);

        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('user can login', async ({ page }) => {
        // login with correct credentials
        await loginPage.login('demo@techmart.com', 'demo123');

        // verify logged in
        await expect(page.getByText('Login successful')).toBeVisible();

        await expect(page).toHaveURL('/');

        await expect(page.getByText('Hi, ')).toBeVisible();
    });

    test("user can't login with wrong password", async ({ page }) => {
        // login with correct email and wrong password
        await loginPage.login('demo@techmart.com', 'wrong-password');

        // check for invalid login
        await expect(page.getByText('Invalid')).toBeVisible();

        await expect(page).toHaveURL(loginPage.url);
    });

    test("user can't login with unknown email", async ({ page }) => {
        // login with unknown email
        await loginPage.login('unknown@techmart.com', 'password');

        // check for invalid login
        await expect(page.getByText('Invalid')).toBeVisible();

        await expect(page).toHaveURL(loginPage.url);
    });

    test("user can't login with empty credentials", async ({ page }) => {
        // login with empty email and empty password
        await loginPage.login('', '');

        // verify invalid login
        await expect(page).toHaveURL(loginPage.url);
    });

    test("user can't login with invalid email address format", async ({ page }) => {
        // login with invalid email format
        await loginPage.login('demo', 'password');

        // verify invalid login
        await expect(page).toHaveURL(loginPage.url);
    });
});

// Registration tests
test.describe('user registeration', async () => {
    // navigate to register page before each test
    test.beforeEach(async ({ page }) => {
        console.log('Running ', test.info().title);

        await page.goto('/register.html');
    });

    test('user can register', async ({ page }) => {
        // fill fullname
        await page.getByLabel('Full Name').fill('Abdelrahman Maher');

        // fill email address
        await page.getByLabel('Email Address').fill(`${Date.now()}-${Math.random()}@example.com`);

        // fill password
        await page.getByLabel('Password', { exact: true }).fill('123123#');

        // fill confirm password
        await page.getByLabel('Confirm Password').fill('123123#');

        // click create account
        await page.getByRole('button', { name: 'Create Account' }).click();

        // verify successfully registered
        await expect(page.getByText('Account Created')).toBeVisible();

        await expect(page.getByText('Hi, ')).toBeVisible();

        await expect(page).toHaveURL('/');
    });

    test("user can't register with existing email", async ({ page }) => {});
});
