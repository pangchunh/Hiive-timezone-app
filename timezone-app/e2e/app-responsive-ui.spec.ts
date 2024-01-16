import { test, expect } from '@playwright/test';
import { locators } from './locator';
import { domain, expectedTableHeaders } from './util';

test.beforeEach(async ({ page }) => {
  await page.goto(domain)
})

test('Should show all table headers in wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  const table = page.getByRole('table')
  const tableHeaders = await table.locator(locators.tableHeaderLocator).allInnerTexts()
  await expect(tableHeaders).toEqual(['Label', 'Timezone', 'Local Time', 'Delete'])
})

test('Should show all table headers in mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 })
  const table = page.getByRole('table')
  const tableHeaders = await table.locator(locators.tableHeaderLocator).allInnerTexts()
  await expect(tableHeaders).toEqual(expectedTableHeaders)
})

test('Should show all table data in wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  const table = page.getByRole('table')
  const localEntryRow = await table.getByRole('row').filter({ hasText: 'Local(You)' })
  const localEntryRowColumns = await localEntryRow.locator(locators.tableDataLocator).all()
  for (const column of localEntryRowColumns) {
    await expect(column).toBeVisible()
  }})


//This test should fail because of the current bug
test('Should show all table data in mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 })
  const table = page.getByRole('table')
  const localEntryRow = await table.getByRole('row').filter({ hasText: 'Local(You)' })
  //using locators here because we want to get all table data cells, not just the one showing in the UI
  const localEntryRowColumns = await localEntryRow.locator(locators.tableDataLocator).all()
  for (const column of localEntryRowColumns) {
    await expect(column).toBeVisible()
  }
})
