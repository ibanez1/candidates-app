import { test, expect } from '@playwright/test';
import { resolve } from 'path';

test.describe('Create Candidate', () => {
  test('should open candidate form modal', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for the page to be ready
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the add button to be visible
    const addButton = page.locator('button.add-candidate-btn');
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify the button text
    await expect(addButton).toHaveText('Add Candidate');
    
    // Click the add button
    await addButton.click();
    
    // Wait for modal to appear
    await page.waitForTimeout(1000);
    
    // Verify form is visible in modal
    const form = page.locator('form').first();
    await expect(form).toBeVisible({ timeout: 5000 });
    
    // Verify form has name and surname inputs
    await expect(page.locator('input[formControlName="name"]')).toBeVisible();
    await expect(page.locator('input[formControlName="surname"]')).toBeVisible();
  });

  test('should display the candidates list', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for table to be visible
    const table = page.locator('table');
    await table.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify table headers exist (use first() to handle strict mode)
    await expect(page.locator('th:has-text("Name")').first()).toBeVisible();
    await expect(page.locator('th:has-text("Surname")').first()).toBeVisible();
    await expect(page.locator('th:has-text("Seniority")').first()).toBeVisible();
  });

  test('should show action buttons for each candidate row', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for table to be visible
    const table = page.locator('table');
    await table.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get the first row in the table body
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();
    
    // Verify action buttons exist in the row (SVG icons for view and delete)
    const viewButton = firstRow.locator('button[aria-label="View"]');
    const deleteButton = firstRow.locator('button[aria-label="Delete"]');
    
    await expect(viewButton).toBeVisible();
    await expect(deleteButton).toBeVisible();
  });

  test('should have paginator controls', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for table to be visible
    const table = page.locator('table');
    await table.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verify paginator exists
    const paginator = page.locator('mat-paginator');
    await expect(paginator).toBeVisible();
    
    // Verify paginator has navigation buttons
    const paginatorButtons = paginator.locator('button');
    const buttonCount = await paginatorButtons.count();
    
    // Should have at least 2 buttons (previous and next)
    expect(buttonCount).toBeGreaterThanOrEqual(2);
  });

  test('should display at least one candidate in the table', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for table to be visible
    const table = page.locator('table');
    await table.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get all rows in the table body
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    
    // Should have at least one candidate
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify first row has data in cells
    const firstRow = rows.first();
    const cells = firstRow.locator('td');
    const cellCount = await cells.count();
    
    // Should have multiple cells with data
    expect(cellCount).toBeGreaterThan(0);
  });

  test('should fill candidate form and upload file', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for the add button and click it
    const addButton = page.locator('button.add-candidate-btn');
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click();
    
    // Wait for form to appear
    await page.waitForTimeout(1000);
    const form = page.locator('form').first();
    await expect(form).toBeVisible({ timeout: 5000 });
    
    // Fill name and surname
    await page.locator('input[formControlName="name"]').fill('TestUser');
    await page.locator('input[formControlName="surname"]').fill('E2E');
    
    // Upload Excel file
    const filePath = resolve(__dirname, 'fixtures', 'test.xlsx');
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Wait for file validation message
    await page.waitForTimeout(500);
    
    // Verify submit button exists
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    // Verify form fields are filled
    await expect(page.locator('input[formControlName="name"]')).toHaveValue('TestUser');
    await expect(page.locator('input[formControlName="surname"]')).toHaveValue('E2E');
  });

  test('should view candidate details when clicking view button', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates', { waitUntil: 'load' });
    
    // Wait for table to be visible
    const table = page.locator('table');
    await table.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get the first row and click the view button
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();
    
    // Find and click the view button in the first row
    const viewButton = firstRow.locator('button[aria-label="View"]');
    await viewButton.click();
    
    // Wait for modal to appear with candidate details
    await page.waitForTimeout(1000);
    
    // Verify modal is open with candidate info
    const modalContent = page.locator('.modal-content-custom');
    await expect(modalContent).toBeVisible({ timeout: 5000 });
    
    // Verify the modal contains candidate name
    const modalTitle = page.locator('.modal-title');
    await expect(modalTitle).toBeVisible();
    
    // Verify title is not empty (contains candidate info: name and surname)
    await expect(modalTitle).not.toHaveText('');
  });
});
