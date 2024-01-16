import { Page } from '@playwright/test'
import { locators } from './locator';

export const timezoneOptions = [
  { label: "Eastern Standard Time", value: "America/New_York" },
  { label: "Central Standard Time", value: "America/Chicago" },
  { label: "Mountain Standard Time", value: "America/Denver" },
  { label: "Pacific Standard Time", value: "America/Los_Angeles" },
  { label: "Alaska Standard Time", value: "America/Juneau" },
  { label: "Hawaii-Aleutian Standard Time", value: "Pacific/Honolulu" },
];

//A reusable function to add a new entry to the table in the application
export const addNewEntry = async (page: Page, name: string, timezone: string) => {
  const addTimezoneButton = await page.locator(locators.addTimezoneButtonLocator)
  await addTimezoneButton.click()
  const labelInput = await page.locator(locators.labelInputLocator)
  const timezoneSelect = await page.locator(locators.timezoneSelectLocator)
  await labelInput.fill(name)
  await timezoneSelect.selectOption({ value: timezone })
  const saveButton = await page.locator(locators.saveButtonLocator)
  await saveButton.click()
}