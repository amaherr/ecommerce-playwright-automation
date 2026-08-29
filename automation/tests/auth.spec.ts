import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

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
    let registerPage: RegisterPage;

    // create new register page object before each test
    test.beforeEach(async ({ page }) => {
        console.log('Running ', test.info().title);

        registerPage = new RegisterPage(page);
        await registerPage.goto();
    });

    test('user can register', async ({ page }) => {
        // register with valid credentials
        await registerPage.register(
            'Abdelrahman Maher',
            `${Date.now()}-${Math.random()}@example.com`,
            '123123#',
            '123123#',
        );

        // verify successfully registered
        await expect(page.getByText('Account Created')).toBeVisible();

        await expect(page.getByText('Hi, ')).toBeVisible();

        await expect(page).toHaveURL('/');
    });

    test("user can't register with existing email", async ({ page }) => {
        const emailAddress: string = `${Date.now()}-${Math.random()}@example.com`;

        // register
        await registerPage.register('Abdelrahman Maher', emailAddress, '123123#', '123123#');

        // register again with same email
        await registerPage.register('Abdelrahman Maher', emailAddress, '123123#', '123123#');

        // verify invalid register
        await expect(page.getByText('Email already registered')).toBeVisible();

        await expect(page).toHaveURL(registerPage.url);
    });

    test("user can't register with non-matching passwords", async ({ page }) => {
        // register with non-mathcing passwords
        await registerPage.register(
            'Abdelrahman Maher',
            `${Date.now()}-${Math.random()}@example.com`,
            '123123#',
            '123123333#',
        );

        // verify invalid register
        await expect(page.getByText('Passwords do not match')).toBeVisible();

        await expect(page).toHaveURL(registerPage.url);
    });

    test("user can't register with too short password", async ({ page }) => {
        // register with short password
        await registerPage.register(
            'Abdelrahman Maher',
            `${Date.now()}-${Math.random()}@example.com`,
            '123#',
            '123',
        );

        // verify invalid register
        await expect(page).toHaveURL(registerPage.url);
    });

    test("user can't register with empty fullname", async ({ page }) => {
        // register with empty fullname
        await registerPage.register(
            '',
            `${Date.now()}-${Math.random()}@example.com`,
            '123123#',
            '123123333#',
        );

        // verify invalid register
        await expect(page).toHaveURL(registerPage.url);
    });

    test("user can't register with empty email", async ({ page }) => {
        // register with empty email
        await registerPage.register('Abdelrahman Maher', '', '123123#', '123123333#');

        // verify invalid register
        await expect(page).toHaveURL(registerPage.url);
    });
});
