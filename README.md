# E-Commerce Playwright Automation

A Playwright + TypeScript end-to-end test automation project for a dummy e-commerce web application. The repository contains both the application under test and a separate automation project built to practice realistic QA automation workflows, including page-object-based test design, reusable locators and actions, functional assertions, and browser-based regression testing.

> **Learning project:** This repository was created for learning and portfolio purposes. No AI was used to generate the project's source code or automated tests; all code was written by hand.

---

## Description

This project simulates a real-world QA automation setup for an e-commerce application.

The repository is divided into two main parts:

- **`app/`** — the dummy e-commerce web application under test.
- **`automation/`** — the Playwright automation suite used to test the application.

The automation project is designed around maintainable test practices rather than placing all browser interactions directly inside test files. Page-specific locators and reusable actions are organized using the **Page Object Model (POM)**, while test files focus on scenarios and expected behavior.

The project is intended to demonstrate practical experience with:

- Playwright
- TypeScript
- End-to-end browser testing
- Functional UI testing
- Page Object Model
- Reusable test setup
- Web-first Playwright assertions
- Test isolation
- Dynamic UI state validation
- Cross-browser testing
- Playwright HTML reports
- Debugging failed and flaky tests

---

## Tech Stack

### Application

- Node.js
- JavaScript
- npm

### Test Automation

- Playwright
- TypeScript
- Node.js
- npm

---

## Test Coverage

The automation suite is structured around real user-facing e-commerce functionality.

Examples of scenarios covered by the project include:

### Authentication

- Login with valid credentials
- Login with invalid credentials
- User registration
- Registration with an existing email
- Logout

### Products

- Verify products are displayed
- Verify product information is present
- Search for existing products
- Search for non-existing products
- Verify search results match the search term
- Sort products
- Validate product prices and names

### Shopping Cart

- Add a product to the cart
- Add multiple products
- Verify cart item count
- Change product quantity
- Verify subtotal calculations
- Remove products
- Clear the cart
- Verify the empty-cart state

Additional scenarios can be added as the project grows.

---

## Project Structure

```text
.
├── app/
│   ├── node_modules/
│   ├── public/
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── server.js
│
├── automation/
│   ├── node_modules/
│   ├── pages/
│   ├── playwright-report/
│   ├── test-results/
│   ├── tests/
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── playwright.config.ts
│
├── LICENSE
└── README.md
```

### `app/`

Contains the dummy e-commerce application that serves as the **application under test (AUT)**.

Important files include:

- `server.js` — application server entry point.
- `public/` — frontend/static application files.
- `package.json` — application dependencies and npm scripts.

### `automation/`

Contains the Playwright test automation project.

#### `automation/tests/`

Contains the test specifications.

Test files should describe **what behavior is being tested**, while reusable page interactions are kept outside the test files.

#### `automation/pages/`

Contains Page Object Model classes.

A page object is responsible for things such as:

- Locating elements on a particular page
- Navigating to that page
- Performing reusable page-specific actions

For example:

```text
ProductsPage
├── product locators
├── product-name locators
├── search input
├── sort controls
├── add-to-cart buttons
├── goto()
└── search()
```

This keeps test files easier to read and reduces duplicated locator and interaction code.

#### `automation/playwright-report/`

Contains the generated Playwright HTML report after test execution.

#### `automation/test-results/`

Contains artifacts generated from test runs, such as failure information, screenshots, traces, or videos depending on the Playwright configuration.

#### `automation/playwright.config.ts`

Contains the Playwright Test configuration, such as:

- Browser projects
- Base URL
- Timeouts
- Reporters
- Screenshots
- Videos
- Traces
- Retry behavior

---

## Prerequisites

Before running the project, make sure the following are installed:

- **Node.js 20 or later**
- **npm**
- Git

Check your versions with:

```bash
node -v
npm -v
git --version
```

If Node.js is managed through NVM:

```bash
nvm use
```

or select an installed Node.js version that is supported by Playwright.

---

## How to Run

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

Replace `<repository-url>` and `<repository-name>` with the actual GitHub repository information.

---

### 2. Install the application dependencies

Open a terminal in the application directory:

```bash
cd app
npm install
```

Start the application using the script defined in `app/package.json`.

For example, if the project defines a standard `start` script:

```bash
npm start
```

If a different script is defined, use that script instead.

Keep the application running while executing the Playwright tests.

---

### 3. Install the automation dependencies

Open another terminal from the repository root:

```bash
cd automation
npm install
```

---

### 4. Install Playwright browsers

```bash
npx playwright install
```

On Linux or WSL, Playwright may also require operating-system browser dependencies:

```bash
npx playwright install --with-deps
```

If Node.js is installed through NVM, avoid running `npx` itself with `sudo`, because `sudo` may use a different system Node.js installation.

---

### 5. Run the complete test suite

From the `automation/` directory:

```bash
npx playwright test
```

---

## Useful Playwright Commands

### Run tests in headed mode

Shows the browser while the tests execute:

```bash
npx playwright test --headed
```

### Run tests using Playwright UI Mode

```bash
npx playwright test --ui
```

### Run a specific test file

```bash
npx playwright test tests/<test-file>.spec.ts
```

Example:

```bash
npx playwright test tests/products.spec.ts
```

### Run a specific test by title

```bash
npx playwright test -g "add product to cart works correctly"
```

### Run only Chromium

```bash
npx playwright test --project=chromium
```

### Run only Firefox

```bash
npx playwright test --project=firefox
```

### Run only WebKit

```bash
npx playwright test --project=webkit
```

### Debug tests

```bash
npx playwright test --debug
```

### Open the latest HTML report

```bash
npx playwright show-report
```

---

## Test Architecture

The project follows the **Page Object Model** to separate test scenarios from page implementation details.

Conceptually:

```text
Tests
│
│  Define:
│  - scenario
│  - test data
│  - expected behavior
│  - assertions
│
▼
Page Objects
│
│  Define:
│  - locators
│  - navigation
│  - reusable UI actions
│
▼
Playwright
│
│  Controls:
│  - browser
│  - page
│  - locators
│  - user interactions
│
▼
E-Commerce Application
```

Example:

```ts
await productsPage.addToCartButtons.first().click();

await expect(productsPage.cartTotal).toHaveText('1');
```

The page object knows **how to find the application elements**, while the test defines **what should happen**.

---

## Testing Approach

The suite follows several important automation-testing principles.

### User-Facing Locators

Where possible, tests prioritize selectors based on user-facing semantics, such as:

```ts
page.getByRole('button', { name: 'Logout' });
page.getByRole('link', { name: 'Login' });
page.getByRole('heading');
page.getByText('Your cart is empty');
```

CSS selectors are used when no suitable semantic or explicit test locator is available.

### Web-First Assertions

Playwright locator assertions are preferred for dynamic UI behavior.

For example:

```ts
await expect(cartPage.productsInCart).toHaveCount(0);
```

instead of performing a single immediate count assertion:

```ts
expect(await cartPage.productsInCart.count()).toBe(0);
```

Playwright's web-first assertions automatically retry until the expected state is reached or the configured assertion timeout expires.

### Independent Tests

Each test should be able to run independently and should avoid relying on state produced by another test.

Examples include:

- Generating unique registration data
- Establishing required preconditions before a scenario
- Avoiding dependencies on the execution order of tests

### Meaningful Assertions

Tests verify business outcomes rather than merely verifying that Playwright was able to perform an action.

For example, an Add to Cart test should not stop at:

```ts
await addToCartButton.click();
```

It should verify outcomes such as:

- Correct cart count
- Correct product added
- Correct quantity
- Correct price or subtotal

### Currency Calculations

Currency comparisons are converted to integer cents where appropriate to avoid JavaScript floating-point precision problems.

Example:

```ts
const actualSubtotalCents = Math.round(actualSubtotal * 100);
const expectedSubtotalCents = Math.round(expectedSubtotal * 100);

expect(actualSubtotalCents).toBe(expectedSubtotalCents);
```

---

## Reports and Debugging

Playwright provides several tools for investigating test failures.

### HTML Report

After executing the suite:

```bash
npx playwright show-report
```

The report can show:

- Passed tests
- Failed tests
- Execution duration
- Errors
- Attached artifacts

### Debug Mode

```bash
npx playwright test --debug
```

Debug mode opens Playwright Inspector and is useful for:

- Stepping through tests
- Inspecting locators
- Viewing the current page
- Using Pick Locator
- Investigating timing issues

### Test Artifacts

Depending on `playwright.config.ts`, failed tests may produce:

- Screenshots
- Videos
- Traces
- Error context

These artifacts are stored under the test-results/report directories.

---

## Running in WSL

If the automation project is executed inside Windows Subsystem for Linux, Playwright uses Linux browser binaries and therefore requires Linux browser dependencies.

Install them with:

```bash
npx playwright install --with-deps
```

If Node.js is installed using NVM, check that the expected version is active:

```bash
node -v
which node
```

Avoid:

```bash
sudo npx playwright install-deps
```

when NVM is being used, because `sudo` may resolve a different system-installed Node.js version.

---

## Development Workflow

A typical workflow for adding a new automated scenario is:

1. Understand the feature and expected user behavior.
2. Test the feature manually.
3. Define the scenario and required preconditions.
4. Identify positive, negative, and edge cases.
5. Add or reuse Page Object locators and actions.
6. Write the Playwright test.
7. Add meaningful assertions.
8. Run the test individually.
9. Run the related feature tests.
10. Run the complete regression suite.
11. Debug any failures using Playwright reports, traces, videos, or Inspector.
12. Refactor duplicated page interactions when necessary.

---

## Example Test Scenario

A cart quantity test can be expressed as:

```text
Given:
A product has been added to the cart.

When:
The user increases the quantity from 1 to 3.

Then:
The displayed quantity should be 3.
The subtotal should equal the unit price multiplied by 3.
```

The Playwright test should focus on those expected business outcomes rather than the internal implementation of the application.

---

## Future Improvements

Possible future additions to the project include:

- API-assisted test setup and cleanup
- Reusable Playwright fixtures
- Stored authentication state
- Generated test-data factories
- GitHub Actions CI pipeline
- Smoke and regression test tagging
- Additional checkout scenarios
- Order-history tests
- Filtering tests
- More negative and boundary test cases
- Accessibility testing
- Visual regression testing
- Automated test execution on pull requests
- Published Playwright reports

---

## Learning Goals

This project is intended to build practical experience in:

- Designing test cases from business requirements
- Writing maintainable Playwright tests
- Separating UI implementation details from test logic
- Building reusable Page Objects
- Handling dynamic and asynchronous UI behavior
- Managing test data
- Debugging flaky tests
- Testing application state changes
- Writing reliable assertions
- Structuring an automation repository in a way that resembles a real QA automation project

---

## License

This project is distributed under the license included in the repository. See [`LICENSE`](./LICENSE) for details.
