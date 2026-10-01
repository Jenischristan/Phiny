import { test, expect } from '@playwright/test';

test.describe('Phiny E2E Test Suite', () => {
  test.describe('Flow 1 — Home & Feed Discovery', () => {
    test('loads home feed with pins and navigates to post detail and back', async ({ page }) => {
      await page.goto('/');

      // Verify title or logo
      await expect(page).toHaveTitle(/Phiny/i);

      // Verify pins appear
      const pinCards = page.locator('article');
      await expect(pinCards.first()).toBeVisible();
      const count = await pinCards.count();
      expect(count).toBeGreaterThan(0);

      // Click first pin
      const firstPinLink = pinCards.first().locator('a[href^="/post/"]');
      const pinTitle = await pinCards.first().locator('figcaption p').first().textContent();
      await firstPinLink.click();

      // Verify URL is /post/[id]
      await expect(page).toHaveURL(/\/post\/\w+/);

      // Verify post details loaded
      await expect(page.locator('h1, section[aria-label="Post details"]')).toBeVisible();

      // Click Back
      await page.getByRole('button', { name: /Back/i }).click();

      // Should be back at Home
      await expect(page).toHaveURL('/');
      await expect(page.locator('article').first()).toBeVisible();
    });
  });

  test.describe('Flow 2 — Search Functionality & Navigation', () => {
    test('searches from home feed and displays results', async ({ page }) => {
      await page.goto('/');

      const searchInput = page.getByRole('combobox');
      await searchInput.fill('concrete');
      await searchInput.press('Enter');

      // Verify results text appears
      await expect(page.getByText(/Results for “concrete”/i)).toBeVisible();

      // Clear search
      await page.getByRole('button', { name: /Clear/i }).click();
      await expect(page.getByText(/Results for “concrete”/i)).not.toBeVisible();
    });

    test('search for nonexistent content displays empty state', async ({ page }) => {
      await page.goto('/');

      const searchInput = page.getByRole('combobox');
      await searchInput.fill('nonexistentxyzterm12345');
      await searchInput.press('Enter');

      await expect(page.getByText(/Try another search/i)).toBeVisible();
    });

    test('REGRESSION: searching from /settings navigates to feed with results', async ({ page }) => {
      // Direct navigation to settings (when signed out it shows empty with Log in CTA)
      await page.goto('/settings');

      const searchInput = page.getByRole('combobox');
      await searchInput.fill('light');
      await searchInput.press('Enter');

      // Verify it navigated back to home/feed
      await expect(page).toHaveURL('/');
      await expect(page.getByText(/Results for “light”/i)).toBeVisible();
    });
  });

  test.describe('Flow 3 — Post & Creator Navigation', () => {
    test('views post details and navigates to creator profile', async ({ page }) => {
      await page.goto('/post/0');

      // Verify post title
      await expect(page.getByText('Concrete Light')).toBeVisible();

      // Click creator profile link
      const creatorLink = page.locator('section[aria-label="Post details"] a[href^="/profile/"]').first();
      await creatorLink.click();

      // Verify profile URL and content
      await expect(page).toHaveURL(/\/profile\/\w+/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  test.describe('Flow 4 — Collections & Boards', () => {
    test('opens collection page directly via URL', async ({ page }) => {
      await page.goto('/collection/c0');

      // Verify title and collection elements
      await expect(page.getByText('Type Specimens')).toBeVisible();
      await expect(page.getByRole('button', { name: /Back/i })).toBeVisible();
    });

    test('invalid collection URL displays unavailable state', async ({ page }) => {
      await page.goto('/collection/invalid_id_999');
      await expect(page.getByText(/COLLECTION UNAVAILABLE/i)).toBeVisible();
    });
  });

  test.describe('Flow 5 — Authentication & Forgot Password', () => {
    test('opens login dialog, validates form, and supports forgot password flow', async ({ page }) => {
      await page.goto('/');

      // Click Log in button
      await page.getByRole('button', { name: 'Log in' }).first().click();

      // Verify login modal appears
      await expect(page.getByRole('dialog', { name: /Sign in to Phiny/i })).toBeVisible();

      // Click Sign in without inputs to test validation
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText(/Enter your username or email/i)).toBeVisible();

      // REGRESSION: Click Forgot your password?
      await page.getByRole('button', { name: /Forgot your password\?/i }).click();

      // Verify email input is displayed
      await expect(page.getByRole('dialog', { name: /Reset password/i })).toBeVisible();
      const emailInput = page.getByLabelText(/Email address/i);
      await expect(emailInput).toBeVisible();

      // Submit reset email
      await emailInput.fill('user@example.com');
      await page.getByRole('button', { name: /Send reset link/i }).click();

      // Verify confirmation state
      await expect(page.getByText(/Check your inbox for a link to reset your password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Back to sign in/i })).toBeVisible();
    });
  });

  test.describe('Flow 6 — Responsive Layouts', () => {
    test('verifies mobile viewport bottom navigation', async ({ page }) => {
      // Set iPhone 12/13 mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');

      // Verify bottom navigation is visible
      const bottomNav = page.locator('nav[aria-label="Primary"]').filter({ has: page.locator('a[href="/explore"]') });
      await expect(bottomNav).toBeVisible();

      // Click Explore in bottom nav
      await bottomNav.locator('a[href="/explore"]').click();
      await expect(page).toHaveURL('/explore');
    });

    test('verifies desktop viewport sidebar', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');

      // Verify sidebar is visible
      const sidebar = page.locator('aside').first();
      await expect(sidebar).toBeVisible();
      await expect(sidebar.locator('a[href="/explore"]')).toBeVisible();
    });
  });
});
