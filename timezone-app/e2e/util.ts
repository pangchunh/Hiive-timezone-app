import { Page } from '@playwright/test'
import { locators } from './locator';

export const domain = 'localhost:3000'

export const timezoneOptions = [
  { label: "Eastern Standard Time", value: "America/New_York" },
  { label: "Central Standard Time", value: "America/Chicago" },
  { label: "Mountain Standard Time", value: "America/Denver" },
  { label: "Pacific Standard Time", value: "America/Los_Angeles" },
  { label: "Alaska Standard Time", value: "America/Juneau" },
  { label: "Hawaii-Aleutian Standard Time", value: "Pacific/Honolulu" },
];

export const expectedTableHeaders = ['Label', 'Timezone', 'Local Time', 'Delete']

//A reusable function to add a new entry to the table in the application
export const addNewEntry = async (page: Page, name: string, timezone: string) => {
  const addTimezoneButton = await page.getByRole('button', { name: 'Add timezone' })
  await addTimezoneButton.click()
  const labelInput = await page.getByRole('textbox', { name: 'Label' })
  const timezoneSelect = await page.locator(locators.timezoneSelectLocator)
  await labelInput.fill(name)
  await timezoneSelect.selectOption({ value: timezone })
  const saveButton = await page.getByRole('button', { name: 'Save' })
  await saveButton.click()
}