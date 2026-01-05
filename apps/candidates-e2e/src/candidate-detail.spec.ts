import { test, expect } from '@playwright/test';

test.describe('Candidate Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to candidates page first
    await page.goto('/candidates');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should navigate to candidate detail when clicking a candidate', async ({ page }) => {
    // Click on the first candidate
    const firstCandidate = page.locator('[class*="candidate-card"]').first();
    await firstCandidate.click();

    // Wait for navigation
    await page.waitForURL('**/candidates/**');
    // Verify URL changed to candidate detail
    expect(page.url()).toMatch(/\/candidates\/candidate-\d+/);

    // Verify back link is visible
    const backLink = page.locator('a:has-text("Back to Candidates")');
    await expect(backLink).toBeVisible();
  });

  test('should display complete candidate information', async ({ page }) => {
    // Navigate directly to a candidate detail page
    await page.goto('/candidates/candidate-1');
    await page.waitForLoadState('domcontentloaded');

    // Check candidate name
    const candidateName = page.locator('h1').filter({ hasText: /Candidate \d+/ });
    await expect(candidateName).toBeVisible();

    // Check candidate information section
    const candidateInfoHeading = page.locator('h3:has-text("Candidate Information")');
    await expect(candidateInfoHeading).toBeVisible();

    // Check candidate ID
    const candidateId = page.locator('text=/candidate-\\d+/');
    await expect(candidateId).toBeVisible();

    // Check availability
    const availability = page.locator('text=/In Stock|Out of Stock/');
    await expect(availability).toBeVisible();
  });

  test('should show action buttons for in-stock candidates', async ({ page }) => {
    // Navigate to candidates page
    await page.goto('/candidates');

    // Find an in-stock candidate (one without "Out of Stock" badge)
    const inStockCandidate = page.locator('[class*="candidate-card"]').filter({ hasNot: page.locator('text="Out of Stock"') }).first();
    await inStockCandidate.click();

    // Wait for candidate detail page
    await page.waitForURL('**/candidates/**');
    // Check for Add to Cart button
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();

    // Check for Add to Wishlist button
    const addToWishlistButton = page.locator('button:has-text("Add to Wishlist")');
    await expect(addToWishlistButton).toBeVisible();
    await expect(addToWishlistButton).toBeEnabled();

    // Test clicking Add to Cart (should show alert)
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Candidate added to cart');
      dialog.accept();
    });
    await addToCartButton.click();
  });

  test('should navigate back to candidates list', async ({ page }) => {
    // Navigate to a candidate detail page
    await page.goto('/candidates/candidate-1');
    await page.waitForLoadState('domcontentloaded');

    // Click the back link
    const backLink = page.locator('a:has-text("Back to Candidates")');
    await backLink.click();

    // Should navigate back to candidates page
    await page.waitForURL('**/candidates');
    expect(page.url()).toContain('/candidates');

    // Candidates grid should be visible
    const candidatesGrid = page.locator('[class*="candidate-grid"], [class*="candidates"]');
    await expect(candidatesGrid).toBeVisible();
  });
});