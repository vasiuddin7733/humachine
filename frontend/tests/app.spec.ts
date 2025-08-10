import { expect, test } from '@playwright/test'

test('creates a product and advances its Flipkart listing to live promotion', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Ecommerce Control Center' })).toBeVisible()

  await page.getByLabel('Product title').fill('Desk Lamp')
  await page.getByLabel('Category').fill('Home')
  await page.getByLabel('Price').fill('39.99')
  await page.getByRole('button', { name: 'Add product' }).click()

  await expect(page.getByRole('heading', { name: 'Desk Lamp' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Amazon', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Flipkart', exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Flipkart', exact: true }).click()
  await expect(
    page.locator('span').filter({ hasText: 'Promotion: Not started' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Mark Flipkart listing ready' }).click()
  await expect(page.getByText('Ready for listing')).toBeVisible()

  await page.getByRole('button', { name: 'Submit to Flipkart' }).click()
  await expect(
    page.locator('span').filter({ hasText: 'Submitted to Flipkart' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Activate Flipkart listing' }).click()
  await expect(
    page.locator('span').filter({ hasText: 'Active on Flipkart' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Launch Flipkart promotion' }).click()
  await expect(
    page.locator('span').filter({ hasText: 'Promotion: Scheduled' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Set Flipkart campaign live' }).click()
  await expect(page.locator('span').filter({ hasText: 'Promotion: Live' })).toBeVisible()
  await expect(page.getByText('Campaign live')).toBeVisible()
})
