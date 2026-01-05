import { test, expect } from '@playwright/test';

test.describe('Candidate Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/candidates');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display candidates grid with at least one candidate', async ({ page }) => {
    // Check that candidates are displayed
    const candidateCards = page.locator('[class*="candidate-card"]');
    const count = await candidateCards.count();
    expect(count).toBeGreaterThan(0);

    // Check first candidate has required elements
    const firstCandidate = candidateCards.first();
    await expect(firstCandidate).toBeVisible();

    // Check for candidate name (heading level 3)
    const candidateName = firstCandidate.locator('h3');
    await expect(candidateName).toBeVisible();

  });

  test('should filter candidates by category', async ({ page }) => {
    // Select a specific category from dropdown
    const categoryDropdown = page.locator('select');
    await categoryDropdown.selectOption('Electronics');

    // Wait for candidates to load
    await page.waitForFunction(() => document.querySelectorAll('[class*="candidate-card"]').length > 0);

    // Verify all visible candidates are from Electronics category
    const candidateCategories = page.locator('[class*="candidate-card"] p:first-of-type');
    const count = await candidateCategories.count();

    for (let i = 0; i < count; i++) {
      const category = candidateCategories.nth(i);
      await expect(category).toHaveText('Electronics');
    }
  });

  test('should filter candidates by search term', async ({ page }) => {
    // Enter search term
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Candidate 1');

    // Wait for debounce and results
    await page.waitForFunction(() => document.querySelectorAll('[class*="candidate-card"]').length > 0);

    // Check that filtered candidates contain the search term
    const candidateNames = page.locator('[class*="candidate-card"] h3');
    const count = await candidateNames.count();

    for (let i = 0; i < count; i++) {
      const name = await candidateNames.nth(i).textContent();
      expect(name?.toLowerCase()).toContain('candidate 1');
    }
  });
});