import { test, expect } from '@playwright/test';
import { locators } from './locator';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000')
})

test('Should show all table headers in wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  const table = page.locator('table')
  const tableHeaders = await table.locator('th').allInnerTexts()
  console.log(tableHeaders)
  await expect(tableHeaders).toEqual(['Label', 'Timezone', 'Local Time', 'Delete'])
})

test('Should show all table headers in mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 })
  const table = page.locator('table')
  const tableHeaders = await table.locator('th').allInnerTexts()
  console.log(tableHeaders)
  await expect(tableHeaders).toEqual(['Label', 'Timezone', 'Local Time', 'Delete'])
})

test('Should show all table data in wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  const table = page.locator('table')
  const localEntryRow = await table.locator(locators.localTableRowLocator)
  const localEntryRowColumns = await localEntryRow.locator('td').all()
  for (const column of localEntryRowColumns) {
    await expect(column).toBeVisible()
  }})


//This test should fail because of the current bug
test('Should show all table data in mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 })
  const table = page.locator('table')
  const localEntryRow = await table.locator(locators.localTableRowLocator)
  const localEntryRowColumns = await localEntryRow.locator('td').all()
  for (const column of localEntryRowColumns) {
    await expect(column).toBeVisible()
  }
})
