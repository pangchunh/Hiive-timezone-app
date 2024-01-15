import { test, expect, Page } from '@playwright/test';

const localTableRowLocator = 'tr:has(td:has(div:has-text("Local"), span:has-text("(You)")))'
const addTimezoneButtonLocator = 'button:has-text("Add timezone")'
const labelInputLocator = 'input[name="label"]'
const timezoneSelectLocator = 'select[name="timezone"]'
const saveButtonLocator = 'button:has-text("Save")'

const addNewEntry = async (page: Page, name: string, timezone: string) =>{
  const addTimezoneButton = await page.locator(addTimezoneButtonLocator)
  await addTimezoneButton.click()
  const labelInput = await page.locator(labelInputLocator)
  const timezoneSelect = await page.locator(timezoneSelectLocator)
  await labelInput.fill(name)
  await timezoneSelect.selectOption({value: timezone})
  const saveButton = await page.locator(saveButtonLocator)
  await saveButton.click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000')
})

test('Should automatically create a local timezone record in the table', async ({ page }) => {
  const localTableRow = page.locator(localTableRowLocator);
  await expect(localTableRow).toBeVisible()
});

test('Local timezone record should reflect the current time in the browser timezone', async ({page}) => {
  const localTableRow = await page.locator(localTableRowLocator)
  const localTime = await localTableRow.locator('td:nth-child(3)').innerText()
  //extract the current time in the browser timezone in 24 hour format (HH:MM)
  const browserTime = new Date().toLocaleTimeString([], {'timeStyle': 'short'})
  await expect(localTime).toBe(browserTime)
})

test("Delete button should be hidden for users' local record", async({page}) => {
  const localTableRow = await page.locator(localTableRowLocator)
  const deleteButton = await localTableRow.locator('td:nth-child(4) button')
  await expect(deleteButton).toBeHidden()
})

test("Should be able to display the add timezone form", async ({page}) => {
  const addTimezoneButton = await page.locator(addTimezoneButtonLocator)
  await addTimezoneButton.click()
  const labelInput = await page.locator(labelInputLocator)
  const timezoneSelect = await page.locator(timezoneSelectLocator)
  const saveButton = await page.locator(saveButtonLocator)

  await expect(labelInput).toBeVisible()
  await expect(timezoneSelect).toBeVisible()
  await expect(saveButton).toBeVisible()
})

test('Should be able to add a new timezone record', async ({ page }) => {
  await addNewEntry(page, 'Testing new record', 'America/New_York')
  const newRecord = await page.locator('tr:has(td:has(div:has-text("Testing new record")))')
  await expect(newRecord).toBeVisible()
})
