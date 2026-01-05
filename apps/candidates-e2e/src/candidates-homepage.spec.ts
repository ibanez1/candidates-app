import { test, expect } from '@playwright/test';

test.describe('Candidates Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main header and navigation', async ({ page }) => {
    // Check header title
    const header = page.locator('h1').first();
    await expect(header).toContainText('Nx Candidates Demo');

    // Check navigation link exists
    const candidatesLink = page.locator('nav a:has-text("Candidates")');
    await expect(candidatesLink).toBeVisible();
    await expect(candidatesLink).toHaveAttribute('href', '/candidates');
  });

  test('should display footer with copyright information', async ({ page }) => {
    // Check footer content
    const footer = page.locator('footer');
    await expect(footer).toContainText('© 2025 Nx Candidates Demo');
    await expect(footer).toContainText(
      'Frontend (Angular) + Backend (Express) + Shared Libraries'
    );
  });

  test('should redirect to candidates page by default', async ({ page }) => {
    // The app should redirect from / to /candidates
    await page.waitForURL('**/candidates');
    expect(page.url()).toContain('/candidates');

    // Verify we're on the candidates page
    const candidatesHeading = page.locator('h1:has-text("Our Candidates")');
    await expect(candidatesHeading).toBeVisible();
  });

  test('should have proper page title and meta', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/candidates/i);

    // Check viewport is responsive
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
  });
});
