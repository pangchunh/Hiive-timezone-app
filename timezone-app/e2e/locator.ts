// Locator constants for the e2e tests
export const locators = {
  localTableRowLocator:'tr:has(td:has(div:has-text("Local"), span:has-text("(You)")))',
  addTimezoneButtonLocator: 'button:has-text("Add timezone")',
  labelInputLocator: 'input[name="label"]',
  timezoneSelectLocator: 'select[name="timezone"]',
  saveButtonLocator: 'button:has-text("Save")',
  timezoneTdLocator: 'td:nth-child(2)',
  localTimeTdLocator: 'td:nth-child(3)',
  deleteButtonTdLocator: 'td:nth-child(4) button',

}

