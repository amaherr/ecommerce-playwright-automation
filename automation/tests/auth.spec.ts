import { test, expect } from '@playwright/test';

// Login tests
test.describe('user login', () => {
    // navigate to login page before each test
    test.beforeEach(async ({ page }) => {
        console.log('Running ', test.info().title);

        await page.goto('/login.html');
    });

    test('user can login', async ({ page }) => {
        // fill email address
        await page.getByLabel('Email Address').fill('demo@techmart.com');

        // fill password
        await page.getByLabel('Password').fill('demo123');

        // press login
        await page.getByRole('button', { name: 'Login' }).click();

        // verify logged in
        await expect(page.getByText('Login successful')).toBeVisible();

        await expect(page.getByText('Hi, ')).toBeVisible();
    });

    test("user can't login with wrong password", async ({ page }) => {
        // fill correct email
        await page.getByLabel('Email Address').fill('demo@techmart.com');

        // fill wrong password
        await page.getByLabel('Password').fill('demo1234');

        // press login button
        await page.getByRole('button', { name: 'Login' }).click();

        // check for invalid login
        await expect(page.getByText('Invalid')).toBeVisible();

        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test("user can't login with unknown email", async ({ page }) => {
        // fill unknown email
        await page.getByLabel('Email Address').fill('demo0@techmart.com');

        // fill password
        await page.getByLabel('Password').fill('demo123');

        // press login button
        await page.getByRole('button', { name: 'Login' }).click();

        // check for invalid login
        await expect(page.getByText('Invalid')).toBeVisible();

        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test("user can't login with empty credentials", async ({ page }) => {
        // fill empty email
        await page.getByLabel('Email Address').fill('');

        // fill empty password
        await page.getByLabel('Password').fill('');

        // click login button
        await page.getByRole('button', { name: 'Login' }).click();

        // verify error message
        await expect(page).toHaveURL('/login.html');

        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test("user can't login with invalid email address format", async ({ page }) => {
        // fill invalid email
        await page.getByLabel('Email Address').fill('demo');

        // fill password
        await page.getByLabel('Password').fill('demo123');

        // click login
        await page.getByRole('button', { name: 'login' }).click();

        // verify still in login page
        await expect(page).toHaveURL('/login.html');

        await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
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
