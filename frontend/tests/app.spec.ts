import { expect, test } from '@playwright/test'

test('uploads images, saves a product, and advances its Flipkart listing to live promotion', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Seller Catalog Hub' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Upload product images' })).toBeVisible()

  await page.getByLabel('Product title').fill('Desk Lamp')
  await page.getByLabel('Product category').fill('Home')
  await page.getByLabel('Price').fill('39.99')
  await page.getByRole('button', { name: 'Save product draft' }).click()

  await expect(page.getByText('Desk Lamp').first()).toBeVisible()

  const flipkartBlock = page.getByLabel('Flipkart catalog listing')
  await expect(flipkartBlock).toBeVisible()

  await flipkartBlock.getByRole('button', { name: 'Continue' }).click()
  await flipkartBlock.getByRole('button', { name: 'Continue' }).click()

  await flipkartBlock.getByRole('button', { name: 'Mark Flipkart listing ready' }).click()
  await expect(flipkartBlock.getByText('Ready for listing')).toBeVisible()

  await flipkartBlock.getByRole('button', { name: 'Submit to Flipkart' }).click()
  await expect(flipkartBlock.getByText('Submitted to Flipkart')).toBeVisible()

  await flipkartBlock.getByRole('button', { name: 'Activate Flipkart listing' }).click()
  await expect(flipkartBlock.getByText('Active on Flipkart')).toBeVisible()

  await flipkartBlock.getByRole('button', { name: 'Launch Flipkart promotion' }).click()
  await expect(flipkartBlock.getByText('Promotion: Scheduled')).toBeVisible()

  await flipkartBlock.getByRole('button', { name: 'Set Flipkart campaign live' }).click()
  await expect(flipkartBlock.getByText('Promotion: Live')).toBeVisible()
})
