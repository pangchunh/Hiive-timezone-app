import { test, expect, Page, chromium } from '@playwright/test';
import { locators } from './locator';
import { domain, addNewEntry, timezoneOptions } from './util';

test.beforeEach(async ({ page }) => {
  await page.goto(domain)
})

test('Automatically create a local timezone record in the table', async ({ page }) => {
  const localTableRow = page.getByRole('row').filter({ hasText: 'Local(You)' })
  await expect(localTableRow).toBeVisible()
});

test('Local timezone record should reflect the current time in the browser timezone', async ({ page }) => {
  const localTableRow = page.getByRole('row').filter({ hasText: 'Local(You)' })
  const localTime = await localTableRow.getByRole('cell').nth(2).innerText()
  const browserTime = new Date().toLocaleTimeString([], { 'timeStyle': 'short' })

  expect(localTime).toBe(browserTime)
})

//This test should fail because of the current bug
test("Should hide delete button for users' local record", async ({ page }) => {
  const localTableRow = page.getByRole('row').filter({ hasText: 'Local(You)' })
  const deleteButton = localTableRow.getByRole('button', { name: 'Delete' })

  await expect(deleteButton).not.toBeVisible()
})

test("Should display the add timezone form after clicking the button", async ({ page }) => {
  const addTimezoneButton = page.getByRole('button', { name: 'Add timezone' })  
  await addTimezoneButton.click()
  const labelInput = page.getByRole('textbox', { name: 'Label' })
  const timezoneSelect = page.locator(locators.timezoneSelectLocator)
  const saveButton = page.getByRole('button', {name: 'Save'})
  await expect(labelInput).toBeVisible()
  await expect(timezoneSelect).toBeVisible()
  await expect(saveButton).toBeVisible()
})

//This test should fail because of the current bug
test("Should contain correct options in the timezone select", async ({ page }) => {
  const addTimezoneButton = page.getByRole('button', { name: 'Add timezone' })
  await addTimezoneButton.click()
  const timezoneSelect = await page.locator(locators.timezoneSelectLocator)
  const timezoneSelectOptions = await timezoneSelect.getByRole('option').allInnerTexts()
  for (const timezone of timezoneOptions) {
    expect(timezoneSelectOptions).toContain(timezone.label)
  }
  //our timezone select options only contain america's timezones, so the test will fail here.
  expect(timezoneSelectOptions).toContain('Central European Standard Time')
})

test('Should be able to add a new timezone record', async ({ page }) => {
  await addNewEntry(page, 'Testing new record', 'America/New_York')

  const newRecordRow = await page.getByRole('row').filter({ hasText: 'Testing new record' })
  const newRecordTimezone = await newRecordRow.getByRole('cell').nth(1).innerText()
  const newRecordLocalTime = await newRecordRow.getByRole('cell').nth(2).innerText()

  await expect(newRecordRow).toBeVisible()
  expect(newRecordTimezone).toBe('America/New_York')
  expect(newRecordLocalTime).toBe(new Date().toLocaleTimeString([], { timeStyle: 'short', timeZone: 'America/New_York' }))
})

test('Should be able to delete a timezone record', async ({ page }) => {
  await addNewEntry(page, 'Testing delete record', 'America/New_York')
  const newRecordRow = await page.getByRole('row').filter({ hasText: 'Testing delete record' })
  const deleteButton = newRecordRow.getByRole('button', { name: 'Delete' })
  await deleteButton.click()

  await expect(newRecordRow).not.toBeVisible()
})

test("Should be able to add multiple timezone records", async ({ page }) => {
  for (const timezone of timezoneOptions) {
    await addNewEntry(page, timezone.label, timezone.value)
    const newRecordRow = await page.getByRole('row').filter({ hasText: timezone.label})
    const newRecordTimezone = await newRecordRow.getByRole('cell').nth(1).innerText()
    const newRecordLocalTime = await newRecordRow.getByRole('cell').nth(2).innerText()

    await expect(newRecordRow).toBeVisible()
    expect(newRecordTimezone).toBe(timezone.value)
    expect(newRecordLocalTime).toBe(new Date().toLocaleTimeString([], { timeStyle: 'short', timeZone: timezone.value }))
  }
})

//This test should fail because of the current bug
test("Should be able to add multiple timezone records with different labels at the same timezone", async ({ page }) => {
  await addNewEntry(page, 'Testing new record 1', 'America/New_York')
  await addNewEntry(page, 'Testing new record 2', 'America/New_York')
  const newRecord1 = await page.getByRole('row').filter({ hasText: 'Testing new record 1' })
  const newRecord2 = await page.getByRole('row').filter({ hasText: 'Testing new record 2' })
  
  await expect(newRecord1).toBeVisible()
  await expect(newRecord2).toBeVisible()
  
  const newRecord1Timezone = await newRecord1.getByRole('cell').nth(1).innerText()
  const newRecord2Timezone = await newRecord2.getByRole('cell').nth(1).innerText()
  const newRecord1LocalTime = await newRecord1.getByRole('cell').nth(2).innerText()
  const newRecord2LocalTime = await newRecord2.getByRole('cell').nth(2).innerText()
  
  expect(newRecord1Timezone).toBe('America/New_York')
  expect(newRecord2Timezone).toBe('America/New_York')
  expect(newRecord1LocalTime).toBe(new Date().toLocaleTimeString([], { timeStyle: 'short', timeZone: 'America/New_York' }))
  expect(newRecord2LocalTime).toBe(new Date().toLocaleTimeString([], { timeStyle: 'short', timeZone: 'America/New_York' }))
})

//This test should fail because of the current bug
test("Should only delete the record that the delete button is associated with", async ({ page }) => {
  await addNewEntry(page, "Testing 1", "America/New_York")
  await addNewEntry(page, "Testing 1", "America/Los_Angeles")
  const newRecord1 = await page.getByRole('row').filter({ hasText: 'Testing 1' }).first()
  const newRecord2 = await page.getByRole('row').filter({ hasText: 'Testing 1' }).last()

  await expect(newRecord1, "record 1 is not visible").toBeVisible()
  await expect(newRecord2, "record 2 is not visible").toBeVisible()
  
  const deleteButton1 = newRecord1.getByRole('button', { name: 'Delete' })
  await deleteButton1.click()

  await expect(newRecord1).not.toBeVisible()
  await expect(newRecord2).toBeVisible()
})

//This test should fail because of the current bug
test("Should sort the table by local time", async ({ page }) => {
  const testData = [{ label: "1", timezone: "America/New_York" }, { label: "2", timezone: "America/Los_Angeles" }, { label: "3", timezone: "America/Chicago" }]
  for (const data of testData) {
    await addNewEntry(page, data.label, data.timezone)
  }
  const table = page.getByRole('table')
  const tableRows = await table.locator(locators.tableBodyRowLocator).all()
  const tableRowsLocalTime = []
  for (const row of tableRows) {
    const localTime = await row.getByRole('cell').nth(2).innerText()
    tableRowsLocalTime.push(localTime)
  }
  const sortedTableRowsLocalTime = Array.from(tableRowsLocalTime).sort()
  
  expect(tableRowsLocalTime).toEqual(sortedTableRowsLocalTime)
})

//This test should fail because of the current bug
test("Should sort the table after deleting a record", async ({ page }) => {
  const testData = [{ label: "1", timezone: "America/New_York" }, { label: "2", timezone: "America/Los_Angeles" }, { label: "3", timezone: "America/Chicago" }, { label: "4", timezone: "America/Juneau"}]
  for (const data of testData) {
    await addNewEntry(page, data.label, data.timezone)
  }
  const table = page.getByRole('table')
  const tableRows = await table.locator(locators.tableBodyRowLocator).all()
  const tableRowsLocalTime = []
  for (const row of tableRows) {
    const localTime = await row.getByRole('cell').nth(2).innerText()
    tableRowsLocalTime.push(localTime)
  }
  const newRecord1 = await page.getByRole('row').filter({ hasText: '1' }).first()
  const deleteButton1 = await newRecord1.getByRole('button', { name: 'Delete' })
  await deleteButton1.click()
  const newTableRows = await table.locator(locators.tableBodyRowLocator).all()
  const newTableRowsLocalTime = []
  for (const row of newTableRows) {
    const localTime = await row.getByRole('cell').nth(2).innerText()
    newTableRowsLocalTime.push(localTime)
  }
  const newSortedTableRowsLocalTime = Array.from(newTableRowsLocalTime).sort()

  expect(newTableRowsLocalTime).toEqual(newSortedTableRowsLocalTime)
})

//This test should fail because of the current bug
test("Should change local entry when browser timezone changes", async ({ page }) => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ timezoneId: 'America/Vancouver'})
  const page1 = await context.newPage()
  await page1.goto(domain)

  //set the browser location to london
  context.setGeolocation({ latitude: 51.5072, longitude: 0.1276 })
  await page1.reload()
  const localTableRow = page.getByRole('row').filter({ hasText: 'Local(You)' })
  const localTime = await localTableRow.getByRole('cell').nth(2).innerText()
  const browserTime = new Date().toLocaleTimeString([], { 'timeStyle': 'short', timeZone: 'Europe/London' })
  expect(localTime).toBe(browserTime)
})




