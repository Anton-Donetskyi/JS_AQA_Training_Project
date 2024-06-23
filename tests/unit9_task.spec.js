import {test, expect} from '@playwright/test';

/**
* Test 1 - Perform Login:
* 1. Perform login using "standard_user"
* 2. On the opened page verify: 
*   Products (1) title is displayed
*   Shopping Cart icon (2) is displayed
*   More than 1 product (3) is displayed
*/

/**
* Test 2 - Add product to the cart:
* 1. Perform login using "standard_user"
* 2. Add the first product to the cart by clicking Add to Cart button
* 3. Verify Shopping Cart icon contains the number of products added (equal 1)
* 4. Open the Shopping Cart and verify the added product is displayed 
*    (the data should be taken from the Products page and used here to as an expected result)
* 5. Remove the product by clicking Remove
* 6. Verify no products are available in the Shopping Cart
*/

test.describe('Check Products title and Add Products to the cart', () => {

    test.beforeEach('Login as standart_user', async ({ page }) => {
        await page.goto('');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByTestId('login-button').click();
    });

    test('Products title is displayed', async ({ page }) => {
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('Shopping Cart icon is displayed', async ({ page }) => {
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
    });

    test('More than 1 product is displayed', async ({ page }) => {
        const productItemsCount = await page.getByTestId('inventory-item').count();
        expect(productItemsCount).toBeGreaterThan(1);
    });

    test('Test 2 - Add product to the cart', async ({ page }) => {

        // Get the first product item.
        const firstProductItem = page.locator('[data-test="inventory-item"]').nth(0);

        // Get the title of the first product item.
        const firstProductItemTitle = await firstProductItem.locator('.inventory_item_name').innerText();

        // Click to add product to the shopping cart.
        await firstProductItem.locator('[data-test*="add-to-cart"]').click();

        // Expects the shopping cart counter to equal the number of products added
        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

        // Click to open the shopping cart page
        await page.getByTestId('shopping-cart-badge').click();

        // Get the first cart item and its title
        const firstCartItem = page.locator('.cart_item').nth(0);
        const firstCartItemTitle = await firstCartItem.locator('.inventory_item_name').innerText();

        // Expects the first cart item to be the added product
        expect(firstCartItemTitle).toBe(firstProductItemTitle);

        // Click to remove the product from the cart
        await firstCartItem.locator('[data-test*="remove"]').click();

        // Expects the product was removed and cart is empty
        await expect(page.locator('.cart_item')).toHaveCount(0);
    })
})