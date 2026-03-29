import { expect, test } from '@playwright/test';

test.describe('Player Listing Page', () => {
  test('should load the page and render the Player Listing component', async ({ page }) => {
    // Navigate to the player listing page
    await page.goto('/playerListing');

    // Check that the sidebar container and header exist
    await expect(page.locator('text=Find Your Squad')).toBeVisible();

    // Check that the search input and game select dropdown are present
    await expect(page.getByPlaceholder('e.g. Vortex...')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();

    // Interact with the filters to ensure they are responsive
    await page.fill('input[placeholder="e.g. Vortex..."]', 'TestPlayer');
    await page.click('button:has-text("Search")');
    
    // Clear the filters
    await page.click('button:has-text("Clear All")');
    
    // Check if the input value successfully cleared
    await expect(page.getByPlaceholder('e.g. Vortex...')).toHaveValue('');
  });
});
