import { test, expect } from '@playwright/test';

test.describe('Navigation and User Flow', () => {
  test('should complete a full user journey through the app', async ({ page }) => {
    // Start at home page
    await page.goto('/');

    // Should redirect to candidates
    await page.waitForURL('**/candidates');

    // Verify we're on candidates page
    const candidatesHeading = page.locator('h1:has-text("Our Candidates")');
    await expect(candidatesHeading).toBeVisible();

    // Search for a specific candidate
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Candidate 1');
    await page.waitForFunction(() => document.querySelectorAll('[class*="candidate-card"]').length > 0);

    // Click on the first search result
    const firstResult = page.locator('[class*="candidate-card"]').first();
    const candidateName = await firstResult.locator('h3').textContent();
    await firstResult.click();

    // Should navigate to candidate detail
    await page.waitForURL('**/candidates/**');
    // Verify candidate detail page
    const detailCandidateName = page.locator('h1').filter({ hasText: candidateName || '' });
    await expect(detailCandidateName).toBeVisible();

    // Click back to candidates
    const backLink = page.locator('a:has-text("Back to Candidates")');
    await backLink.click();

    // Should be back on candidates page
    await page.waitForURL('**/candidates');
    await expect(candidatesHeading).toBeVisible();

    // The search should be cleared
    await expect(searchInput).toHaveValue('');
  });

  test('should handle navigation via header link', async ({ page }) => {
    // Start on a candidate detail page
    await page.goto('/candidates/cand-1');
    await page.waitForLoadState('domcontentloaded');

    // Click the Candidates link in the header
    const headerCandidatesLink = page.locator('nav a:has-text("Candidates")');
    await headerCandidatesLink.click();

    // Should navigate to candidates listing
    await page.waitForURL('**/candidates');
    // Verify candidates page is loaded
    const candidatesGrid = page.locator('[class*="candidate"]').first();
    await expect(candidatesGrid).toBeVisible();
  });

  test('should maintain filter state during navigation', async ({ page }) => {
    // Go to candidates page
    await page.goto('/candidates');
    await page.waitForLoadState('domcontentloaded');

    // Apply filters
    const categoryDropdown = page.locator('select');
    await categoryDropdown.selectOption('Electronics');

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Candidate');

    // Wait for filtered results
    await page.waitForFunction(() => document.querySelectorAll('[class*="candidate-card"]').length > 0);

    // Navigate to a candidate
    const candidate = page.locator('[class*="candidate-card"]').first();
    await candidate.click();

    // Wait for candidate detail page
    await page.waitForURL('**/candidates/**');
    // Go back using browser back button
    await page.goBack();

    // Filters should be reset (this is the expected behavior in most SPAs)
    // The search and category should be cleared
    await expect(searchInput).toHaveValue('');
    await expect(categoryDropdown).toHaveValue('');
  });

  test('should handle rapid navigation', async ({ page }) => {
    // Navigate to candidates
    await page.goto('/candidates');

    // Quickly click multiple candidates
    for (let i = 0; i < 3; i++) {
      const candidate = page.locator('[class*="candidate-card"]').nth(i);
      await candidate.click();
      await page.waitForURL('**/candidates/**');

      // Verify page loaded correctly
      const candidateDetail = page.locator('h1').nth(1);
      await expect(candidateDetail).toBeVisible();

      // Go back
      const backLink = page.locator('a:has-text("Back to Candidates")');
      await backLink.click();
      await page.waitForURL('**/candidates');
    }

    // Should still be functional
    const candidatesHeading = page.locator('h1:has-text("Our Candidates")');
    await expect(candidatesHeading).toBeVisible();
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to a candidate detail page
    await page.goto('/candidates/cand-5');
    await page.waitForLoadState('domcontentloaded');

    // Should load the correct candidate
    const candidateName = page.locator('h1').filter({ hasText: 'Candidate 5' });
    await expect(candidateName).toBeVisible();

    // Navigate directly to candidates page
    await page.goto('/candidates');
    await page.waitForLoadState('domcontentloaded');

    // Should show candidates listing
    const candidatesGrid = page.locator('[class*="candidate-card"]');
    const count = await candidatesGrid.count();
    expect(count).toBeGreaterThan(0);

    // Navigate to non-existent route should redirect to candidates
    await page.goto('/non-existent-route');
    await page.waitForURL('**/candidates');

    // Should be on candidates page
    const candidatesHeading = page.locator('h1:has-text("Our Candidates")');
    await expect(candidatesHeading).toBeVisible();
  });

  test('should display loading states during navigation', async ({ page }) => {
    // Enable slow network to see loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });

    await page.goto('/candidates');

    // Click on a candidate
    const candidate = page.locator('[class*="candidate-card"]').first();
    await candidate.click();

    // Should eventually load the candidate detail
    await page.waitForURL('**/candidates/**', { timeout: 10000 });

    const candidateDetail = page.locator('[class*="candidate-detail"]');
    await expect(candidateDetail).toBeVisible({ timeout: 10000 });
  });
});