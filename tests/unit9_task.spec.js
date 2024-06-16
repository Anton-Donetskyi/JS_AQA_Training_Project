import {test, expect} from '@playwright/test';

test.describe('Check Products title and Add Products to the cart', () => {

    test.beforeEach('Login as standart_user', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
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

        const listOfProducts = await page.locator('[data-test="inventory-item"]').all();
        const firstProductItemTitle = await listOfProducts[0].locator('.inventory_item_name').innerText()

        //await listOfProducts[0].getByRole('button', { name: 'Add to Cart' }).click();
        // more universal as I understood
        await listOfProducts[0].locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
        await page.getByTestId('shopping-cart-badge').click();

        const cartItems = await page.locator('.cart_item').all();
        const cartItemTitle = await cartItems[0].locator('.inventory_item_name').innerText();
        expect(cartItemTitle).toBe(firstProductItemTitle);
        await cartItems[0].getByTestId('remove-sauce-labs-backpack').click();
        //await expect(cartItems).toHaveLength(0);
        expect(await page.locator('.cart_item').count()).toEqual(0);

    })
})